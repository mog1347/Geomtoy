import { Assert, Vector2, Maths, Type, Utility, Coordinates } from "@geomtoy/util";
import { validAndWithSameOwner } from "../../decorator";

import Shape from "../../base/Shape";
import Point from "./Point";
import Vector from "./Vector";
import Line from "./Line";
import Ray from "./Ray";
import Graphics from "../../graphics";
import EventObject from "../../event/EventObject";

import type Geomtoy from "../../geomtoy";
import type Transformation from "../../transformation";
import type { FiniteOpenShape, TransformableShape } from "../../types";

class LineSegment extends Shape implements FiniteOpenShape, TransformableShape {
    private _point1X = NaN;
    private _point1Y = NaN;
    private _point2X = NaN;
    private _point2Y = NaN;

    constructor(owner: Geomtoy, point1X: number, point1Y: number, point2X: number, point2Y: number);
    constructor(owner: Geomtoy, point1Coordinates: [number, number], point2Coordinates: [number, number]);
    constructor(owner: Geomtoy, point1: Point, point2: Point);
    constructor(owner: Geomtoy);
    constructor(o: Geomtoy, a1?: any, a2?: any, a3?: any, a4?: any) {
        super(o);
        if (Type.isNumber(a1)) {
            Object.assign(this, { point1X: a1, point1Y: a2, point2X: a3, point2Y: a4 });
        }
        if (Type.isArray(a1)) {
            Object.assign(this, { point1Coordinates: a1, point2Coordinates: a2 });
        }
        if (a1 instanceof Point) {
            Object.assign(this, { point1: a1, point2: a2 });
        }
        return Object.seal(this);
    }

    static readonly events = Object.freeze({
        point1XChanged: "point1X" as const,
        point1YChanged: "point1Y" as const,
        point2XChanged: "point2X" as const,
        point2YChanged: "point2Y" as const,
        angleChanged: "angle" as const
    });

    private _setPoint1X(value: number) {
        if (!Utility.isEqualTo(this._point1X, value)) {
            this.trigger_(EventObject.simple(this, LineSegment.events.point1XChanged));
            this.trigger_(EventObject.simple(this, LineSegment.events.angleChanged));
        }
        this._point1X = value;
    }
    private _setPoint1Y(value: number) {
        if (!Utility.isEqualTo(this._point1Y, value)) {
            this.trigger_(EventObject.simple(this, LineSegment.events.point1YChanged));
            this.trigger_(EventObject.simple(this, LineSegment.events.angleChanged));
        }
        this._point1Y = value;
    }
    private _setPoint2X(value: number) {
        if (!Utility.isEqualTo(this._point2X, value)) {
            this.trigger_(EventObject.simple(this, LineSegment.events.point2XChanged));
            this.trigger_(EventObject.simple(this, LineSegment.events.angleChanged));
        }
        this._point2X = value;
    }
    private _setPoint2Y(value: number) {
        if (!Utility.isEqualTo(this._point2Y, value)) {
            this.trigger_(EventObject.simple(this, LineSegment.events.point2YChanged));
            this.trigger_(EventObject.simple(this, LineSegment.events.angleChanged));
        }
        this._point2Y = value;
    }

