import { useRef } from 'react';
import { MapRef } from 'react-map-gl';
import { useCtx } from '../../context/dynamic/provider';
import { IWorldMarker } from '../../utils/world/worldTypes';
import { useContainComputation } from './useContainComputation';

export const useMouseListener = (
    markers: IWorldMarker[],
    mapRef: React.RefObject<MapRef>,
    wrapperMapRef: React.RefObject<HTMLDivElement>
) => {
    const containComputations = useContainComputation(markers, mapRef);
    const { state } = useCtx();

    const startX = useRef<number>(0);
    const startY = useRef<number>(0);
    const delta = 6;

    function detectAfterClick(e: MouseEvent) {
        const diffX = Math.abs(e.pageX - startX.current);
        const diffY = Math.abs(e.pageY - startY.current);

        if (diffX < delta && diffY < delta) {
            // console.log('After click');
            return true;
        } else {
            // console.log('After drag');
            return false;
        }
    }

    function handleSingleClick(e: MouseEvent) {
        const { finalMarker, marker, marker2 } = containComputations.computations(e);

        if (
            wrapperMapRef?.current?.contains(e.target as any) ||
            (finalMarker && markers.some((e) => e.id === finalMarker?.id))
        ) {
            if (marker && marker.selectable) {
                state.callbacks.onMarkersSelected?.([marker.id]);
            } else if (marker2 && marker2.selectable) {
                state.callbacks.onMarkersSelected?.([marker2.id]);
            } else {
                state.callbacks.onMarkersSelected?.([]);
            }
        }
        return;
    }

    function onMouseDown(e: MouseEvent) {
        startX.current = e.pageX;
        startY.current = e.pageY;
        return;
    }

    return {
        onMouseUp: (e: MouseEvent) => {
            if (detectAfterClick(e)) {
                handleSingleClick(e);
            }
        },
        onMouseDown
    };
};
