import { uniqBy } from 'lodash';
import { RefObject, useEffect } from 'react';
import { MapRef } from 'react-map-gl';

interface Image {
    url: string;
    name: string;
    sdf?: boolean;
}

type UseMapImageOptions = {
    mapRef: RefObject<MapRef>;
    images: Image[];
    onLoad?: () => void;
};

export function loadMapImages(mapRef: MapRef, images: Image[], onLoad: () => void) {
    const map = mapRef.getMap();

    images.forEach(({ url, name, sdf = false }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.loadImage(url, (error: unknown, image: any) => {
            if (error) throw error;
            if (!map.hasImage(name)) {
                map.addImage(name, image, { sdf });
            }
            onLoad();
        });
    });
}

export function useLoadMapImages({ mapRef, images, onLoad }: UseMapImageOptions) {
    const imageHash = images.map((e) => e.url).join(';');

    useEffect(() => {
        let loadedCount = 0;

        if (mapRef.current) {
            const uniqueImages = uniqBy(images, 'url');

            loadMapImages(mapRef.current, uniqueImages, () => {
                loadedCount += 1;
                if (uniqueImages.length === loadedCount) {
                    onLoad?.();
                }
            });
        }
    }, [mapRef.current, imageHash]);
}