    get point1X() {
        return this._point1X;
    }
    set point1X(value) {
        Assert.isRealNumber(value, "point1X");
        this._setPoint1X(value);
    }
    get point1Y() {
        return this._point1Y;
    }
    set point1Y(value) {
        Assert.isRealNumber(value, "point1Y");
        this._setPoint1Y(value);
    }
    get point1Coordinates() {
        return [this._point1X, this._point1Y] as [number, number];
    }
    set point1Coordinates(value) {
        Assert.isCoordinates(value, "point1Coordinates");
        this._setPoint1X(Coordinates.x(value));
        this._setPoint1Y(Coordinates.y(value));
    }
    get point1() {
        return new Point(this.owner, this._point1X, this._point1Y);
    }
    set point1(value) {
        this._setPoint1X(value.x);
        this._setPoint1Y(value.y);
    }
    get point2X() {
        return this._point2X;
    }
    set point2X(value) {
        Assert.isRealNumber(value, "point2X");
        this._setPoint2X(value);
    }
    get point2Y() {
        return this._point2Y;
    }
    set point2Y(value) {
        Assert.isRealNumber(value, "point2Y");
        this._setPoint2Y(value);
    }
    get point2Coordinates() {
        return [this._point2X, this._point2Y] as [number, number];
    }
    set point2Coordinates(value) {
        Assert.isCoordinates(value, "point2Coordinates");
        this._setPoint2X(Coordinates.x(value));
        this._setPoint2Y(Coordinates.y(value));
    }
    get point2() {
        return new Point(this.owner, this._point2X, this._point2Y);
    }
    set point2(value) {
        this._setPoint2X(value.x);
        this._setPoint2Y(value.y);
    }
    get angle() {
        return Vector2.angle(Vector2.from(this.point1Coordinates, this.point2Coordinates));
    }
    set angle(value) {
        Assert.isRealNumber(value, "angle");
        const nc2 = Vector2.add(this.point1Coordinates, Vector2.from2(value, this.getLength()));
        this._setPoint2X(Coordinates.x(nc2));
        this._setPoint2Y(Coordinates.y(nc2));
    }

    static formingCondition = "The two endpoints of a `LineSegment` should be distinct, or the length of a `LineSegment` should greater than 0.";

    isValid() {
        const { point1Coordinates: c1, point2Coordinates: c2 } = this;
        const epsilon = this.options_.epsilon;
        if (!Coordinates.isValid(c1)) return false;
        if (!Coordinates.isValid(c2)) return false;
        if (Coordinates.isEqualTo(c1, c2, epsilon)) return false;
        return true;
    }

    static fromPointAndAngleAndLength(owner: Geomtoy, point: [number, number] | Point, angle: number, length: number) {
        const c1 = point instanceof Point ? point.coordinates : point;
        const c2 = Vector2.add(c1, Vector2.from2(angle, length));
        return new LineSegment(owner, c1, c2);
    }
    /**
     * Get the `n` equally dividing rays of the angle which is formed by rays `ray1` and `ray2`.
     * @description
     * The angle is generated from `ray1` to `ray2` taking the common endpoint as the center of rotation.
     * If `n` is not integer, return `null`.
     * If `ray1` and `ray2` have different endpoint, return `null`.
     * @param n
     * @param ray1
     * @param ray2
     */
    static getAngleNEquallyDividingRaysOfTwoRays(owner: Geomtoy, n: number, ray1: Ray, ray2: Ray): Ray[] | null {
        if (!Type.isInteger(n) || n < 2) return null;
        if (!ray1.isEndpointSameAs(ray2)) return null;
        let a1 = ray1.angle,
            a2 = ray2.angle,
            vertex = ray1.point,
            d = (a2 - a1) / n,
            ret: Ray[] = [];
        Utility.range(1, n).forEach(index => {
            ret.push(new Ray(owner, vertex, a1 + d * index));
        });
        return ret;
    }

