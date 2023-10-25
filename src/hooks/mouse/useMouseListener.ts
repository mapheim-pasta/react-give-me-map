import { useRef } from 'react';
import { IWorldMarker } from '../../utils/world/worldTypes';

export const useMouseListener = (
    markers: IWorldMarker[],
    onMarkerSelected: (marker: IWorldMarker) => void
) => {
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

    function handleSingleClick(event: MouseEvent) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const path = (event as any).path || (event.composedPath && event.composedPath());

        const marker = markers
            .filter((e) => e.elementType === 'react')
            .find((e) => 'ref' in e && path.includes(e.ref?.current));
        if (marker) {
            onMarkerSelected(marker);
        }
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
