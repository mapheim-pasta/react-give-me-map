import { WorldElements } from '../world/worldTypes';

export function isMarkerElement(type: WorldElements): boolean {
    return (
        type === 'text' ||
        type === 'image' ||
        type === 'draw' ||
        type === 'pin' ||
        type === 'polygon' ||
        type === 'youtube' ||
        type === 'link'
    );
}
