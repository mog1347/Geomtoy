declare const vec2: {
    from([ux, uy]: [number, number], [vx, vy]: [number, number]): [number, number];
    from2(angle: number, magnitude: number): [number, number];
    angle([x, y]: [number, number]): number;
    magnitude([x, y]: [number, number]): number;
    squaredMagnitude([x, y]: [number, number]): number;
    add([ux, uy]: [number, number], [vx, vy]: [number, number]): [number, number];
    subtract([ux, uy]: [number, number], [vx, vy]: [number, number]): [number, number];
    scalarMultiply([x, y]: [number, number], scalar: number): [number, number];
    multiply([ux, uy]: [number, number], [vx, vy]: [number, number]): [number, number];
    dot([ux, uy]: [number, number], [vx, vy]: [number, number]): number;
    cross([ux, uy]: [number, number], [vx, vy]: [number, number]): number;
    absolute([x, y]: [number, number]): [number, number];
    negative([x, y]: [number, number]): [number, number];
    invert([x, y]: [number, number]): [number, number];
    swap([x, y]: [number, number]): [number, number];
    rotate([x, y]: [number, number], a: number): [number, number];
    normalize([x, y]: [number, number]): [number, number];
};
export default vec2;
