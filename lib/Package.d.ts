import React from 'react';
import { ICallbacks } from './map/RegisterCallbacks';
import { IMapProps } from './utils/map/mapTypes';
import { IWorldMarker } from './utils/world/worldTypes';
interface IProps {
    map: IMapProps;
    markers?: IWorldMarker[];
    children?: React.ReactNode;
    callbacks?: ICallbacks;
}
export declare const Package: (props: IProps) => JSX.Element;
export {};
