import { IXY } from '../../../utils/map/mapTypes';

interface IRectangle {
    A: IXY;
    B: IXY;
    C: IXY;
    D: IXY;
}

const vector = (p1: IXY, p2: IXY) => {
    return {
        x: p2.x - p1.x,
        y: p2.y - p1.y
    };
};

const dot = (u: IXY, v: IXY) => {
    return u.x * v.x + u.y * v.y;
};

export const isPointInRectangle = (point: IXY, rect: IRectangle) => {
    const AB = vector(rect.A, rect.B);
    const AM = vector(rect.A, point);
    const BC = vector(rect.B, rect.C);
    const BM = vector(rect.B, point);

    const dotABAM = dot(AB, AM);
    const dotABAB = dot(AB, AB);
    const dotBCBM = dot(BC, BM);
    const dotBCBC = dot(BC, BC);

    return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
};
