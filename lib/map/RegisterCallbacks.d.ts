/// <reference types="react" />
export interface ICallbacks {
    onMarkersSelected?: (ids: string[]) => void;
}
export declare const RegisterCallbacks: (props: ICallbacks) => JSX.Element;
