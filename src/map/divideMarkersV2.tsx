import { orderBy } from 'lodash';
import {
    IIconV2WorldMarker,
    IIndoorStandWorldMarker,
    IWallV2WorldMarker,
    IWorldV2Marker
} from '../utils/world/worldTypes';
import { isWallGroupable } from './useWorldMarkersV2Data';

export interface MarkerGroupMarker {
    type: 'marker';
    marker: IWorldV2Marker;
    id: string;
}

type MarkerGroup =
    | { type: 'wallGroup'; markers: IWallV2WorldMarker[]; id: string }
    | MarkerGroupMarker;

export interface DividedMarkersV2 {
    iconMarkers: IIconV2WorldMarker[];
    indoorStandMarkers: IIndoorStandWorldMarker[];
    floorMarkers: IWallV2WorldMarker[];
    markers: MarkerGroup[];
}

export function divideMarkersV2(
    markers: IWorldV2Marker[],
    opts: { isEditMode: boolean; selectedIds: string[] }
): DividedMarkersV2 {
    const nonGroupMarkers = orderBy(
        markers.filter((e) => {
            return e.elementType !== 'v2/icon' && e.elementType !== 'indoor_stand';
        }),
        'order',
        'desc'
    );

    const iconMarkers = orderBy(
        markers.filter((e): e is IIconV2WorldMarker => e.elementType === 'v2/icon'),
        'order',
        'desc'
    );
    const indoorStandMarkers = orderBy(
        markers.filter((e): e is IIndoorStandWorldMarker => e.elementType === 'indoor_stand'),
        'order',
        'desc'
    );
    const floorMarkers = markers.filter<IWallV2WorldMarker>(
        (e): e is IWallV2WorldMarker =>
            e.elementType === 'v2/wall' && e.elementData.line?.isLine && e.elementData.line.hasFloor
    );

    const markerGroups: MarkerGroup[] = [];
    let currentWallGroup: IWallV2WorldMarker[] = [];
    let index = 0;
    for (let i = 0; i < nonGroupMarkers.length; i++) {
        const m = nonGroupMarkers[i];
        if (m.elementType === 'v2/wall' && !opts.selectedIds.includes(m.id) && isWallGroupable(m)) {
            currentWallGroup.push(m);
        } else {
            if (currentWallGroup.length > 0) {
                markerGroups.push({
                    type: 'wallGroup',
                    markers: currentWallGroup,
                    id: 'wall_group|' + index.toString()
                });
                index += 1;
                currentWallGroup = [];
            }
            markerGroups.push({ type: 'marker', marker: m, id: m.id });
        }
    }

    if (currentWallGroup.length > 0) {
        markerGroups.push({
            type: 'wallGroup',
            markers: currentWallGroup,
            id: index.toString()
        });
    }

    return { iconMarkers, indoorStandMarkers, floorMarkers, markers: markerGroups };
}
