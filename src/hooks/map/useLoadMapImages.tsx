import { uniq } from 'lodash';
import { RefObject, useEffect, useState } from 'react';
import { MapRef } from 'react-map-gl';

type UseMapImageOptions = {
    mapRef: RefObject<MapRef>;
    imageUrls: string[];
    onLoad?: () => void;
    hash?: string | number;
};

export function loadMapImages(map: MapRef, imageUrls: string[], onLoad: () => void) {
    imageUrls.forEach((imageUrl) => {
        if (map.hasImage(imageUrl)) {
            return onLoad();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.loadImage(imageUrl, (error: unknown, image: any) => {
            if (error) {
                throw error;
            }

            map.addImage(imageUrl, image, { sdf: false });
            onLoad();
        });
    });
}

export function useLoadMapImages({ mapRef, imageUrls }: UseMapImageOptions) {
    const imageHash = imageUrls.join(';');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) {
            return;
        }

        let loadedCount = 0;

        const uniqueImages = uniq(imageUrls);

        if (uniqueImages.length === 0) {
            setIsLoaded(true);
            return;
        }

        loadMapImages(map, uniqueImages, () => {
            loadedCount += 1;
            if (uniqueImages.length === loadedCount) {
                setIsLoaded(true);
            }
        });
    }, [imageHash, mapRef.current]);

    return { isLoaded };
}
