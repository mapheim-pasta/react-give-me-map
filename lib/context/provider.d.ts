import React from 'react';
import { IState } from './state';
export declare const MainContext: React.Context<IState>;
export declare const ContextProvider: ({ reducer, children }: any) => JSX.Element;
export declare const useCtx: () => {
    state: IState;
    dispatch: Function;
};
