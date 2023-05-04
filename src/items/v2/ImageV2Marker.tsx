import { isEqual, isNil, omitBy, uniqWith } from 'lodash';
import { RasterLayout, RasterPaint } from 'mapbox-gl';
import React, { RefObject, useEffect } from 'react';
import { Layer, MapRef, Source } from 'react-map-gl';
import { coordsToArrays } from '../../utils/geojson/coordsToArrays';
import { IImageV2WorldMarker } from '../../utils/world/worldTypes';
import { EmptyLayer } from './EmptyLayer';

interface Props {
    mapRef: RefObject<MapRef>;
    marker: IImageV2WorldMarker;

    beforeId?: string;

    isHighlighted?: boolean;
}

export const ImageV2Marker = (props: Props): JSX.Element => {
    const markerId = props.marker.id;
    const data = props.marker.elementData;

    const paintAttributes: RasterPaint = {
        ...data.rawPaintAttributes
    };

    const layoutAttributes: RasterLayout = {
        ...data.rawLayoutAttributes,
        visibility: props.marker.visible ? 'visible' : 'none'
    };

    const layerIds = {
        layer: markerId + '|layer',
        last: markerId + '|last'
    };

    const beforeIds = {
        layer: props.beforeId,
        last: layerIds.layer
    };

    useEffect(() => {
        if (props.mapRef.current) {
            props.mapRef.current.moveLayer(layerIds.layer, beforeIds.layer);
            props.mapRef.current.moveLayer(layerIds.last, beforeIds.last);
        }
    }, [props.beforeId, props.mapRef?.current]);

    const coordinates = coordsToArrays(data.coordinates);

    if (coordinates.length !== 4 || uniqWith(coordinates, isEqual).length !== 4) {
        // console.log('Cannot render Image card - invalid coordinates', coordinates);
        return <></>;
    }

    return (
        <Source id={markerId} type="image" url={data.imageUrl} coordinates={coordinates}>
            <Layer
                id={layerIds.layer}
                beforeId={beforeIds.layer}
                type="raster"
                source={markerId}
                paint={{ ...omitBy(paintAttributes, isNil) }}
                layout={{ ...omitBy(layoutAttributes, isNil) }}
            />
            <EmptyLayer id={layerIds.last} beforeId={beforeIds.last} />
        </Source>
    );
};
