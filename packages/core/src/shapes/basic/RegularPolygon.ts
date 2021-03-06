import { Assert, Type, Utility, Coordinates, Maths, Vector2 } from "@geomtoy/util";
import { validAndWithSameOwner } from "../../decorator";

import Shape from "../../base/Shape";
import Point from "./Point";
import LineSegment from "./LineSegment";
import Circle from "./Circle";
import Graphics from "../../graphics";
import EventObject from "../../event/EventObject";

import type Geomtoy from "../../geomtoy";
import type Transformation from "../../transformation";
import type { Direction, ClosedShape, TransformableShape } from "../../types";

const regularPolygonMinSideCount = 3;
class RegularPolygon extends Shape implements ClosedShape, TransformableShape {
    private _centerX = NaN;
    private _centerY = NaN;
    private _radius = NaN;
    private _sideCount = NaN;
    private _rotation = 0;
    private _windingDirection = "positive" as Direction;

    constructor(owner: Geomtoy, centerX: number, centerY: number, radius: number, sideCount: number, rotation?: number);
    constructor(owner: Geomtoy, centerCoordinates: [number, number], radius: number, sideCount: number, rotation?: number);
    constructor(owner: Geomtoy, centerPoint: Point, radius: number, sideCount: number, rotation?: number);
    constructor(owner: Geomtoy);
    constructor(o: Geomtoy, a1?: any, a2?: any, a3?: any, a4?: any, a5?: any) {
        super(o);
        if (Type.isNumber(a1)) {
            Object.assign(this, { centerX: a1, centerY: a2, radius: a3, sideCount: a4, rotation: a5 ?? 0 });
        }
        if (Type.isArray(a1)) {
            Object.assign(this, { centerCoordinates: a1, radius: a2, sideCount: a3, rotation: a4 ?? 0 });
        }
        if (a2 instanceof Point) {
            Object.assign(this, { centerPoint: a1, radius: a2, sideCount: a3, rotation: a4 ?? 0 });
        }
        return Object.seal(this);
    }

    static readonly events = Object.freeze({
        centerXChanged: "centerX" as const,
        centerYChanged: "centerY" as const,
        radiusChanged: "radius" as const,
        sideCountChanged: "sideCount" as const,
        rotationChanged: "rotation" as const
    });

    private _setCenterX(value: number) {
        if (!Utility.isEqualTo(this._centerX, value)) this.trigger_(EventObject.simple(this, RegularPolygon.events.centerXChanged));
        this._centerX = value;
    }
    private _setCenterY(value: number) {
        if (!Utility.isEqualTo(this._centerY, value)) this.trigger_(EventObject.simple(this, RegularPolygon.events.centerYChanged));
        this._centerY = value;
    }
    private _setRadius(value: number) {
        if (!Utility.isEqualTo(this._radius, value)) this.trigger_(EventObject.simple(this, RegularPolygon.events.radiusChanged));
        this._radius = value;
    }
    private _setSideCount(value: number) {
        if (!Utility.isEqualTo(this._sideCount, value)) this.trigger_(EventObject.simple(this, RegularPolygon.events.sideCountChanged));
        this._sideCount = value;
    }
    private _setRotation(value: number) {
        if (!Utility.isEqualTo(this._rotation, value)) this.trigger_(EventObject.simple(this, RegularPolygon.events.rotationChanged));
        this._rotation = value;
    }

