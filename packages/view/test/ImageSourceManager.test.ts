import { svgSetup, svgTeardown, canvasSetup, canvasTeardown } from "./util";
import { visualTestSize, diffPixelData } from "./util/visual";
import Geomtoy from "@geomtoy/core";
import CanvasRenderer from "../src/renderer/CanvasRenderer";
import SvgRenderer from "../src/renderer/SvgRenderer";

const expect = chai.expect;

describe("", () => {
    let canvasElement: HTMLCanvasElement;
    let svgElement: SVGSVGElement;
    let cr: CanvasRenderer;
    let sr: SvgRenderer;
    const g = new Geomtoy();

    before(() => {
        canvasElement = canvasSetup();
        svgElement = svgSetup();
        cr = new CanvasRenderer(canvasElement, g, { showAxis: false, showGrid: false, showLabel: false });
        sr = new SvgRenderer(svgElement, g, { showAxis: false, showGrid: false, showLabel: false });
    });
    after(() => {
        canvasTeardown();
        svgTeardown();
    });

    it("constructor", () => {});
    it("display", () => {
        sr.display.width = visualTestSize.width;
        sr.display.height = visualTestSize.height;
        expect(canvasElement.getAttribute("width")).to.be.equal(`${visualTestSize.width}`);
        expect(canvasElement.getAttribute("height")).to.be.equal(`${visualTestSize.height}`);
    });

    it("visual-1", async () => {
        const visual1Url = "http://localhost:9876/base/test/visual/visual-1.png";
        const circle = g.Circle(visualTestSize.width / 2, visualTestSize.height / 2, 10);
        sr.stroke("black");
        sr.fill("transparent");
        sr.draw(circle);
        await diffPixelData(visual1Url, canvasElement, [visualTestSize.width, visualTestSize.height]);
    });

    it("visual-2", async () => {
        const visual1Url = "http://localhost:9876/base/test/visual/visual-2.png";
        const triangle = g.Triangle(0, 0, 25, 100, 80, 90);

        sr.stroke("red");
        sr.strokeWidth(2);
        sr.fill("rgba(255,0,0,0.5");
        sr.draw(triangle);

        await diffPixelData(visual1Url, canvasElement, [visualTestSize.width, visualTestSize.height]);
    });
});
