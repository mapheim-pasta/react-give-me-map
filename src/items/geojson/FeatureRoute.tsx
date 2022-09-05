import React, { useContext } from 'react';
import { Layer, Source } from 'react-map-gl';
import { MapContext } from 'react-map-gl/dist/esm/components/map';
import { useCtx } from '../../context/dynamic/provider';
import { useCoordinate } from '../../hooks/coordinates/useCoordinates';
import { ICoordinates } from '../../utils/map/mapTypes';
import { MAX_ZOOM, ROUTE_LINE_WIDTH } from '../../utils/world/worldConfig';
import { getInScaleReverse } from '../../utils/world/worldUtils';

interface Props {
    id: string;
    coordinates: ICoordinates[];
    fillColor?: string;
    fillColorOpacity?: number;
    lineColor?: string;
    lineOpacity?: number;
    dropShadowColor?: string;
}

export const FeatureRoute = (props: Props): JSX.Element => {
    const { state } = useCtx();
    const { map } = useContext(MapContext);
    const { points } = useCoordinate(props.coordinates);

    let width = getInScaleReverse(ROUTE_LINE_WIDTH, map.getZoom(), MAX_ZOOM);
    const extraWidth = width < 40 ? 40 : width;
    width = width < 5 ? 5 : width;

    const shadowDistance = width * (2 / 3);

    if (props.coordinates?.length < 2) return <></>;

    return (
        <Source
            id={props.id}
            type="geojson"
            data={
                {
                    type: 'Feature',
                    geometry: {
                        type: 'MultiLineString',
                        coordinates: [points]
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any
            }
            key={props.id}
        >
            {/* Fill */}
            {props.fillColor && (
                <Layer
                    id={props.id + 'back'}
                    type="fill"
                    paint={{
                        'fill-color': '#' + props.fillColor,
                        'fill-opacity': props.fillColorOpacity ?? 0.3
                    }}
                />
            )}
            {props.lineColor && (
                <>
                    {/* Shadow */}
                    {props.dropShadowColor && (
                        <Layer
                            id={props.id + 'shadow'}
                            source={props.id}
                            type="line"
                            paint={{
                                'line-color': '#' + props.dropShadowColor,
                                'line-width': width * 0.75,
                                'line-opacity': 1,
                                'line-translate': [shadowDistance, shadowDistance]
                            }}
                        />
                    )}
                    {/* Visible */}
                    <Layer
                        id={props.id + 'line'}
                        source={props.id}
                        type="line"
                        paint={{
                            'line-color': '#' + props.lineColor,
                            'line-width': width,
                            'line-opacity': props.lineOpacity ?? 1
                        }}
                        layout={{
                            'line-cap': 'round',
                            'line-join': 'round'
                        }}
                    />
                    {/* Clickable */}
                    <Layer
                        id={props.id + '|line-click'}
                        source={props.id}
                        type="line"
                        paint={{
                            'line-color': 'black',
                            'line-width': extraWidth,
                            'line-opacity': 0
                        }}
                    />
                </>
            )}
        </Source>
    );
};
