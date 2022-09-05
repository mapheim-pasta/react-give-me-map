import { RefObject } from 'react';
import { ICoordinates } from '../map/mapTypes';

export interface IWorldMarker {
    id: string;
    lat: number;
    lng: number;
    elementType: WorldElements;
    elementData: ICombinedWorld;
    scale?: number; //at originZoom 1
    scalable: boolean;
    rotate?: number;
    order: number;
    ref?: RefObject<HTMLDivElement>;
}

export type ICombinedWorld =
    | ITextWorld
    | IImageWorld
    | IRouteWorld
    | IDrawWorld
    | IPinWorld
    | IPolygonWorld
    | IDirectionWorld
    | IYoutubeWorld;

export type WorldElements =
    | 'react'
    | 'text'
    | 'image'
    | 'route'
    | 'draw'
    | 'pin'
    | 'polygon'
    | 'direction'
    | 'youtube';

export interface ITextWorld {
    text: string;
    width: number;
    fill: boolean;
    color: string;
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
}

export interface IImageWorld {
    src: string;
    lat?: number;
    lng?: number;
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
}

export interface IRouteWorld {
    coordinates: ICoordinates[];
    fillColor?: string;
    fillColorOpacity?: number;
    lineColor?: string;
    lineOpacity?: number;
    dropShadowColor?: string;
}

export interface IDrawWorld {
    path: string;
    width: number;
    height: number;
    opacity: number;
    strokeWidth: number;
    color: string;
}

export interface IPinWorld {
    label?: string;
    img?: string;
    emoji?: string;
    dotColor?: string;
}

export interface IPolygonWorld {
    path: string;
    coordinates: ICoordinates[];
    width: number;
    height: number;
    color: string;
    fill?: boolean;
}

export interface IDirectionWorld {
    start: ICoordinates;
    end: ICoordinates;
    coordinates: ICoordinates[];
    transport: Transport;
    lineColor?: string;
    lineOpacity?: number;
    dropShadowColor?: string;
}

export type Transport = 'driving-traffic' | 'driving' | 'walking' | 'cycling';

export interface IYoutubeWorld {
    video: string;
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
}