    /**
     * Whether the two endpoints of line segment `this` is the same as line segment `lineSegment` ignoring the order of the endpoints.
     * @param lineSegment
     * @returns
     */
    isSameAs(lineSegment: LineSegment) {
        const epsilon = this.options_.epsilon;
        const [ac1, ac2] = Utility.sort([this.point1Coordinates, this.point2Coordinates], [Coordinates.x, Coordinates.y]);
        const [bc1, bc2] = Utility.sort([lineSegment.point1Coordinates, lineSegment.point2Coordinates], [Coordinates.x, Coordinates.y]);
        return Coordinates.isEqualTo(ac1, bc1, epsilon) && Coordinates.isEqualTo(ac2, bc2, epsilon);
    }
    /**
     * Whether the two endpoints of line segment `this` is the same as line segment `lineSegment` considering the order of the endpoints.
     * @param lineSegment
     * @returns
     */
    isSameAs2(lineSegment: LineSegment) {
        let epsilon = this.options_.epsilon;
        return Coordinates.isEqualTo(this.point1Coordinates, lineSegment.point1Coordinates, epsilon) && Coordinates.isEqualTo(this.point2Coordinates, lineSegment.point2Coordinates, epsilon);
    }
    /**
     * Move line segment `this` by `offsetX` and `offsetY` to get new line segment.
     */
    move(deltaX: number, deltaY: number) {
        return this.clone().moveSelf(deltaX, deltaY);
    }
    /**
     * Move line segment `this` itself by `offsetX` and `offsetY`.
     */
    moveSelf(deltaX: number, deltaY: number) {
        this.point1Coordinates = Vector2.add(this.point1Coordinates, [deltaX, deltaY]);
        this.point2Coordinates = Vector2.add(this.point2Coordinates, [deltaX, deltaY]);
        return this;
    }
    /**
     * Move line segment `this` with `distance` along `angle` to get new line segment.
     */
    moveAlongAngle(angle: number, distance: number) {
        return this.clone().moveAlongAngleSelf(angle, distance);
    }
    /**
     * Move line segment `this` itself with `distance` along `angle`.
     */
    moveAlongAngleSelf(angle: number, distance: number) {
        this.point1Coordinates = Vector2.add(this.point1Coordinates, Vector2.from2(angle, distance));
        this.point2Coordinates = Vector2.add(this.point2Coordinates, Vector2.from2(angle, distance));
        return this;
    }
    /**
     * Get the middle point of line segment `this`.
     * @returns
     */
    getMiddlePoint() {
        const { point1X: x1, point1Y: y1, point2X: x2, point2Y: y2 } = this;
        return new Point(this.owner, (x1 + x2) / 2, (y1 + y2) / 2);
    }
    /**
     * Get the perpendicularly bisecting line of line segment `this`.
     * @returns
     */
    getPerpendicularlyBisectingLine() {
        const { point1X: x1, point1Y: y1, point2X: x2, point2Y: y2 } = this;
        return new Line(this.owner, this.getMiddlePoint(), (x1 - x2) / (y1 - y2));
    }

    getIntersectionPointWithLine(line: Line) {
        return line.getIntersectionPointWithLineSegment(this);
    }

    // #region Positional relationships of line segment to line segment
    // (IdenticalTo)
    // PerpendicularTo
    // ParallelTo
    // CollinearWith = ParallelTo | self
    // JointedWith
    // OverlappedWith = ParallelTo | CollinearWith | self,
    // IntersectedWith
    // SeparatedFrom

    /**
     * Whether line segment `this` is perpendicular to line segment `lineSegment`, regardless of whether they intersect.
     * @param {LineSegment} lineSegment
     * @returns {boolean}
     */
    isPerpendicularToLineSegment(lineSegment: LineSegment): boolean {
        let { point1Coordinates: c1, point2Coordinates: c2 } = this,
            { point1Coordinates: c3, point2Coordinates: c4 } = lineSegment,
            v12 = Vector2.from(c1, c2),
            v34 = Vector2.from(c3, c4),
            dp = Vector2.dot(v12, v34),
            epsilon = this.options_.epsilon;
        return Maths.equalTo(dp, 0, epsilon);
    }
    /**
     * Whether line segment `this` is parallel to line segment `lineSegment`, regardless of whether they are collinear or even the same.
     * @param {LineSegment} lineSegment
     * @returns {boolean}
     */
    isParallelToLineSegment(lineSegment: LineSegment): boolean {
        let { point1Coordinates: c1, point2Coordinates: c2 } = this,
            { point1Coordinates: c3, point2Coordinates: c4 } = lineSegment,
            v12 = Vector2.from(c1, c2),
            v34 = Vector2.from(c3, c4),
            cp = Vector2.cross(v12, v34),
            epsilon = this.options_.epsilon;
        return Maths.equalTo(cp, 0, epsilon);
    }

