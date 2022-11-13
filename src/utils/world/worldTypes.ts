import { RefObject } from 'react';
import { ICoordinates } from '../map/mapTypes';

export type WorldElements =
    | 'react'
    | 'text'
    | 'image'
    | 'route'
    | 'draw'
    | 'pin'
    | 'polygon'
    | 'direction'
    | 'youtube'
    | 'link';

export type ICombinedWorld =
    | ITextWorld
    | IImageWorld
    | IRouteWorld
    | IDrawWorld
    | IPinWorld
    | IPolygonWorld
    | IDirectionWorld
    | IYoutubeWorld
    | ILinkWorld;

interface BaseMarker {
    id: string;
    lat: number;
    lng: number;
    scale?: number; //at originZoom 1
    scalable?: boolean;
    rotate?: number;
    order?: number;

    elementType: WorldElements;
    elementData: ICombinedWorld;
}

export interface ITextWorld {
    text: string;
    width: number;
    fill: boolean;
    color: string;
    textColor?: string;
    textShadow?: string;
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
}

export interface ITextWorldMarker extends BaseMarker {
    elementType: 'text';
    elementData: ITextWorld;
    ref?: RefObject<HTMLDivElement>;
}

export interface ILinkWorld {
    link: string;
    text: string;
    width: number;
    color: string;
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
}

export interface ILinkWorldMarker extends BaseMarker {
    elementType: 'link';
    elementData: ILinkWorld;
    ref?: RefObject<HTMLDivElement>;
}

export interface IImageWorld {
    src: string;
    additionalSrc?: {
        100: string;
        600: string;
        1000: string;
        1920: string;
    };
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
}

export interface IImageWorldMarker extends BaseMarker {
    elementType: 'image';
    elementData: IImageWorld;
    ref?: RefObject<HTMLDivElement>;
}

export interface IRouteWorld {
    coordinates: ICoordinates[];
    fillColor?: string;
    fillColorOpacity?: number;
    lineColor?: string;
    lineOpacity?: number;
    dropShadowColor?: string;
}

export interface IRouteWorldMarker extends BaseMarker {
    elementType: 'route';
    elementData: IRouteWorld;
    ref?: RefObject<HTMLDivElement>;
}

export interface IDrawWorld {
    type: 'pen' | 'brush';
    path: string;
    width: number;
    height: number;
    opacity: number;
    strokeWidth: number;
    color: string;
    fill: boolean;
}

export interface IDrawWorldMarker extends BaseMarker {
    elementType: 'draw';
    elementData: IDrawWorld;
    ref?: RefObject<HTMLDivElement>;
}

export interface IPinWorld {
    label?: string;
    img?: string;
    emoji?: string;
    dotColor?: string;
}

export interface IPinWorldMarker extends BaseMarker {
    elementType: 'pin';
    elementData: IPinWorld;
    ref?: RefObject<HTMLDivElement>;
}

export interface IPolygonWorld {
    path: string;
    coordinates: ICoordinates[];
    width: number;
    height: number;
    color: string;
    fill?: boolean;
}

export interface IPolygonWorldMarker extends BaseMarker {
    elementType: 'polygon';
    elementData: IPolygonWorld;
    ref?: RefObject<HTMLDivElement>;
}

interface IDirectionWorld {
    start: ICoordinates;
    end: ICoordinates;
    coordinates: ICoordinates[];
    transport: Transport;
    lineColor?: string;
    lineOpacity?: number;
    dropShadowColor?: string;
}

export interface IDirectionWorldMarker extends BaseMarker {
    elementType: 'direction';
    elementData: IDirectionWorld;
    refs?: Array<RefObject<HTMLDivElement>>;
}

export type Transport = 'driving-traffic' | 'driving' | 'walking' | 'cycling' | 'plane';

export interface IYoutubeWorld {
    video: string;
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
}

export interface IYoutubeWorldMarker extends BaseMarker {
    elementType: 'youtube';
    elementData: IYoutubeWorld;
    ref?: RefObject<HTMLDivElement>;
}

export type IWorldMarker =
    | ITextWorldMarker
    | IImageWorldMarker
    | IRouteWorldMarker
    | IDrawWorldMarker
    | IPinWorldMarker
    | IPolygonWorldMarker
    | IDirectionWorldMarker
    | IYoutubeWorldMarker
    | ILinkWorldMarker;
