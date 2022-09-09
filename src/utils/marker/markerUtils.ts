import {
    IDrawWorldMarker,
    IImageWorldMarker,
    ILinkWorldMarker,
    IPinWorldMarker,
    IPolygonWorldMarker,
    ITextWorldMarker,
    IWorldMarker,
    IYoutubeWorldMarker
} from '../world/worldTypes';

type MarkerElements =
    | ITextWorldMarker
    | IImageWorldMarker
    | IDrawWorldMarker
    | IPinWorldMarker
    | IPolygonWorldMarker
    | IYoutubeWorldMarker
    | ILinkWorldMarker;

export function isMarkerElement(marker: IWorldMarker): marker is MarkerElements {
    const type = marker.elementType;
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
