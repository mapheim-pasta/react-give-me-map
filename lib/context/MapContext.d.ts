import React from 'react';
interface IState {
    todoList: number;
}
export declare const initialState: IState;
export declare type Actions = 'ADD_TODO_ITEM' | 'PES';
export declare const reducer: (state: IState, action: {
    type: Actions;
    value: unknown;
}) => IState;
export declare const TodoListContext: React.Context<IState>;
export declare const StateProvider: ({ reducer, children }: any) => JSX.Element;
export declare const useCtx: () => {
    state: IState;
    dispatch: Function;
};
export declare const useActions: () => {
    addToDo: (value: IAddToDo) => void;
};
interface IAddToDo {
    value: number;
}
export {};
