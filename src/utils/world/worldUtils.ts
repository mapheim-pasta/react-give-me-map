export function getInScale(value: number, currentZoom: number, targetZoom: number): number {
    return value * Math.pow(2, targetZoom - currentZoom);
}

export function getInScaleReverse(value: number, currentZoom: number, targetZoom: number): number {
    return value / Math.pow(2, targetZoom - currentZoom);
}
