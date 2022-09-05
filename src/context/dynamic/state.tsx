export interface IState {
    callbacks: {
        onMarkersSelected?: (ids: string[]) => void;
    };
}

export const initialState: IState = {
    callbacks: {}
};
