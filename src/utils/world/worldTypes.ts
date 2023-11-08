import { FillLayout, FillPaint, LineLayout, LinePaint, SymbolLayout, SymbolPaint } from 'mapbox-gl';
import { RefObject } from 'react';
import { ICoordinates } from '../map/mapTypes';

export type WorldV1Elements =
    | 'react'
    | 'text'
    | 'image'
    | 'route'
    | 'draw'
    | 'pin'
    | 'polygon'
    | 'youtube'
    | 'link';

export type WorldV2Elements =
    | 'v2/line'
    | 'v2/polygon'
    | 'v2/icon'
    | 'v2/wall'
    | 'v2/image'
    | 'direction'
    | 'v2/text'
    | 'v2/route'
    | 'indoor_stand';

export type WorldElements = WorldV1Elements | WorldV2Elements;

export type ICombinedV1World =
    | ITextWorld
    | IImageWorld
    | IRouteWorld
    | IDrawWorld
    | IPinWorld
    | IPolygonWorld
    | IDirectionWorld
    | IYoutubeWorld
    | ILinkWorld
    | IReactWorld;

export type ICombinedV2World =
    | ILineV2World
    | IPolygonV2World
    | IIconV2World
    | IWallV2World
    | ITextV2World
    | IImageV2World
    | IRouteV2World
    | IIndoorStandWorld;

export type ICombinedWorld = ICombinedV1World | ICombinedV2World;

interface BaseMarker {
    id: string;
    lat: number;
    lng: number;
    placeText?: string;
    placeId?: string;
    layerTitle?: string;
    selectable?: boolean;
    scale?: number; //at originZoom 1
    scalable?: boolean;
    rotate?: number;
    order?: number;
    visible?: boolean;
    storyIds?: string[];

    gptContextId?: string;
    isGroupable?: boolean;

    category?: string[];

    elementType: WorldElements;
    elementData: ICombinedWorld;

    hasBookingConfiguration?: boolean;
    isBookingAvailable?: boolean;
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

export interface ImageWorldLayerData {
    topLeft?: ICoordinates;
    topRight?: ICoordinates;
    bottomLeft?: ICoordinates;
    bottomRight?: ICoordinates;
}

export interface IImageWorld {
    src: string;
    srcWidth: number;
    additionalSrc?: {
        100: string;
        600: string;
        1000: string;
        1920: string;
        4096: string;
    };
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
    renderAsLayer: boolean;
    layerData?: ImageWorldLayerData;
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

export interface IRouteV2WorldMarker extends BaseMarker {
    elementType: 'v2/route';
    elementData: IRouteV2World;
    ref?: RefObject<HTMLDivElement>;
}

export interface IRouteV2World {
    coordinates: ICoordinates[];
    opacity: number;
    color: string;
    width: number;
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
    icon?: {
        iconText: string;
        iconColor: string;
        backgroundColor: string;
    };
}

export interface IPinWorldMarker extends BaseMarker {
    elementType: 'pin';
    elementData: IPinWorld;
    ref?: RefObject<HTMLDivElement>;
}

export interface PolygonWorldData3d {
    level?: number;
    baseHeight?: number;
    height?: number;
    color?: string;
}

export interface IPolygonWorld {
    path: string;
    coordinates: ICoordinates[];
    width: number;
    height: number;
    color: string;
    fill?: boolean;
    strokeDashArray?: string;
    renderAs3d: boolean;
    data3d?: PolygonWorldData3d;
}

export interface IPolygonWorldMarker extends BaseMarker {
    elementType: 'polygon';
    elementData: IPolygonWorld;
    ref?: RefObject<HTMLDivElement>;
}

interface IDirectionWorld {
    // start, middle, stop, used for dragging the right path
    coordinates: ICoordinates[];
    // used for rendering
    path: ICoordinates[];
    transport: Transport;
    color?: string;
    opacity?: number;
    width?: number;
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

export interface IReactWorld {
    componentTypeId: string;
    componentData: Record<string, string>;
}

export interface IReactWorldMarker extends BaseMarker {
    elementType: 'react';
    elementData: IReactWorld;
    ref?: RefObject<HTMLDivElement>;
}
export interface ILineV2World {
    coordinates: Array<{ lat: number; lng: number }>;
    color: string;
    width: number;
    opacity: number;
    dashed: {
        isDashed: boolean;
        lineLength: number;
        gapLength: number;
    };
    rawPaintAttributes: LinePaint;
    rawLayoutAttributes: LineLayout;
}

export interface ILineV2WorldMarker extends BaseMarker {
    elementType: 'v2/line';
    elementData: ILineV2World;
    ref?: RefObject<HTMLDivElement>;
}

export interface IPolygonV2World {
    coordinates: Array<{ lat: number; lng: number }>;
    fill: {
        isFilled: boolean;
        color: string;
        opacity: number;
        rawPaintAttributes: FillPaint;
        rawLayoutAttributes: FillLayout;
    };
    border: {
        hasBorder: boolean;
        color: string;
        width: number;
        opacity: number;
        rawPaintAttributes: LinePaint;
        rawLayoutAttributes: LineLayout;
    };
}

export interface IPolygonV2WorldMarker extends BaseMarker {
    elementType: 'v2/polygon';
    elementData: IPolygonV2World;
    ref?: RefObject<HTMLDivElement>;
}

export interface IWallV2World {
    coordinates: Array<{ lat: number; lng: number }>;
    wall: {
        height: number;
        color: string;
        opacity: number;
    };
    line: {
        isLine: boolean;
        hasFloor: boolean;
        fillColor: string;
        width: number;
    };
}

export interface IWallV2WorldMarker extends BaseMarker {
    elementType: 'v2/wall';
    elementData: IWallV2World;
    ref?: RefObject<HTMLDivElement>;
}

export interface IIndoorStandWorld {
    text: string;
    textColor: string;
    textHaloColor: string;
    textHaloWidth: number;
    pinSrc: string;
    imageSrc: string;
}

export interface IIndoorStandWorldMarker extends BaseMarker {
    elementType: 'indoor_stand';
    elementData: IIndoorStandWorld;
    ref?: RefObject<HTMLDivElement>;
}

export interface IIconV2World {
    imageUrl: string;

