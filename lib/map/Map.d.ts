import React from 'react';
import { IMapProps } from '../utils/map/mapTypes';
import { IWorldMarker } from '../utils/world/worldTypes';
interface IProps {
    map: IMapProps;
    markers: IWorldMarker[];
    children?: React.ReactNode;
}
export declare const Map: (props: IProps) => JSX.Element;
export {};
