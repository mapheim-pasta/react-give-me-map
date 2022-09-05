import { WorldElements } from '../world/worldTypes';

export function isMarkerElement(type: WorldElements): boolean {
    return (
        type === 'text' ||
        type === 'image' ||
        type === 'draw' ||
        type === 'pin' ||
        type === 'polygon' ||
        type === 'youtube'
    );
}

export function isControllableElement(type: WorldElements): boolean {
    return (
        type === 'text' ||
        type === 'image' ||
        type === 'draw' ||
        type === 'pin' ||
        type === 'youtube'
    );
}

export function isScalableElement(type: WorldElements): boolean {
    return type === 'text' || type === 'image' || type === 'draw' || type === 'youtube';
}

export function isMarkerClickableByDimension(type: WorldElements): boolean {
    return type === 'text' || type === 'image' || type === 'pin' || type === 'youtube';
}
