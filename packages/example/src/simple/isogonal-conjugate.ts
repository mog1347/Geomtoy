import Geomtoy from "@geomtoy/core";
import { Maths } from "@geomtoy/util";
import { View, ViewElement, CanvasRenderer, SvgRenderer } from "@geomtoy/view";
import color from "../assets/color";
import { mathFont } from "../assets/font";
import tpl from "../assets/templates/full-dual-renderer";

import type { EventObject, Text, Point } from "@geomtoy/core";

const [canvas, svg] = tpl.initRenderer();
tpl.setDescription(`
    <strong>Touchables</strong>
    <ul>
        <li>Points: A, B, P</li>
        <li>Lines: AB</li>
        <li>Circles: O</li>
    </ul>
    <strong>Description</strong>
    <ol>
        <li>Point P is constrained on line AB.</li>
        <li>Move point P to determine the distance between it and point A. The distance will be kept until you move point P.</li>
        <li>Point A and point B determine line AB.</li>
        <li>Point A, point B and point P will follow line AB to move.</li>
        <li>Move line AB or circle O to get the intersection points of them.</li>
    </ol>
`);

const G = new Geomtoy({
    epsilon: 2 ** -32,
    graphics: {
        pointSize: 6,
        arrow: {
            width: 9,
            length: 20,
            foldback: 0,
            noFoldback: true
        }
    }
});

const canvasRenderer = new CanvasRenderer(canvas, G);
canvasRenderer.display.density = 10;
canvasRenderer.display.zoom = 1;
canvasRenderer.display.yAxisPositiveOnBottom = false;
canvasRenderer.display.xAxisPositiveOnRight = false;

const svgRenderer = new SvgRenderer(svg, G);
svgRenderer.display.density = 10;
svgRenderer.display.zoom = 1;
// svgRenderer.display.yAxisPositiveOnBottom = false;
// svgRenderer.display.xAxisPositiveOnRight = false;

const view = new View(G, { hoverForemost: false });
tpl.switchRenderer({ canvas: canvasRenderer, svg: svgRenderer }, "canvas", renderer => {
    view.use(renderer, (width, height) => (view.renderer.display.origin = [width / 2, height / 2]));
});