    text: string;
    imageSize: number;
    textSize: number;
    textColor: string;
    textHaloColor: string;
    textHaloWidth: number;
    generatedBackgroundColor: string;
    generatedIconUrl: string;
    generatedImageUrl: string;
    generatedEmoji: string;
    generatedIconColor: string;
    rawPaintAttributes: SymbolPaint;
    rawLayoutAttributes: SymbolLayout;
}

export interface IIconV2WorldMarker extends BaseMarker {
    elementType: 'v2/icon';
    elementData: IIconV2World;
    ref?: RefObject<HTMLDivElement>;
}

export interface IImageV2World {
    imageUrl: string;
    coordinates: Array<{ lat: number; lng: number }>;
    nonRotatedCoordinates: Array<{ lat: number; lng: number }>;
    rotation: number;
    opacity: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
    generatedImageUrl: string;
    generatedBackgroundColor: string;
    generatedIconColor: string;
    generatedIconUrl: string;
    generatedEmoji: string;
}

export interface IImageV2WorldMarker extends BaseMarker {
    elementType: 'v2/image';
    elementData: IImageV2World;
    ref?: RefObject<HTMLDivElement>;
}

export interface ITextV2World {
    imageUrl: string;
    coordinates: Array<{ lat: number; lng: number }>;
    nonRotatedCoordinates: Array<{ lat: number; lng: number }>;
    rotation: number;
    opacity: number;
    generatedText: string;
    generatedTextColor: string;
    generatedBackgroundColor: string;
    generatedWidth: number;
    lineLength: number;
    rawPaintAttributes: SymbolPaint;
    rawLayoutAttributes: SymbolLayout;
}

export interface ITextV2WorldMarker extends BaseMarker {
    elementType: 'v2/text';
    elementData: ITextV2World;
    ref?: RefObject<HTMLDivElement>;
}

export type IWorldV1Marker =
    | ITextWorldMarker
    | IImageWorldMarker
    | IRouteWorldMarker
    | IDrawWorldMarker
    | IPinWorldMarker
    | IPolygonWorldMarker
    | IYoutubeWorldMarker
    | ILinkWorldMarker
    | IReactWorldMarker;

export type IWorldV2Marker =
    | ILineV2WorldMarker
    | IPolygonV2WorldMarker
    | IIconV2WorldMarker
    | IWallV2WorldMarker
    | IImageV2WorldMarker
    | IDirectionWorldMarker
    | ITextV2WorldMarker
    | IRouteV2WorldMarker
    | IIndoorStandWorldMarker;

export type IWorldMarker = IWorldV1Marker | IWorldV2Marker;
