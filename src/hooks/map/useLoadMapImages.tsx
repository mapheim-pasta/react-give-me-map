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

const imageLoadedRef = new Set();

export function loadMapImages(mapRef: MapRef, images: Image[], onLoad: () => void) {
    const map = mapRef.getMap();

    images.forEach(({ url, name, sdf = false }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.loadImage(url, (error: unknown, image: any) => {
            if (error) throw error;
            if (!map.hasImage(name)) {
                map.addImage(name, image, { sdf, pixelRatio: image.height / image.width });
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
            const uniqueImages = uniqBy(images, 'url').filter((e) => !imageLoadedRef.has(e.name));

            uniqueImages.forEach((image) => imageLoadedRef.add(image.name));

            if (uniqueImages.length === 0) {
                onLoad?.();
                return;
            }

            loadMapImages(mapRef.current, uniqueImages, () => {
                loadedCount += 1;
                if (uniqueImages.length === loadedCount) {
                    onLoad?.();
                }
            });
        }
    }, [mapRef.current, imageHash]);
}
