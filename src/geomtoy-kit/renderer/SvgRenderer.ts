import Renderer from "./Renderer";
import SvgInterface from "./SvgInterface";

import type { GraphicsGeometryCommand, GraphicsImageCommand, GraphicsTextCommand } from "../../geomtoy/types";
import type Geomtoy from "../../geomtoy";
import type Shape from "../../geomtoy/base/Shape";

/**
 * @category Renderer
 */
export default class SvgRenderer extends Renderer {
    surface: SVGGElement;
    interfaceSurface: SVGGElement;

    private _container: SVGSVGElement;
    private _interface: SvgInterface;
    private _buffer = document.createDocumentFragment();
    private _bufferFlushScheduled: boolean = false;

    constructor(container: SVGSVGElement, geomtoy: Geomtoy) {
        super(geomtoy);

        if (container instanceof SVGSVGElement) {
            this.manageRendererInitialized_();
            this._container = container;
            this._interface = new SvgInterface(this);

            this.container.style["touch-action" as any] = "none";
            this.container.style["user-select" as any] = "none";
            this.container.style["-webkit-tap-highlight-color" as any] = "transparent";
            this.container.style["-webkit-touch-callout" as any] = "none";

            // if the svg is not empty
            this.container.innerHTML = "";
            this.container.insertAdjacentHTML(
                "beforeend",
                `
                <style>
                    #geomtoyTools, #geomtoyScene, #geomtoyScene *{
                        pointer-events: none;
                    }
                    #geomtoyScene text {
                        user-select: none;
                    }
                </style>
            `
            );

            this.interfaceSurface = document.createElementNS("http://www.w3.org/2000/svg", "g");
            this.interfaceSurface.setAttribute("id", "geomtoyInterface");
            this.container.append(this.interfaceSurface);

            this.surface = document.createElementNS("http://www.w3.org/2000/svg", "g");
            this.surface.setAttribute("id", "geomtoyScene");
            this.container.append(this.surface);

            return this;
        }
        throw new Error("[G]Unable to initialize, the container` is not a `SVGSVGElement`.");
    }

    get container() {
        return this._container;
    }

    private _getBoundingBox(x: number, y: number, w: number, h: number) {
        return [
            [x, y],
            [x + w, y],
            [x + w, y + h],
            [x, y + h]
        ] as const;
    }

    private _setStyle(pathEl: SVGPathElement | SVGTextElement, [noFill = false, noStroke = false] = []) {
        if (noFill) {
            pathEl.setAttribute("fill", "transparent");
        } else {
            this.style_.fill && pathEl.setAttribute("fill", this.style_.fill);
        }

        if (noStroke) {
            pathEl.setAttribute("stroke", "transparent");
            pathEl.setAttribute("stroke-width", "0");
        } else {
            this.style_.stroke && pathEl.setAttribute("stroke", this.style_.stroke);
            this.style_.strokeWidth && pathEl.setAttribute("stroke-width", `${this.style_.strokeWidth}`);
            if (this.style_.strokeDash?.length) {
                pathEl.setAttribute("stroke-dasharray", `${this.style_.strokeDash.join(",")}`);
                this.style_.strokeDashOffset && pathEl.setAttribute("stroke-dashoffset", `${this.style_.strokeDashOffset}`);
            }
            this.style_.lineJoin && pathEl.setAttribute("stroke-linejoin", this.style_.lineJoin);
            this.style_.miterLimit && pathEl.setAttribute("stroke-miterlimit", `${this.style_.miterLimit}`);
            this.style_.lineCap && pathEl.setAttribute("stroke-linecap", this.style_.lineCap);
        }
    }

    private _drawImage(cmd: GraphicsImageCommand, pathEl: SVGPathElement, onTop = false) {
        const { imageSource, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight } = cmd;

        const obtained = this.imageSourceManager_.successful(imageSource);
        const imageEl = obtained ? this.imageSourceManager_.take(imageSource)! : this.imageSourceManager_.placeholderForSvg(width, height);

        const imageWrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const imageClipper = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        imageClipper.append(imageEl);
        imageWrapper.append(imageClipper);
        // image orientation
        imageWrapper.setAttribute("transform", `matrix(${this.display.globalTransformation.invert().get().join(" ")})`);

        const [tX, tY] = this.display.globalTransformation.transformCoordinates([x, y]);
        const scale = this.display.density * this.display.zoom;
        const [atW, atH] = [width / scale, height / scale];
        const offsetX = this.display.xAxisPositiveOnRight ? 0 : width;
        const offsetY = this.display.yAxisPositiveOnBottom ? 0 : height;

        imageClipper.setAttribute("x", `${tX - offsetX}`);
        imageClipper.setAttribute("y", `${tY - offsetY}`);
        imageClipper.setAttribute("width", `${width}`);
        imageClipper.setAttribute("height", `${height}`);

        if (obtained && !isNaN(sourceX) && !isNaN(sourceY) && !isNaN(sourceWidth) && !isNaN(sourceHeight)) {
            imageClipper.setAttribute("viewBox", `${sourceX} ${sourceY} ${sourceWidth} ${sourceHeight}`);
        }

        // draw bounding box
        const box = this._getBoundingBox(x, y, atW, atH);
        pathEl.setAttribute("d", `M${box[0].join(",")}L${box[1].join(",")}L${box[2].join(",")}L${box[3].join(",")}Z`);
        this._setStyle(pathEl);

        if (onTop) {
            this._buffer.append(pathEl);
            this._buffer.append(imageWrapper);
        } else {
            this._buffer.prepend(imageWrapper);
            this._buffer.prepend(pathEl);
        }
    }

