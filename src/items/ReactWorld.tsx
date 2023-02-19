import React from 'react';
import { CustomMarkerBuilders } from '../context/dynamic/actions';
import { IReactWorld } from '../utils/world/worldTypes';

interface Props {
    elementData: IReactWorld;

    customMarkerBuilders?: CustomMarkerBuilders;

    onClick?: () => void;
}

export const ReactWorld = (props: Props): JSX.Element => {
    const builder = props.customMarkerBuilders?.[props.elementData.componentTypeId];

    if (!builder) {
        // console.log('No builder provided for ReactWorld marker');
        return <></>;
    }

    const element = builder(props.elementData.componentData);

    return <div onClick={props.onClick}>{element}</div>;
};
