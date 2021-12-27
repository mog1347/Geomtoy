import math from "../utility/math";
import vec2 from "../utility/vec2";

import { optionerOf } from "../helper/Optioner";

import Arc from "../shapes/basic/Arc";
import Bezier from "../shapes/basic/Bezier";
import Circle from "../shapes/basic/Circle";
import LineSegment from "../shapes/basic/LineSegment";
import QuadraticBezier from "../shapes/basic/QuadraticBezier";

import type { OwnerCarrier } from "../types";

class Wrap {
    static verb = "Wraps" as const;
    //#region Circle
    static circleWrapsCircle(this: OwnerCarrier, circle: Circle, otherCircle: Circle) {
        const sd = vec2.squaredMagnitude(vec2.from(circle.centerCoordinates, otherCircle.centerCoordinates));
        const sdr = (circle.radius - otherCircle.radius) ** 2;
        const epsilon = optionerOf(this.owner).options.epsilon;
        return math.greaterThan(circle.radius, otherCircle.radius, epsilon) && math.lessThan(sd, sdr, epsilon);
    }
    static circleWrapsLineSegment(this: OwnerCarrier, circle: Circle, lineSegment: LineSegment) {
        return circle.isPointInside(lineSegment.point1Coordinates) && circle.isPointInside(lineSegment.point2Coordinates);
    }
    static circleWrapsArc(this: OwnerCarrier, circle: Circle, arc: Arc) {}
    static circleWrapsBezier(this: OwnerCarrier, circle: Circle, bezier: Bezier) {}
    static circleWrapsQuadraticBezier(this: OwnerCarrier, circle: Circle, quadraticBezier: QuadraticBezier) {}
    //#endregion
}

export default Wrap;
