import { isEqual, uniqWith } from 'lodash';
import React from 'react';
import { Layer, Source, useMap } from 'react-map-gl';
import { coordsToArrays } from '../../utils/geojson/coordsToArrays';
import { ICoordinates } from '../../utils/map/mapTypes';
import { ImageWorldLayerData } from '../../utils/world/worldTypes';

interface IProps {
    markerId: string;
    layerData: ImageWorldLayerData;
    imageUrl: string;
}

export const ImageWorldLayer = (props: IProps): JSX.Element => {
    const { layerData } = props;

    const mapCtx = useMap();

    if (!mapCtx.current) {
        console.log('Cannot render Image card - missing map context');
        return <></>;
    }

    const coordinates = coordsToArrays(
        [layerData.topLeft, layerData.topRight, layerData.bottomRight, layerData.bottomLeft].filter(
            (e): e is ICoordinates => Boolean(e)
        )
    );

    if (coordinates.length !== 4 || uniqWith(coordinates, isEqual).length !== 4) {
        console.log('Cannot render Image card - invalid coordinates', coordinates);
        return <></>;
    }

    return (
        <>
            <Source id={props.markerId} type="image" url={props.imageUrl} coordinates={coordinates}>
                <Layer
                    id={props.markerId + '|raster'}
                    type="raster"
                    source={props.markerId}
                    paint={{ 'raster-fade-duration': 0 }}
                />
            </Source>
        </>
    );
};
