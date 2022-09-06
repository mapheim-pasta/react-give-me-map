import React from 'react';
import { Marker } from 'react-map-gl';
import { useCtx } from '../context/dynamic/provider';
import { IDirectionWorld, IWorldMarker } from '../utils/world/worldTypes';
import { FeatureRoute } from './geojson/FeatureRoute';
import { S_DotPin } from './PinWorld';

interface Props {
    marker: IWorldMarker;
    onSelected?: () => void;
}

export const DirectionWorld = (props: Props): JSX.Element => {
    const id = props.marker.id;
    const elementData = props.marker.elementData as IDirectionWorld;
    const { state } = useCtx();

    return (
        <>
            <Marker
                longitude={elementData.start.lng}
                latitude={elementData.start.lat}
                onClick={() => {
                    //select
                    // dispatch(setSelectedMarkers([id]));
                    // dispatch(setWorldAction(EWorldAction.SELECT));
                    // state.callbacks.onMarkersSelected?.([id]);
                    props.onSelected?.();
                }}
                style={{
                    opacity: state.selectedIds.includes(id) ? 0.25 : 1
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
                    // state.callbacks.onMarkersSelected?.([id]);
                    props.onSelected?.();
                }}
                style={{
                    opacity: state.selectedIds.includes(id) ? 0.25 : 1
                }}
            >
                <S_DotPin dotColor={elementData.lineColor} />
            </Marker>
        </>
    );
};