    /**
     * `??????this`???`??????s`?????????????????????????????????????????????
     * @param {LineSegment} lineSegment
     * @returns {boolean}
     */
    isCollinearToLineSegment(lineSegment: LineSegment): boolean {
        let { point1Coordinates: c1, point2Coordinates: c2 } = this,
            { point1Coordinates: c3, point2Coordinates: c4 } = lineSegment,
            v12 = Vector2.from(c1, c2),
            v34 = Vector2.from(c3, c4),
            v32 = Vector2.from(c3, c2),
            cp1 = Vector2.cross(v12, v34),
            cp2 = Vector2.cross(v32, v34),
            epsilon = this.options_.epsilon;
        return Maths.equalTo(cp1, 0, epsilon) && Maths.equalTo(cp2, 0, epsilon);
    }
    /**
     * `??????this`???`??????s`???????????????????????????????????????????????????(????????????????????????)????????????????????????
     * @param {LineSegment} lineSegment
     * @returns {boolean | Point} ??????
     */
    isJointedWithLineSegment(lineSegment: LineSegment): boolean {
        let { point1Coordinates: c1, point2Coordinates: c2 } = this,
            { point1Coordinates: c3, point2Coordinates: c4 } = lineSegment,
            epsilon = this.options_.epsilon,
            d1 = Coordinates.isEqualTo(c1, c3, epsilon),
            d2 = Coordinates.isEqualTo(c2, c4, epsilon),
            d3 = Coordinates.isEqualTo(c1, c4, epsilon),
            d4 = Coordinates.isEqualTo(c2, c3, epsilon);
        return d1 !== d2 || d3 !== d4;
    }
    getJointPointWithLineSegment(lineSegment: LineSegment): Point | null {
        if (!this.isJointedWithLineSegment(lineSegment)) return null;
        let { point1Coordinates: c1, point2Coordinates: c2 } = this,
            { point1Coordinates: c3, point2Coordinates: c4 } = lineSegment,
            epsilon = this.options_.epsilon;
        if (Coordinates.isEqualTo(c1, c3, epsilon) || Coordinates.isEqualTo(c1, c4, epsilon)) {
            return this.point1;
        } else {
            return this.point2;
        }
    }
    isContainedByLineSegment(lineSegment: LineSegment) {
        if (!this.isCollinearToLineSegment(lineSegment)) return false;
        const { point1Coordinates: c1, point2Coordinates: c2 } = lineSegment;
        const lerp1 = this.getLerpingRatioByPoint(c1);
        const lerp2 = this.getLerpingRatioByPoint(c2);
        return Maths.between(lerp1, 0, 1) && Maths.between(lerp2, 0, 1);
    }

    getLength() {
        return Vector2.magnitude(Vector2.from(this.point1Coordinates, this.point2Coordinates));
    }
    isPointOn(point: [number, number] | Point) {
        const c1 = this.point1Coordinates;
        const c2 = this.point2Coordinates;
        const c3 = point instanceof Point ? point.coordinates : point;
        const epsilon = this.options_.epsilon;
        if (Coordinates.isEqualTo(c1, c3, epsilon) || Coordinates.isEqualTo(c2, c3, epsilon)) return true;
        const v13 = Vector2.from(c1, c3);
        const v23 = Vector2.from(c2, c3);
        const dp = Vector2.dot(v13, v23);
        return Maths.equalTo(dp, 0, epsilon) && !Maths.equalTo(Vector2.angle(v13), Vector2.angle(v23), epsilon);
    }

