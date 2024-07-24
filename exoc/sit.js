function errorBarAggregationAndCalculation(markDef, continuousAxisChannelDef, continuousAxisChannelDef2, continuousAxisChannelDefError, continuousAxisChannelDefError2, inputType, compositeMark, config) {
    // Validate input parameters
    if (!markDef || !continuousAxisChannelDef || !inputType || !compositeMark) {
        throw new Error('Required parameters are missing');
    }

    // Define default configurations (these can be overridden by the provided config)
    const defaultConfig = {
        errorBar: {
            extent: 'stderr'  // Standard error by default
        }
    };

    // Merge user-provided config with default config
    const finalConfig = { ...defaultConfig, ...config };

    // Extract relevant properties from the continuous axis channel definitions
    const continuousField = continuousAxisChannelDef.field;
    const continuousField2 = continuousAxisChannelDef2 ? continuousAxisChannelDef2.field : null;
    const errorField = continuousAxisChannelDefError ? continuousAxisChannelDefError.field : null;
    const errorField2 = continuousAxisChannelDefError2 ? continuousAxisChannelDefError2.field : null;

    // Start constructing the Vega-Lite specification
    const spec = {
        data: {
            name: 'source'
        },
        mark: compositeMark,
        encoding: {
            x: {
                field: continuousField,
                type: inputType
            },
            y: {
                field: continuousField2,
                type: inputType
            },
            tooltip: [
                { field: continuousField, type: inputType },
                { field: continuousField2, type: inputType },
                { field: errorField, type: 'quantitative' },
                { field: errorField2, type: 'quantitative' }
            ]
        },
        transform: [],
        config: finalConfig
    };

    // Add error bar transformations based on provided fields
    if (errorField && errorField2) {
        spec.transform.push({
            calculate: `${continuousField} + datum.${errorField}`,
            as: 'upper_bound'
        });
        spec.transform.push({
            calculate: `${continuousField} - datum.${errorField2}`,
            as: 'lower_bound'
        });

        spec.encoding.y2 = { field: 'upper_bound' };
        spec.encoding.y = { field: 'lower_bound' };
    } else if (errorField) {
        spec.transform.push({
            calculate: `${continuousField} + datum.${errorField}`,
            as: 'upper_bound'
        });
        spec.transform.push({
            calculate: `${continuousField} - datum.${errorField}`,
            as: 'lower_bound'
        });

        spec.encoding.y2 = { field: 'upper_bound' };
        spec.encoding.y = { field: 'lower_bound' };
    }

    return spec;
}

// Example usage:
const markDef = { type: 'errorbar' };
const continuousAxisChannelDef = { field: 'value', type: 'quantitative' };
const continuousAxisChannelDef2 = null;
const continuousAxisChannelDefError = { field: 'error', type: 'quantitative' };
const continuousAxisChannelDefError2 = null;
const inputType = 'quantitative';
const compositeMark = 'errorbar';
const config = { errorBar: { extent: 'stdev' } };

const spec = errorBarAggregationAndCalculation(
    markDef,
    continuousAxisChannelDef,
    continuousAxisChannelDef2,
    continuousAxisChannelDefError,
    continuousAxisChannelDefError2,
    inputType,
    compositeMark,
    config
);

console.log(JSON.stringify(spec, null, 2));
