import React from 'react';
import { IRouteWorld, IWorldMarker } from '../utils/world/worldTypes';
import { FeatureRoute } from './geojson/FeatureRoute';

interface Props {
    marker: IWorldMarker;
}

export const RouteWorld = (props: Props): JSX.Element => {
    const id = props.marker.id;
    const elementData = props.marker.elementData as IRouteWorld;

    return (
        <>
            <FeatureRoute
                id={id}
                coordinates={elementData.coordinates}
                fillColor={elementData.fillColor}
                fillColorOpacity={elementData.fillColorOpacity}
                lineColor={elementData.lineColor}
                lineOpacity={elementData.lineOpacity}
                dropShadowColor={elementData.dropShadowColor}
            />
        </>
    );
};