    /**
     * `??????this`???`??????s`?????????????????????????????????????????????(??????)
     * @param {LineSegment} s
     * @returns {boolean | LineSegment} ????????????
     */
    isOverlappedWithLineSegment(lineSegment: LineSegment) {
        if (!this.isCollinearToLineSegment(lineSegment)) return false;
        const { point1Coordinates: c1, point2Coordinates: c2 } = lineSegment;
        const lerp1 = this.getLerpingRatioByPoint(c1);
        const lerp2 = this.getLerpingRatioByPoint(c2);
        return Maths.between(lerp1, 0, 1) !== Maths.between(lerp2, 0, 1);
    }
    getOverlapLineSegmentWithLineSegment(lineSegment: LineSegment): LineSegment | null {
        if (!this.isOverlappedWithLineSegment(lineSegment)) return null;
        const epsilon = this.options_.epsilon;
        let cs = Utility.sort([this.point1Coordinates, this.point2Coordinates, lineSegment.point1Coordinates, lineSegment.point2Coordinates], [Coordinates.x, Coordinates.y]);
        return new LineSegment(this.owner, Utility.nth(cs, 1)!, Utility.nth(cs, 2)!);
    }
    /**
     * `??????this`???`??????s`???????????????????????????????????????????????????????????????????????????????????????0??????Maths.PI
     * ?????????????????????????????????????????????????????????????????????????????????
     * @param {LineSegment} lineSegment
     * @returns {boolean | Point} ??????
     */
    _isIntersectedWithLineSegment(lineSegment: LineSegment) {
        if (this.isParallelToLineSegment(lineSegment)) return false; //???????????????????????????

        let v1 = new Vector(this.owner, this.point1, this.point2),
            v2 = new Vector(this.owner, lineSegment.point1, lineSegment.point2),
            v3 = new Vector(this.owner, this.point1, lineSegment.point1),
            cp1 = v1.crossProduct(v2),
            cp2 = v3.crossProduct(v2),
            cp3 = v3.crossProduct(v1),
            epsilon = this.options_.epsilon;

        if (Maths.equalTo(cp1, 0, epsilon)) return false;
        let t1 = cp3 / cp1,
            t2 = cp2 / cp1;
        if (0 <= t1 && t1 <= 1 && 0 <= t2 && t2 <= 1) {
            return Point.fromVector(this.owner, new Vector(this.owner, this.point1).add(v1.scalarMultiply(t2)));
        }
        return false;
    }

    isIntersectedWithLineSegment(lineSegment: LineSegment) {
        return Boolean(this._isIntersectedWithLineSegment(lineSegment));
    }
    getIntersectionPointWithLineSegment(lineSegment: LineSegment) {
        let ret = this._isIntersectedWithLineSegment(lineSegment);
        if (ret) return ret;
        return null;
    }

