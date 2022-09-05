import { ICoordinates } from '../map/mapTypes';
import { getMiddle } from './boundariesUtils';

export interface ICoordinatesBoundaries {
    center: ICoordinates;
    topLeft: ICoordinates;
    bottomRight: ICoordinates;
    start: ICoordinates;
}

export function getCoordinatesBoundaries(coordinates: ICoordinates[]): ICoordinatesBoundaries {
    const center: ICoordinates = {
        lat: getMiddle('lat', coordinates),
        lng: getMiddle('lng', coordinates)
    };
    let topLeft: ICoordinates = { lat: -Infinity, lng: Infinity };
    let bottomRight: ICoordinates = { lat: Infinity, lng: -Infinity };
    const start: ICoordinates = { lat: coordinates[0].lat, lng: coordinates[0].lng };
    for (const a of coordinates) {
        if (topLeft.lng > a.lng) {
            topLeft = {
                ...topLeft,
                lng: a.lng
            };
        }
        if (topLeft.lat < a.lat) {
            topLeft = {
                ...topLeft,
                lat: a.lat
            };
        }
        if (bottomRight.lng < a.lng) {
            bottomRight = {
                ...bottomRight,
                lng: a.lng
            };
        }
        if (bottomRight.lat > a.lat) {
            bottomRight = {
                ...bottomRight,
                lat: a.lat
            };
        }
    }
    return {
        center,
        topLeft,
        bottomRight,
        start
    };
}
