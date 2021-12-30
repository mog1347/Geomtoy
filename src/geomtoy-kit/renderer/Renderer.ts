import ImageSourceManager from "../helper/ImageSourceManager";
import TextMeasurer from "../helper/TextMeasurer";
import Display from "./Display";

import type { ContainerElement, StrokeLineCapType, StrokeLineJoinType, PathLike, Style } from "../types";
import type Geomtoy from "../../geomtoy";
import type Shape from "../../geomtoy/base/Shape";

const dataKeyRendererInitialized = "data-renderer-initialized";

export default abstract class Renderer {
    abstract get container(): ContainerElement;

    private _geomtoy: Geomtoy;
    private _display: Display;
    private _imageSourceManager = new ImageSourceManager();
    private _textMeasurer = new TextMeasurer();
    protected style_: Partial<Style> = {};

    constantImage = false;

    constructor(geomtoy: Geomtoy) {
        this._geomtoy = geomtoy;
        this._display = new Display(this);
    }

    get geomtoy() {
        return this._geomtoy;
    }
    get display() {
        return this._display;
    }
    get imageSourceManager() {
        return this._imageSourceManager;
    }
    get textMeasurer() {
        return this._textMeasurer;
    }

    protected manageRendererInitialized_() {
        if (this.container.getAttribute(dataKeyRendererInitialized) !== null) {
            throw new Error("[G]A renderer has been initialized on this element.");
        }
        this.container.setAttribute(dataKeyRendererInitialized, "");
    }
    protected isShapeOwnerEqual_(shape: Shape) {
        if (shape.owner !== this.geomtoy) {
            throw new Error("[G]A `Shape` can only be drawn by a `Renderer` that has the same `geomtoy` as its `owner`.");
        }
    }

    abstract draw(shape: Shape, onTop: boolean): PathLike;
    abstract drawBatch(shapes: Shape[], onTop: boolean): PathLike[];

    fill(fill: string) {
        this.style_.fill = fill;
    }
    stroke(stroke: string) {
        this.style_.stroke = stroke;
    }
    strokeWidth(strokeWidth: number) {
        const scale = this.display.density * this.display.zoom;
        this.style_.strokeWidth = strokeWidth / scale;
    }
    strokeDash(strokeDash: number[]) {
        const scale = this.display.density * this.display.zoom;
        this.style_.strokeDash = strokeDash.map(n => n / scale);
    }
    strokeDashOffset(strokeDashOffset: number) {
        const scale = this.display.density * this.display.zoom;
        this.style_.strokeDashOffset = strokeDashOffset / scale;
    }
    strokeLineJoin(strokeLineJoin: StrokeLineJoinType) {
        this.style_.strokeLineJoin = strokeLineJoin;
    }
    strokeLineCap(strokeLineCap: StrokeLineCapType) {
        this.style_.strokeLineCap = strokeLineCap;
    }
    strokeMiterLimit(strokeMiterLimit: number) {
        this.style_.strokeMiterLimit = strokeMiterLimit;
    }
}
