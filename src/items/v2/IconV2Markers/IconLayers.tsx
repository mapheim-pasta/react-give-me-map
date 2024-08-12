import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import React from 'react';
import { Layer, LayerProps } from 'react-map-gl';
import { AvailableSymbolLayoutKeys, AvailableSymbolPaintKeys } from './properties';

interface Props {
    globalLayoutProps: SymbolLayout;
    source: string;
    layerIds: {
        icons: string;
        iconsClickable: string;
    };
    beforeIds: {
        icons?: string;
        iconsClickable?: string;
    };
}

export const IconLayers = (props: Props) => {
    const mapKeyValues = (key: string, objectName: 'layout' | 'paint') => {
        return [key, ['get', key, ['get', objectName]]];
    };

    const layout: SymbolLayout = {
        ...Object.fromEntries(AvailableSymbolLayoutKeys.map((key) => mapKeyValues(key, 'layout'))),
        ...props.globalLayoutProps
    };

    const paint: SymbolPaint = {
        ...Object.fromEntries(AvailableSymbolPaintKeys.map((key) => mapKeyValues(key, 'paint')))
    };

    const iconsLayer: LayerProps = {
        id: props.layerIds.icons,
        type: 'symbol' as const,
        source: props.source,
        filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'clickable'], '0']],
        layout,
        paint
    };

    const clickableLayer: LayerProps = {
        id: props.layerIds.iconsClickable,
        type: 'symbol' as const,
        source: props.source,
        filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'clickable'], '1']],
        layout,
        paint
    };

    return (
        <>
            <Layer {...iconsLayer} />
            <Layer {...clickableLayer} />
        </>
    );
};
