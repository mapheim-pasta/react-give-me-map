import React from 'react';
import { CustomMarkerBuilders } from '../context/dynamic/actions';
import { useCtx } from '../context/dynamic/provider';
import { IReactWorld } from '../utils/world/worldTypes';

interface Props {
    elementData: IReactWorld;

    customMarkerBuilders?: CustomMarkerBuilders;
}

export const ReactWorld = (props: Props): JSX.Element => {
    const { state } = useCtx();

    const builders = props.customMarkerBuilders ?? state.customMarkerBuilders;

    const builder = builders[props.elementData.componentTypeId];

    if (!builder) {
        console.log('No builder provided for ReactWorld marker');
        return <></>;
    }

    const element = builder(props.elementData.componentData);

    return <>{element}</>;
};
