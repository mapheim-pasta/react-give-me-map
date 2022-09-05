import { ISetCallbacks, ISetMapRef } from './interfaces';
export declare enum Actions {
    SET_MAP_REF = 0,
    SET_CALLBACKS = 1
}
export declare const useActions: () => IReturnUseActions;
export interface IReturnUseActions {
    setMapRef: (value: ISetMapRef) => void;
    setCallbacks: (value: ISetCallbacks) => void;
}