const main = () => {
    const pointA = G.Point(-25, -12);
    const pointB = G.Point(-20, 25);

    const offsetLabel = function (this: Text, [e]: [EventObject<Point>]) {
        this.coordinates = e.target.move(1, 1).coordinates;
    };

    const lineAB = G.Line()
        .bind(
            [
                [pointA, "any"],
                [pointB, "any"]
            ],
            function ([e1, e2]) {
                this.copyFrom(G.Line.fromTwoPoints(e1.target, e2.target));
            }
        )
        .on(
            "any",
            function () {
                const [oldX, oldY] = pointA.coordinates;
                const [newX, newY] = this.coordinates;
                const [dx, dy] = [newX - oldX, newY - oldY];
                pointA.moveSelf(dx, dy);
                pointB.moveSelf(dx, dy);
            },
            { hasRecursiveEffect: true }
        );

    const labelA = G.Text("A", mathFont).bind([[pointA, "any"]], offsetLabel);
    const labelB = G.Text("B", mathFont).bind([[pointB, "any"]], offsetLabel);

    const pointP = G.Point()
        .data("distToPointA", 5)
        .bind(
            [
                [pointA, "any"],
                [pointB, "any"]
            ],
            function ([e1, e2]) {
                const angle = G.Vector(e1.target, e2.target).angle;
                this.copyFrom(e1.target.moveAlongAngle(angle, this.data("distToPointA")));
            },
            { immediately: true, priority: 0 }
        );
    const labelP = G.Text("P", mathFont).bind([[pointP, "any"]], offsetLabel, { priority: 0 });

    pointP.on("x y", function () {
        if (Maths.abs(lineAB.slope) <= 1) {
            this.y = lineAB.getYWhereXEqualTo(this.x);
        } else {
            this.x = lineAB.getXWhereYEqualTo(this.y);
        }
        const d1 = G.Vector(pointA, this).angle;
        const d2 = G.Vector(pointA, pointB).angle;
        this.data("distToPointA", (Maths.equalTo(d1, d2, G.options().epsilon) ? 1 : -1) * this.getDistanceBetweenPoint(pointA));
    });

    const [pointInt1, pointInt2] = [G.Point.zero(), G.Point.zero()];
    const circle = G.Circle(0, 0, 10);
    const pointO = G.Point().bind([[circle, "any"]], function ([e]) {
        this.copyFrom(e.target.centerPoint);
    });
    const labelO = G.Text("O", mathFont).bind([[pointO, "any"]], offsetLabel, { priority: 0 });

    G.Group([pointInt1, pointInt2]).bind(
        [
            [lineAB, "any"],
            [circle, "any"]
        ],
        function ([e1, e2]) {
            const ret = e1.target.getIntersectionPointsWithCircle(e2.target);
            this.items[0].copyFrom(ret === null ? null : ret[0]);
            this.items[1].copyFrom(ret === null ? null : ret[1]);
        }
    );
    // const path = G.Path()
    // path.appendCommand(G.Path.moveTo([0,0]))
    // path.appendCommand(G.Path.lineTo([20,20]))
    // path.appendCommand(G.Path.bezierCurveTo([20,20],[50,50],[30,25]))

    const image = G.Image(
        1,
        1,
        314,
        50,
        // 314,
        // 134,
        198,
        315,
        157,
        67,
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile02.16sucai.com%2Fd%2Ffile%2F2014%2F0829%2Fb871e1addf5f8e96f3b390ece2b2da0d.jpg&refer=http%3A%2F%2Ffile02.16sucai.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640132601&t=f76de25d7d398d40876eda69258d897c"
    );
    // const image = G.Image(0, 0, 25, 60, "https://img2.baidu.com/it/u=2911187851,1970588509&fm=26&fmt=auto");

    const hoverStyle = {
        fill: color("orange"),
        stroke: color("orange", 0.75)
    };
    const activeStyle = {
        fill: color("blue"),
        stroke: color("blue", 0.75)
    };

    view.add(new ViewElement(pointA, true, { fill: color("black") }, hoverStyle, activeStyle))
        .add(new ViewElement(labelA, false, { fill: color("black") }, hoverStyle, activeStyle))
        .add(new ViewElement(pointB, true, { fill: color("black") }, hoverStyle, activeStyle))
        .add(new ViewElement(labelB, false, { fill: color("black") }, hoverStyle, activeStyle))

        .add(new ViewElement(pointP, true, { fill: color("green") }, hoverStyle, activeStyle))
        .add(new ViewElement(labelP, false, { fill: color("green") }, hoverStyle, activeStyle))
        .add(new ViewElement(lineAB, true, { stroke: color("orange"), strokeWidth: 3, fill: "transparent" }, hoverStyle, activeStyle))

        .add(new ViewElement(labelO, false, { fill: color("red") }))
        .add(new ViewElement(circle, true, { fill: color("red", 0.2), stroke: color("red"), strokeWidth: 1 }, hoverStyle, activeStyle))
        .add(new ViewElement(pointO, false, { stroke: color("red"), strokeWidth: 2 }, hoverStyle, activeStyle))

        .add(new ViewElement(pointInt1, false, { stroke: color("lightBlue"), strokeWidth: 2 }, hoverStyle, activeStyle))
        .add(new ViewElement(pointInt2, false, { stroke: color("lightBlue"), strokeWidth: 2 }, hoverStyle, activeStyle))
        .add(new ViewElement(image, true, { fill: color("red", 0.75) }, hoverStyle, activeStyle))
        .add(new ViewElement(G.Point.zero(), false, { fill: color("gray") }, hoverStyle, activeStyle));
    // .add(new ViewElement(path, true, { fill: color("red", 0.75) }, hoverStyle, activeStyle));
};
main();
