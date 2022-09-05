export interface ISetCallbacks {
    callbacks: {
        onMarkersSelected?: (ids: string[]) => void;
    };
}
