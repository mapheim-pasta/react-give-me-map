import { Expression } from 'mapbox-gl';
import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { CountriesFillProps } from '../utils/map/mapTypes';

interface Props {
    sourceId: string;
    layerId: string;
    beforeId?: string;
    countriesFillConfig: CountriesFillProps;
}

export const CountriesFillLayer = (props: Props) => {
    const WORLDVIEW = 'US';
    const countryCodes = props.countriesFillConfig.countryCodes;
    const color = props.countriesFillConfig.color;
    const opacity = props.countriesFillConfig.opacity;

    const matchExpression: Expression = ['match', ['get', 'iso_3166_1_alpha_3']];
    for (const row of countryCodes) {
        matchExpression.push(row, color);
    }

    // Last value is the default, used where there is no data
    matchExpression.push('rgba(0, 0, 0, 0)');

    const worldview_filter = [
        'all',
        ['==', ['get', 'disputed'], 'false'],
        ['any', ['==', 'all', ['get', 'worldview']], ['in', WORLDVIEW, ['get', 'worldview']]]
    ];

    return (
        <Source id={props.sourceId} url="mapbox://mapbox.country-boundaries-v1" type="vector">
            <Layer
                id={props.layerId}
                beforeId={props.beforeId}
                type={'fill'}
                source-layer="country_boundaries"
                filter={worldview_filter}
                source={props.sourceId}
                paint={{
                    'fill-color': matchExpression,
                    'fill-opacity': opacity
                }}
            />
        </Source>
    );
};
