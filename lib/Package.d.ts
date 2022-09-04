import React from 'react';
import { IMapProps } from './map/Map';
import { ICallbacks } from './map/RegisterCallbacks';
interface IProps {
    map: IMapProps;
    children?: React.ReactNode;
    callbacks?: ICallbacks;
}
export declare const Package: (props: IProps) => JSX.Element;
export {};
