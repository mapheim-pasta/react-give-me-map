import React from 'react';
import { Layer, Source, useMap } from 'react-map-gl';
import { coordsToArrays } from '../../utils/geojson/coordsToArrays';
import { ICoordinates } from '../../utils/map/mapTypes';
import { PolygonWorldData3d } from '../../utils/world/worldTypes';

interface IProps {
    markerId: string;

    data3d: PolygonWorldData3d;
    coordinates: ICoordinates[];
    nativeMarkerIdsOrder: string[];
}

export const PolygonWorld3d = (props: IProps) => {
    const data3d = props.data3d;

    const sourceId = props.markerId;
    const layerId = sourceId + '|layer';

    const featureName = sourceId + 'feature';

    const mapCtx = useMap();

    if (!mapCtx.current) {
        return <></>;
    }

    const indexOfLayerId = props.nativeMarkerIdsOrder.indexOf(props.markerId);

    return (
        <div>
            <Source
                id={sourceId}
                type="geojson"
                data={{
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {
                                level: data3d?.level ?? 1,
                                name: featureName,
                                base_height: data3d?.baseHeight ?? 0,
                                height: data3d?.height ?? 0,
                                color: data3d?.color ?? '#000000'
                            },
                            geometry: {
                                coordinates: [coordsToArrays(props.coordinates)],
                                type: 'Polygon'
                            },
                            id: sourceId
                        }
                    ]
                }}
            >
                <Layer
                    id={layerId}
                    beforeId={
                        indexOfLayerId > 0
                            ? `${props.nativeMarkerIdsOrder[indexOfLayerId - 1]}|layer`
                            : undefined
                    }
                    type="fill-extrusion"
                    source={sourceId}
                    paint={{
                        'fill-extrusion-color': ['get', 'color'],
                        'fill-extrusion-height': ['get', 'height'],
                        'fill-extrusion-base': ['get', 'base_height'],
                        'fill-extrusion-opacity': 1
                    }}
                />
            </Source>
        </div>
    );
};