    /**
     * Get the lerping(**lerp** here means **linear interpolation and extrapolation**) point of line segment `this`.
     * @description
     * - When the `weight` is in the interval $[0,1]$, it is interpolation:
     *      - If `weight` is 0, return `point1`.
     *      - If `weight` is 1, return `point2`.
     *      - If `weight` is in $(0,1)$, return a point between `point1` and `point2`.
     * - When the `weight` is in the interval $(-\infty,0)$ and $(1,\infty)$, it is extrapolation:
     *      - If `weight` is in $(-\infty,0)$, return a point exterior of `point1`.
     *      - If `weight` is in $(1,\infty)$, return a point exterior of `point2`.
     * @param {number} weight
     * @returns {Point}
     */
    getLerpingPoint(weight: number): Point {
        let {
                point1: { x: x1, y: y1 },
                point2: { x: x2, y: y2 }
            } = this,
            x = Maths.lerp(x1, x2, weight),
            y = Maths.lerp(y1, y2, weight);
        return new Point(this.owner, x, y);
    }
    getLerpingRatioByPoint(point: Point | [number, number]): number {
        const c = point instanceof Point ? point.coordinates : (Assert.isCoordinates(point, "point"), point);
        const { point1Coordinates: c1, point2Coordinates: c2 } = this;
        if (!this.toLine().isPointOn(c)) return NaN;
        const v10 = Vector2.from(c1, c);
        const v12 = Vector2.from(c1, c2);
        const sign = Vector2.dot(v10, v12) < 0 ? -1 : 1;
        return (sign * Vector2.magnitude(v10)) / Vector2.magnitude(v12);
    }
    /**
     * Get the lerping ratio `weight` lerped by line `line `.
     * @description
     * - When `line` is parallel to `this`, return `NaN`.
     * - When `line` is intersected with `this`, return a number in the interval `[0, 1]`:
     *      - If `line` passes through `point1`, return 0.
     *      - If `line` passes through `point2`, return 1.
     * - When `line` is not parallel to and not intersected with `this`, return a number in the interval $(-\infty,0)$ and $(1,\infty)$.
     * @param {Line} line
     * @returns {number}
     */
    getLerpingRatioByLine(line: Line): number {
        const epsilon = this.options_.epsilon;
        const { point1X: x1, point1Y: y1, point2X: x2, point2Y: y2 } = this;
        const [a, b, c] = line.getGeneralEquationParameters(),
            d1 = a * x1 + b * y1 + c,
            d2 = a * x2 + b * y2 + c;
        if (Maths.equalTo(d1, d2, epsilon)) return NaN;
        return d1 / (d1 - d2);
    }
    /**
     * Get the division point of line segment `this`.
     * @description
     * - When `lambda` is equal to -1, return `null`.
     * - When `lambda` is in the interval $[0,\infty]$, return a internal division point, a point between `point1` and `point2`:
     *      - If `lambda` is 0`, return `point1`.
     *      - If `lambda` is $\infty$, return `point2`.
     * - When `lambda` is in the interval $(-\infty, -1)$ and $(-1, 0)$, return a external division point:
     *      - If `lambda` in $(-1,0)$, return a point exterior of `point1`.
     *      - If `lambda` in $(-\infty, -1)$, return a point exterior of `point2`.
     *
     * @param {number} lambda
     * @returns {Point}
     */
    getDivisionPoint(lambda: number): Point | null {
        if (lambda === -1) return null;
        if (Maths.abs(lambda) === Infinity) return this.point2.clone();
        let {
                point1: { x: x1, y: y1 },
                point2: { x: x2, y: y2 }
            } = this,
            x = (x1 + lambda * x2) / (1 + lambda),
            y = (y1 + lambda * y2) / (1 + lambda);
        return new Point(this.owner, x, y);
    }
    /**
     * Get the division ratio `lambda` divided by line `line `.
     * @description
     * - When `line` is parallel to `this`, return `NaN`.
     * - When `line` is intersected with `this`, return a number in the interval `[0, Infinity]`:
     *      - If `line` passes through `point1`, return 0.
     *      - If `line` passes through `point2`, return `Infinity`.
     * - When `line` is not parallel to and not intersected with `this`, return a number in the interval $(-\infty,-1)$ and $(-1,0)$.
     * @param {Line} line
     * @returns {number}
     */
    getDivisionRatioByLine(line: Line): number {
        if (line.isParallelToLineSegment(this)) return NaN;
        if (line.isPointOn(this.point2Coordinates)) return Infinity;
        let {
                point1: { x: x1, y: y1 },
                point2: { x: x2, y: y2 }
            } = this,
            [a, b, c] = line.getGeneralEquationParameters();
        return -(a * x1 + b * y1 + c) / (a * x2 + b * y2 + c);
    }
    toLine() {
        return Line.fromTwoPoints.bind(this)(this.point1Coordinates, this.point2Coordinates)!;
    }

    apply(transformation: Transformation): Shape {
        throw new Error("Method not implemented.");
    }
    getGraphics() {
        const g = new Graphics();
        if (!this.isValid()) return g;
        const { point1Coordinates: c1, point2Coordinates: c2 } = this;
        g.moveTo(...c1);
        g.lineTo(...c2);
        return g;
    }
    clone() {
        return new LineSegment(this.owner, this.point1X, this.point1Y, this.point2X, this.point2Y);
    }
    copyFrom(shape: LineSegment | null) {
        if (shape === null) shape = new LineSegment(this.owner);
        this._setPoint1X(shape._point1X);
        this._setPoint1Y(shape._point1Y);
        this._setPoint2X(shape._point2X);
        this._setPoint2Y(shape._point2Y);
        return this;
    }
    toString() {
        return [
            `${this.name}(${this.uuid}){`,
            `\tpoint1X: ${this.point1X}`,
            `\tpoint1Y: ${this.point1Y}`,
            `\tpoint2X: ${this.point2X}`,
            `\tpoint2Y: ${this.point2Y}`,
            `} owned by Geomtoy(${this.owner.uuid})`
        ].join("\n");
    }
    toArray() {
        return [this.point1X, this.point1Y, this.point2X, this.point2Y];
    }
    toObject() {
        return { point1X: this.point1X, point1Y: this.point1Y, point2X: this.point2X, point2Y: this.point2Y };
    }
}

validAndWithSameOwner(LineSegment);

export default LineSegment;