    private _drawText(cmd: GraphicsTextCommand, pathEl: SVGPathElement, onTop = false) {
        const { x, y, text, fontSize, fontFamily, fontBold, fontItalic } = cmd;
        const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");

        // text baseline
        textEl.setAttribute("dominant-baseline", "hanging");
        // text font style
        textEl.setAttribute("font-size", `${fontSize}`);
        textEl.setAttribute("font-family", `${fontFamily}`);
        fontBold && textEl.setAttribute("font-weight", "bold");
        fontItalic && textEl.setAttribute("font-style", "italic");

        const [tX, tY] = this.display.globalTransformation.transformCoordinates([x, y]);
        const textBox = this.textMeasurer_.measure({ fontSize, fontFamily, fontBold, fontItalic }, "hanging", text);
        const scale = this.display.density * this.display.zoom;
        const [atW, atH] = [textBox.width / scale, textBox.height / scale];
        const offsetX = this.display.xAxisPositiveOnRight ? 0 : atW;
        const offsetY = this.display.yAxisPositiveOnBottom ? 0 : atH;

        textEl.setAttribute("x", `${tX}`);
        textEl.setAttribute("y", `${tY}`);
        // text content
        textEl.textContent = text;
        // text style
        this._setStyle(textEl, [false, true]);
        // text orientation
        textEl.setAttribute("transform", `matrix(${this.display.globalTransformation.invert().get().join(" ")})`);

        // draw bounding box
        const box = this._getBoundingBox(x - offsetX, y - offsetY, atW, atH);
        pathEl.setAttribute("d", `M${box[0].join(",")}L${box[1].join(",")}L${box[2].join(",")}L${box[3].join(",")}Z`);
        this._setStyle(pathEl, [true, false]);

        if (onTop) {
            this._buffer.append(pathEl);
            this._buffer.append(textEl);
        } else {
            this._buffer.prepend(textEl);
            this._buffer.prepend(pathEl);
        }
    }

    private _drawGeometry(cmds: GraphicsGeometryCommand[], pathEl: SVGPathElement, onTop = false) {
        let d = "";
        cmds.forEach(cmd => {
            if (cmd.type === "moveTo") d += `M${cmd.x},${cmd.y}`;
            if (cmd.type === "lineTo") d += `L${cmd.x},${cmd.y}`;
            if (cmd.type === "bezierCurveTo") d += `C${cmd.controlPoint1X},${cmd.controlPoint1Y} ${cmd.controlPoint2X},${cmd.controlPoint2Y} ${cmd.x},${cmd.y}`;
            if (cmd.type === "quadraticBezierCurveTo") d += `Q${cmd.controlPointX},${cmd.controlPointY} ${cmd.x},${cmd.y}`;
            if (cmd.type === "arcTo") d += `A${cmd.radiusX} ${cmd.radiusY} ${cmd.xAxisRotation} ${cmd.largeArc ? 1 : 0} ${cmd.positive ? 1 : 0} ${cmd.x},${cmd.y}`;
            if (cmd.type === "close") d += `Z`;
        });
        pathEl.setAttribute("d", d);
        this._setStyle(pathEl);
        if (onTop) {
            this._buffer.append(pathEl);
        } else {
            this._buffer.prepend(pathEl);
        }
    }

    private async _flushBuffer() {
        if (this._bufferFlushScheduled) return;
        this._bufferFlushScheduled = true;

        const createdInterface = await this._interface.create();

        Promise.resolve().then(() => {
            const gt = this.display.globalTransformation.get();
            this.surface.setAttribute("transform", `matrix(${gt.join(" ")})`);
            this.interfaceSurface.replaceChildren(createdInterface);
            this.surface.replaceChildren(this._buffer);
            this._bufferFlushScheduled = false;
        });
    }
    draw(shape: Shape, onTop = false) {
        this.isShapeOwnerEqual(shape);

        const cmds = shape.getGraphics(this.display).commands;
        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");

        const onlyOneCommand = cmds.length === 1 && cmds[0];

        if (onlyOneCommand && onlyOneCommand.type === "text") {
            this._drawText(onlyOneCommand, pathEl, onTop);
        } else if (onlyOneCommand && onlyOneCommand.type === "image") {
            this._drawImage(onlyOneCommand, pathEl, onTop);
        } else {
            this._drawGeometry(cmds as GraphicsGeometryCommand[], pathEl, onTop);
        }

        this._flushBuffer();
        return pathEl;
    }
    drawBatch(shapes: Shape[], onTop = false) {
        return shapes.map(o => this.draw(o, onTop));
    }
}
