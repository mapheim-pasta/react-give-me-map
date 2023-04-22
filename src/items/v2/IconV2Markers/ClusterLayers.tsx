import React from 'react';
import { Layer, LayerProps } from 'react-map-gl';

export interface GroupMarkerProps {
    textColor?: string;
    backgroundColor?: string;
}

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
    const clusterLayer: LayerProps = {
        id: props.layerIds.cluster,
        beforeId: props.beforeIds.cluster,
        type: 'circle' as const,
        source: 'icons',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': props.groupMarkerStyle.backgroundColor ?? '#f28cb1',
            'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
    };

    const clusterCountLayer: LayerProps = {
        id: props.layerIds.clusterCount,
        beforeId: props.beforeIds.clusterCount,
        type: 'symbol' as const,
        source: 'icons',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Open Sans Bold'],
            'text-size': 12
        },
        paint: {
            'text-color': props.groupMarkerStyle.textColor ?? '#fff'
        }
    };

    return (
        <>
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
        </>
    );
};
