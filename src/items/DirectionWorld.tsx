import React from 'react';
import { Marker } from 'react-map-gl';
import { IDirectionWorld, IWorldMarker } from '../utils/world/worldTypes';
import { FeatureRoute } from './geojson/FeatureRoute';
import { S_DotPin } from './PinWorld';

interface Props {
    marker: IWorldMarker;
}

export const DirectionWorld = (props: Props): JSX.Element => {
    const id = props.marker.id;
    const elementData = props.marker.elementData as IDirectionWorld;

    return (
        <>
            <Marker
                longitude={elementData.start.lng}
                latitude={elementData.start.lat}
                onClick={() => {
                    //select
                    // dispatch(setSelectedMarkers([id]));
                    // dispatch(setWorldAction(EWorldAction.SELECT));
                }}
            >
                <S_DotPin dotColor={elementData.lineColor} />
            </Marker>

            {elementData.coordinates?.length > 0 && (
                <FeatureRoute
                    id={id}
                    coordinates={elementData.coordinates}
                    lineColor={elementData.lineColor}
                    lineOpacity={elementData.lineOpacity}
                    dropShadowColor={elementData.dropShadowColor}
                />
            )}

            <Marker
                longitude={elementData.end.lng}
                latitude={elementData.end.lat}
                onClick={() => {
                    //select
                    // dispatch(setSelectedMarkers([id]));
                    // dispatch(setWorldAction(EWorldAction.SELECT));
                }}
            >
                <S_DotPin dotColor={elementData.lineColor} />
            </Marker>
        </>
    );
};
