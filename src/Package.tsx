import React from 'react';
import { IMapProps, Map } from './map/Map';

interface IProps {
    map: IMapProps;
    children?: React.ReactNode;
}

export const Package = (props: IProps): JSX.Element => {
    return (
        <>
            <Map map={props.map}>{props.children}</Map>
        </>
    );
};
