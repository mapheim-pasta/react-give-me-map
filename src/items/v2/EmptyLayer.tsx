import React from 'react';
import { Layer } from 'react-map-gl';

interface Props {
    id: string;
    beforeId?: string;
}

export const EmptyLayer = (props: Props) => {
    return <Layer id={props.id} beforeId={props.beforeId} source={'empty-source'} type="symbol" />;
};
