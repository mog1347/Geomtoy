/**
 * Reference:
 * @see https://www.w3.org/TR/SVG2/implnote.html#ArcImplementationNotes
 * @see https://observablehq.com/@awhitty/svg-2-elliptical-arc-to-canvas-path2d
 * @see https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-arc
 */
import { Maths, Vector2, Matrix2, Angle } from "@geomtoy/util";

type ArcEndpointParameterization = {
    point1X: number;
    point1Y: number;
    point2X: number;
    point2Y: number;
    radiusX: number;
    radiusY: number;
    largeArcFlag: boolean;
    sweepFlag: boolean;
    xAxisRotation: number;
};
type ArcCenterParameterization = {
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    startAngle: number;
    endAngle: number;
    xAxisRotation: number;
    anticlockwise: boolean;
};

function arcCenterToEndpointParameterization({
    centerX: cx,
    centerY: cy,
    radiusX: srcRx,
    radiusY: srcRy,
    xAxisRotation: phi,
    startAngle: sa,
    endAngle: ea,
    anticlockwise: anti
}: ArcCenterParameterization): ArcEndpointParameterization {
    const cosPhi = Maths.cos(phi);
    const sinPhi = Maths.sin(phi);
    const [rx, ry] = [Maths.abs(srcRx), Maths.abs(srcRy)];
    // prettier-ignore
    const [x1,y1] = Vector2.add(
        Matrix2.dotVector2(
            [cosPhi, -sinPhi, sinPhi, cosPhi],
            [rx * Maths.cos(sa), ry * Maths.sin(sa)]
        ),
        [cx, cy]
    )
    if (Maths.abs(ea - sa) >= 2 * Maths.PI) {
        /**
         * Full arc situation:
         * When converting the center parameterization to the endpoint parameterization,
         * the endpoint parameterization can NOT directly draw a full circle/ellipse like the center parameterization does,
         * we use an approximation of $\frac{\pi}{1800}$ to adjust the terminal endpoint every close to initial endpoint to simulate.
         */
        const approx = Maths.PI / 1800;
        ea = !anti ? ea - approx : ea + approx;
    }
    // prettier-ignore
    const [x2, y2] = Vector2.add(
        Matrix2.dotVector2(
            [cosPhi, -sinPhi, sinPhi, cosPhi], 
            [rx * Maths.cos(ea), ry * Maths.sin(ea)]
        ),
        [cx, cy]
    )

    const deltaA = Angle.simplify(ea) - Angle.simplify(sa);
    const laf = Maths.abs(deltaA) > Maths.PI ? true : false;
    const sf = deltaA > 0 ? true : false;

    return { point1X: x1, point1Y: y1, point2X: x2, point2Y: y2, radiusX: rx, radiusY: ry, largeArcFlag: laf, sweepFlag: sf, xAxisRotation: phi };
}

function arcEndpointToCenterParameterization({
    point1X: x1,
    point1Y: y1,
    point2X: x2,
    point2Y: y2,
    radiusX: srcRx,
    radiusY: srcRy,
    largeArcFlag: laf,
    sweepFlag: sf,
    xAxisRotation: phi
}: ArcEndpointParameterization): ArcCenterParameterization {
    const cosPhi = Maths.cos(phi);
    const sinPhi = Maths.sin(phi);
    // prettier-ignore
    const [x1P, y1P] = Matrix2.dotVector2(
        [cosPhi, sinPhi, -sinPhi, cosPhi], 
        [(x1 - x2) / 2, (y1 - y2) / 2]
    )
    // correctRadii
    let lambda = x1P ** 2 / srcRx ** 2 + y1P ** 2 / srcRy ** 2;
    if (lambda > 1) {
        srcRx = Maths.sqrt(lambda) * srcRx;
        srcRy = Maths.sqrt(lambda) * srcRy;
    }
    const [rx, ry] = [Maths.abs(srcRx), Maths.abs(srcRy)];
    const sign = laf !== sf ? 1 : -1;
    // prettier-ignore
    const [cxP, cyP] = Vector2.scalarMultiply(
        [(rx * y1P) / ry, (-ry * x1P) / rx], 
        sign * Maths.sqrt((rx ** 2 * ry ** 2 - rx ** 2 * y1P ** 2 - ry ** 2 * x1P ** 2) / (rx ** 2 * y1P ** 2 + ry ** 2 * x1P ** 2))
    )
    // prettier-ignore
    const [cx, cy] = Vector2.add(
        Matrix2.dotVector2(
            [cosPhi, -sinPhi, sinPhi, cosPhi], 
            [cxP, cyP]
        ), 
        [(x1 + x2) / 2, (y1 + y2) / 2]
    )
    const a: [number, number] = [(x1P - cxP) / rx, (y1P - cyP) / ry];
    const b: [number, number] = [(-x1P - cxP) / rx, (-y1P - cyP) / ry];

    const sa = Vector2.angleTo([1, 0], a);
    const deltaAP = Vector2.angleTo(a, b);
    // prettier-ignore
    const deltaA = 
        !sf && deltaAP > 0 
        ? deltaAP - Maths.PI *2 
        : sf && deltaAP < 0 
        ? deltaAP + Maths.PI *2 
        : deltaAP
    const ea = sa + deltaA;

    return { centerX: cx, centerY: cy, radiusX: rx, radiusY: ry, startAngle: sa, endAngle: ea, xAxisRotation: phi, anticlockwise: deltaA < 0 };
}

export { arcCenterToEndpointParameterization, arcEndpointToCenterParameterization };
