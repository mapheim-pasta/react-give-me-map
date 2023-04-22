import React, { RefObject, useState } from 'react';
import { Layer, LayerProps, MapRef, Source } from 'react-map-gl';
import { useLoadMapImages } from '../hooks/map/useLoadMapImages';
import { IImageWorldMarker, IWorldMarker } from '../utils/world/worldTypes';

interface GroupMarkerProps {
    textColor?: string;
    backgroundColor?: string;
}

export const GroupMarkers = (props: {
    mapRef: RefObject<MapRef>;
    groupableMarkers: IWorldMarker[];
    selectedMarkers: string[];
    groupMarkerProps: GroupMarkerProps;
}) => {
    const [areImagesLoaded, setAreImagesLoaded] = useState(false);

    const images = props.groupableMarkers
        .filter((marker): marker is IImageWorldMarker => marker.elementType === 'image')
        .map((marker) => ({
            url: marker.elementData.src,
            name: marker.elementData.src
        }));

    useLoadMapImages({
        mapRef: props.mapRef,
        images,
        onLoad: () => {
            setAreImagesLoaded(true);
        }
    });

    if (!areImagesLoaded) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sourceFeatures: GeoJSON.Feature<GeoJSON.Geometry, any>[] = props.groupableMarkers
        .map((marker) => {
            if (marker.elementType === 'image' && marker.visible) {
                return {
                    type: 'Feature' as const,
                    properties: {
                        image: marker.elementData.src,
                        size: (250 / marker.elementData.srcWidth) * (marker?.scale ?? 1),
                        type: 'image',
                        markerId: marker.id,
                        selected: props.selectedMarkers.includes(marker.id) ? '1' : '0',
                        clickable: marker.selectable ? '1' : '0',
                        rotation: marker.rotate ?? 0
                    },
                    geometry: {
                        type: 'Point' as const,
                        coordinates: [marker.lng, marker.lat, 0.0]
                    }
                };
            }
            return null;
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((e): e is GeoJSON.Feature<GeoJSON.Point, any> => Boolean(e));

    const sourceData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection' as const,
        features: sourceFeatures
    };

    const clusterLayer: LayerProps = {
        id: 'clusters',
        type: 'circle' as const,
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color':
                '#' + (props.groupMarkerProps.backgroundColor?.replace('#', '') ?? 'f28cb1'),
            'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
    };

    const clusterCountLayer: LayerProps = {
        id: 'cluster-count',
        type: 'symbol' as const,
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        },
        paint: {
            'text-color': '#' + (props.groupMarkerProps.textColor?.replace('#', '') ?? 'fff')
        }
    };

    const imagesClickableLayer: LayerProps = {
        id: 'unclustered-point-images-clickable',
        type: 'symbol' as const,
        source: '1',
        filter: [
            'all',
            ['!', ['has', 'point_count']],
            ['==', ['get', 'type'], 'image'],
            ['==', ['get', 'selected'], '0'],
            ['==', ['get', 'clickable'], '1']
        ],
        layout: {
            'icon-image': ['string', ['get', 'image']],
            'icon-size': ['number', ['get', 'size']],
            'icon-rotate': ['get', 'rotation']
        }
    };

    const imagesLayer: LayerProps = {
        id: 'unclustered-point-images',
        type: 'symbol' as const,
        source: '1',
        filter: [
            'all',
            ['!', ['has', 'point_count']],
            ['==', ['get', 'type'], 'image'],
            ['==', ['get', 'selected'], '0'],
            ['==', ['get', 'clickable'], '0']
        ],
        layout: {
            'icon-image': ['string', ['get', 'image']],
            'icon-size': ['number', ['get', 'size']],
            'icon-rotate': ['get', 'rotation']
        }
    };

    return (
        <>
            <Source
                id="clusters-source"
                type="geojson"
                data={sourceData}
                cluster={true}
                clusterMaxZoom={10}
                clusterRadius={50}
            >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...imagesClickableLayer} />
                <Layer {...imagesLayer} />
            </Source>
        </>
    );
};
