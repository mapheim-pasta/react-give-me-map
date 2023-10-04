import React from 'react';
import { Layer, LayerProps } from 'react-map-gl';
import { GroupMarkerProps } from '../../../utils/map/mapTypes';

interface Props {
    groupMarkerStyle: GroupMarkerProps;
    layerIds: {
        cluster: string;
        clusterCount: string;
    };
    beforeIds: {
        cluster?: string;
        clusterCount?: string;
    };
}

export const ClusterLayers = (props: Props) => {
    const clusterCountLayer: LayerProps = {
        id: props.layerIds.clusterCount,
        beforeId: props.beforeIds.clusterCount,
        type: 'symbol' as const,
        source: 'icons',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Open Sans Semibold'],
            'text-size': 12
        },
        paint: {
            'text-color': '#' + (props.groupMarkerStyle.textColor?.replace('#', '') ?? 'fff')
        }
    };

    const clusterLayer: LayerProps = {
        id: props.layerIds.cluster,
        beforeId: props.beforeIds.cluster,
        type: 'circle' as const,
        source: 'icons',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color':
                '#' + (props.groupMarkerStyle.backgroundColor?.replace('#', '') ?? 'f28cb1'),
            'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
    };

    return (
        <>
            <Layer {...clusterCountLayer} />
            <Layer {...clusterLayer} />
        </>
    );
};
