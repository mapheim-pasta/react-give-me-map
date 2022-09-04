export interface IViewportExtended {
    latitude: number;
    longitude: number;
    zoom: number;
    nw?: ICoordinates;
    se?: ICoordinates;
    height?: number;
    width?: number;
}
export interface ICoordinates {
    lat: number;
    lng: number;
}
export declare enum EMapStyle {
    SATELLITE = "mapbox://styles/koudelka/ckstetxyy07gr17o4rh01vb9b",
    OUTDOOR = "mapbox://styles/koudelka/ckwfq7e5k45h814o8521fnwo1",
    WORLD = "mapbox://styles/koudelka/cl6gs87ey002l15o9gnp7opx7"
}