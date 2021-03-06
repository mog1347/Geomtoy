import { Angle, Assert, Type, Utility, Coordinates, Vector2, Maths } from "@geomtoy/util";
import { validAndWithSameOwner } from "../../decorator";

import Shape from "../../base/Shape";
import Point from "./Point";
import Line from "./Line";
import Graphics from "../../graphics";
import EventObject from "../../event/EventObject";

import type Geomtoy from "../../geomtoy";
import type Transformation from "../../transformation";
import type { InfiniteOpenShape, TransformableShape } from "../../types";
class Ray extends Shape implements InfiniteOpenShape, TransformableShape {
    private _x = NaN;
    private _y = NaN;
    private _angle = NaN;

    constructor(owner: Geomtoy, x: number, y: number, angle: number);
    constructor(owner: Geomtoy, coordinates: [number, number], angle: number);
    constructor(owner: Geomtoy, point: Point, angle: number);
    constructor(owner: Geomtoy);
    constructor(o: Geomtoy, a1?: any, a2?: any, a3?: any) {
        super(o);
        if (Type.isNumber(a1)) {
            Object.assign(this, { x: a1, y: a2, angle: a3 });
        }
        if (Type.isArray(a1)) {
            Object.assign(this, { coordinates: a1, angle: a2 });
        }
        if (a1 instanceof Point) {
            Object.assign(this, { point: a1, angle: a2 });
        }
        return Object.seal(this);
    }

    static readonly events = Object.freeze({
        xChanged: "x" as const,
        yChanged: "y" as const,
        angleChanged: "angle" as const
    });

    private _setX(value: number) {
        if (!Utility.isEqualTo(this._x, value)) this.trigger_(EventObject.simple(this, Ray.events.xChanged));
        this._x = value;
    }
    private _setY(value: number) {
        if (!Utility.isEqualTo(this._y, value)) this.trigger_(EventObject.simple(this, Ray.events.yChanged));
        this._y = value;
    }
    private _setAngle(value: number) {
        if (!Utility.isEqualTo(this._angle, value)) this.trigger_(EventObject.simple(this, Ray.events.angleChanged));
        this._angle = value;
    }

    get x() {
        return this._x;
    }
    set x(value) {
        Assert.isRealNumber(value, "x");
        this._setX(value);
    }
    get y() {
        return this._y;
    }
    set y(value) {
        Assert.isRealNumber(value, "y");
        this._setY(value);
    }
    get coordinates() {
        return [this._x, this._y] as [number, number];
    }
    set coordinates(value) {
        Assert.isCoordinates(value, "coordinates");
        this._setX(Coordinates.x(value));
        this._setY(Coordinates.y(value));
    }
    get point() {
        return new Point(this.owner, this._x, this._y);
    }
    set point(value) {
        this._setX(value.x);
        this._setY(value.y);
    }
    get angle() {
        return this._angle;
    }
    set angle(value) {
        Assert.isRealNumber(value, "angle");
        this._setAngle(value);
    }

    isValid(): boolean {
        const { coordinates: c, angle: a } = this;
        if (!Coordinates.isValid(c)) return false;
        if (!Type.isRealNumber(a)) return false;
        return true;
    }
    isPointOn(point: [number, number] | Point) {
        const epsilon = this.options_.epsilon;
        const c0 = this.coordinates;
        const c1 = point instanceof Point ? point.coordinates : point;
        if (Coordinates.isEqualTo(c0, c1, epsilon)) return true;
        return Maths.equalTo(Vector2.angle(Vector2.from(c0, c1)), this.angle, epsilon);
    }
    /**
     * Get the `n` section(equal) rays of the angle which is formed by rays `ray1` and `ray2`.
     * @description
     * If `n` is not integer, return `null`.
     * If `ray1` and `ray2` have different endpoint, return `null`.
     * @param n
     * @param ray1
     * @param ray2
     */
    static getAngleNSectionRaysFromTwoRays(owner: Geomtoy, n: number, ray1: Ray, ray2: Ray): Ray[] | null {
        if (!Type.isInteger(n) || n < 2) return null;
        if (!ray1.isEndpointSameAs(ray2)) return null;
        let a1 = ray1.angle,
            a2 = ray2.angle,
            c = ray1.coordinates,
            d = (a2 - a1) / n,
            ret: Ray[] = [];
        Utility.range(1, n).forEach(index => {
            ret.push(new Ray(owner, c, a1 + d * index));
        });
        return ret;
    }

    isSameAs(ray: Ray) {
        const epsilon = this.options_.epsilon;
        return Coordinates.isEqualTo(this.coordinates, ray.coordinates, epsilon) && Maths.equalTo(this.angle, ray.angle, epsilon), epsilon;
    }
    isEndpointSameAs(ray: Ray) {
        const epsilon = this.options_.epsilon;
        return Coordinates.isEqualTo(this.coordinates, ray.coordinates, epsilon);
    }

    /**
     * Move ray `this` by `offsetX` and `offsetY` to get new ray.
     */
    move(deltaX: number, deltaY: number) {
        return this.clone().moveSelf(deltaX, deltaY);
    }
    /**
     * Move ray `this` itself by `offsetX` and `offsetY`.
     */
    moveSelf(deltaX: number, deltaY: number) {
        this.coordinates = Vector2.add(this.coordinates, [deltaX, deltaY]);
        return this;
    }
    /**
     * Move ray `this` with `distance` along `angle` to get new ray.
     */
    moveAlongAngle(angle: number, distance: number) {
        return this.clone().moveAlongAngleSelf(angle, distance);
    }
    /**
     * Move ray `this` itself with `distance` along `angle`.
     */
    moveAlongAngleSelf(angle: number, distance: number) {
        this.coordinates = Vector2.add(this.coordinates, Vector2.from2(angle, distance));
        return this;
    }

    getAngleToRay(ray: Ray) {
        return Angle.simplify2(this.angle - ray.angle);
    }

    getUnderlyingLine() {
        return Line.fromPointAndAngle(this.owner, this.point, this.angle);
    }

    apply(transformation: Transformation): Shape {
        throw new Error("Method not implemented.");
    }
    getGraphics() {
        const g = new Graphics();
        if (!this.isValid) return g;
        throw new Error("Method not implemented.");
    }

    clone() {
        return new Ray(this.owner, this.x, this.y, this.angle);
    }
    copyFrom(shape: Ray | null) {
        if (shape === null) shape = new Ray(this.owner);
        this._setX(shape._x);
        this._setY(shape._y);
        this._setAngle(shape._angle);
        return this;
    }
    toString() {
        // prettier-ignore
        return [
            `${this.name}(${this.uuid}){`,
            `\tx: ${this.x}`,
            `\ty: ${this.y}`,
            `\tangle: ${this.angle}`,
            `} owned by Geomtoy(${this.owner.uuid})`
        ].join("\n")
    }
    toArray() {
        return [this.x, this.y, this.angle];
    }
    toObject() {
        return { x: this.x, y: this.y, angle: this.angle };
    }
}

validAndWithSameOwner(Ray);

export default Ray;
