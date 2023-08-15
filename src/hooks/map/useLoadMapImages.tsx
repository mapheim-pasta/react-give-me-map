import { uniq } from 'lodash';
import { RefObject, useEffect } from 'react';
import { MapRef } from 'react-map-gl';

type UseMapImageOptions = {
    mapRef: RefObject<MapRef>;
    imageUrls: string[];
    onLoad?: () => void;
    hash?: string | number;
};

const imageLoadedRef = new Set();

export function loadMapImages(mapRef: MapRef, imageUrls: string[], onLoad: () => void) {
    const map = mapRef.getMap();

    imageUrls.forEach((imageUrl) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.loadImage(imageUrl, (error: unknown, image: any) => {
            if (error) throw error;
            if (!map.hasImage(imageUrl)) {
                map.addImage(imageUrl, image, { sdf: false });
            }
            onLoad();
        });
    });
}

export function useLoadMapImages({ mapRef, imageUrls, onLoad, hash }: UseMapImageOptions) {
    const imageHash = imageUrls.join(';');

    useEffect(() => {
        let loadedCount = 0;

        if (mapRef.current) {
            const uniqueImages = uniq(imageUrls).filter((e) => !imageLoadedRef.has(e));

            uniqueImages.forEach((image) => imageLoadedRef.add(image));

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
    }, [mapRef.current, imageHash, hash]);
}