    get centerX() {
        return this._centerX;
    }
    set centerX(value) {
        Assert.isRealNumber(value, "centerX");
        this._setCenterX(value);
    }
    get centerY() {
        return this._centerY;
    }
    set centerY(value) {
        Assert.isRealNumber(value, "centerY");
        this._setCenterY(value);
    }
    get centerCoordinates() {
        return [this._centerX, this._centerY] as [number, number];
    }
    set centerCoordinates(value) {
        Assert.isCoordinates(value, "centerCoordinates");
        this._setCenterX(Coordinates.x(value));
        this._setCenterY(Coordinates.y(value));
    }
    get centerPoint() {
        return new Point(this.owner, this._centerX, this._centerY);
    }
    set centerPoint(value) {
        this._setCenterX(value.x);
        this._setCenterY(value.y);
    }
    get radius() {
        return this._radius;
    }
    set radius(value) {
        Assert.isPositiveNumber(value, "radius");
        this._setRadius(value);
    }
    get sideCount() {
        return this._sideCount;
    }
    set sideCount(value) {
        Assert.isInteger(value, "sideCount");
        Assert.comparison(value, "sideCount", "ge", regularPolygonMinSideCount);
        this._setSideCount(value);
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(value) {
        Assert.isRealNumber(value, "rotation");
        this._setRotation(value);
    }

    get apothem() {
        return this.radius * Maths.cos(Maths.PI / this.sideCount);
    }
    get sideLength() {
        return 2 * this.radius * Maths.sin(Maths.PI / this.sideCount);
    }
    get centralAngle() {
        return (2 * Maths.PI) / this.sideCount;
    }
    get interiorAngle() {
        return Maths.PI - (2 * Maths.PI) / this.sideCount;
    }
    get sumOfInteriorAngle() {
        return Maths.PI * (this.sideCount - 2);
    }
    get exteriorAngle() {
        return (2 * Maths.PI) / this.sideCount;
    }
    get diagonalCount() {
        let n = this.sideCount;
        return (n * (n - 3)) / 2;
    }
    isValid() {
        const { centerCoordinates: cc, radius: r, sideCount: n } = this;
        if (!Coordinates.isValid(cc)) return false;
        if (!Type.isPositiveNumber(r)) return false;
        if (!Type.isInteger(n || n < 3)) return false;
        return true;
    }
    getWindingDirection() {
        return this._windingDirection;
    }
    setWindingDirection(direction: Direction) {
        this._windingDirection = direction;
    }
    getLength(): number {
        throw new Error("Method not implemented.");
    }
    isPointOn(point: [number, number] | Point): boolean {
        throw new Error("Method not implemented.");
    }
    isPointOutside(point: [number, number] | Point): boolean {
        throw new Error("Method not implemented.");
    }
    isPointInside(point: [number, number] | Point): boolean {
        throw new Error("Method not implemented.");
    }
    /**
     * Move regular polygon `this` by `offsetX` and `offsetY` to get new regular polygon.
     */
    move(deltaX: number, deltaY: number) {
        return this.clone().moveSelf(deltaX, deltaY);
    }
    /**
     * Move regular polygon `this` itself by `offsetX` and `offsetY`.
     */
    moveSelf(deltaX: number, deltaY: number) {
        this.centerCoordinates = Vector2.add(this.centerCoordinates, [deltaX, deltaY]);
        return this;
    }
    /**
     * Move regular polygon `this` with `distance` along `angle` to get new regular polygon.
     */
    moveAlongAngle(angle: number, distance: number) {
        return this.clone().moveAlongAngleSelf(angle, distance);
    }
    /**
     * Move regular polygon `this` itself with `distance` along `angle`.
     */
    moveAlongAngleSelf(angle: number, distance: number) {
        this.centerCoordinates = Vector2.add(this.centerCoordinates, Vector2.from2(angle, distance));
        return this;
    }

    static fromApothemEtc(owner: Geomtoy, apothem: number, centerCoordinates: [number, number], sideCount: number, rotation: number = 0) {
        let r = apothem / Maths.cos(Maths.PI / sideCount);
        return new RegularPolygon(owner, centerCoordinates, r, sideCount, rotation);
    }
    static fromSideLengthEtc(owner: Geomtoy, sideLength: number, centerCoordinates: [number, number], sideCount: number, rotation: number = 0) {
        let r = sideLength / Maths.sin(Maths.PI / sideCount) / 2;
        return new RegularPolygon(owner, centerCoordinates, r, sideCount, rotation);
    }

    getPoints() {
        return Utility.range(0, this.sideCount).map(index => {
            return new Point(this.owner, Vector2.add(this.centerCoordinates, Vector2.from2(((2 * Maths.PI) / this.sideCount) * index + this.rotation, this.radius)));
        });
    }
    getSideLineSegments() {
        const ps = this.getPoints();
        return Utility.range(0, this.sideCount).forEach(index => {
            new LineSegment(this.owner, Utility.nth(ps, index - this.sideCount)!, Utility.nth(ps, index - this.sideCount + 1)!);
        });
    }

    getCircumscribedCircle() {
        return new Circle(this.owner, this.centerCoordinates, this.radius);
    }
    getInscribedCircle() {
        return new Circle(this.owner, this.centerCoordinates, this.apothem);
    }

    getPerimeter(): number {
        return this.sideCount * this.sideLength;
    }
    getArea(): number {
        let p = this.getPerimeter();
        return (p * this.apothem) / 2;
    }
    apply(transformation: Transformation): Shape {
        throw new Error("Method not implemented.");
    }
    getGraphics() {
        const g = new Graphics();
        if (!this.isValid()) return g;

        const ps = this.getPoints();
        g.moveTo(...Utility.head(ps)!.coordinates!);
        Utility.range(1, this.sideCount).forEach(index => {
            g.lineTo(...ps[index].coordinates);
        });
        g.close();
        return g;
    }
    clone() {
        return new RegularPolygon(this.owner, this.centerX, this.centerY, this.radius, this.sideCount, this.rotation);
    }
    copyFrom(shape: RegularPolygon | null) {
        if (shape === null) shape = new RegularPolygon(this.owner);
        this._setCenterX(shape._centerX);
        this._setCenterY(shape._centerY);
        this._setRadius(shape._radius);
        this._setSideCount(shape._sideCount);
        this._setRotation(shape._rotation);
        return this;
    }
    toString() {
        return [
            `${this.name}(${this.uuid}){`,
            `\tcenterX: ${this.centerX}`,
            `\tcenterY: ${this.centerY}`,
            `\tradius: ${this.radius}`,
            `\tsideCount: ${this.sideCount}`,
            `\trotation: ${this.rotation}`,
            `} owned by Geomtoy(${this.owner.uuid})`
        ].join("\n");
    }
    toArray() {
        return [this.centerX, this.centerY, this.radius, this.sideCount, this.rotation];
    }
    toObject() {
        return {
            centerX: this.centerX,
            centerY: this.centerY,
            radius: this.radius,
            sideCount: this.sideCount,
            rotation: this.rotation
        };
    }
}

validAndWithSameOwner(RegularPolygon);

export default RegularPolygon;
