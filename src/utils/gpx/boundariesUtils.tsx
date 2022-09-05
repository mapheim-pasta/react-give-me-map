// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMiddle(prop: 'lat' | 'lng', markers: any[]): number {
    let values = markers.map((m) => m[prop]);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (prop === 'lng' && max - min > 180) {
        values = values.map((val) => (val < max - 180 ? val + 360 : val));
        min = Math.min(...values);
        max = Math.max(...values);
    }
    let result = (min + max) / 2;
    if (prop === 'lng' && result > 180) {
        result -= 360;
    }
    return result;
}
