import { shapes, objects } from "../collection";

import type Geomtoy from "../geomtoy";
import type EventTarget from "../base/EventTarget";
import type Shape from "../base/Shape";
import type Relationship from "../relationship";
import type Line from "../shapes/basic/Line";
import type Point from "../shapes/basic/Point";
import type Ray from "../shapes/basic/Ray";
import type LineSegment from "../shapes/basic/LineSegment";
import type Transformation from "../transformation";
import type Matrix from "../helper/Matrix";
import type EventObject from "../event/EventObject";

// #region Common
/** @internal */
export type ObjectCollection = {
    [K in keyof typeof objects]: typeof objects[K];
};
/** @internal */
export type ShapeCollection = {
    [K in keyof typeof shapes]: typeof shapes[K];
};

export type Tail<A> = A extends [infer H, ...infer T] ? T : never;
// prettier-ignore
export type ConstructorOverloads<T> =
    T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
        new(...args: infer A6): infer R6
        new(...args: infer A7): infer R7
        new(...args: infer A8): infer R8
        new(...args: infer A9): infer R9
        new(...args: infer A10): infer R10
        new(...args: infer A11): infer R11
        new(...args: infer A12): infer R12
        new(...args: infer A13): infer R13
        new(...args: infer A14): infer R14
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5,
        new (...args: A6) => R6,
        new (...args: A7) => R7,
        new (...args: A8) => R8,
        new (...args: A9) => R9,
        new (...args: A10) => R10,
        new (...args: A11) => R11,
        new (...args: A12) => R12,
        new (...args: A13) => R13,
        new (...args: A14) => R14,
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
        new(...args: infer A6): infer R6
        new(...args: infer A7): infer R7
        new(...args: infer A8): infer R8
        new(...args: infer A9): infer R9
        new(...args: infer A10): infer R10
        new(...args: infer A11): infer R11
        new(...args: infer A12): infer R12
        new(...args: infer A13): infer R13
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5,
        new (...args: A6) => R6,
        new (...args: A7) => R7,
        new (...args: A8) => R8,
        new (...args: A9) => R9,
        new (...args: A10) => R10,
        new (...args: A11) => R11,
        new (...args: A12) => R12,
        new (...args: A13) => R13,
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
        new(...args: infer A6): infer R6
        new(...args: infer A7): infer R7
        new(...args: infer A8): infer R8
        new(...args: infer A9): infer R9
        new(...args: infer A10): infer R10
        new(...args: infer A11): infer R11
        new(...args: infer A12): infer R12
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5,
        new (...args: A6) => R6,
        new (...args: A7) => R7,
        new (...args: A8) => R8,
        new (...args: A9) => R9,
        new (...args: A10) => R10,
        new (...args: A11) => R11,
        new (...args: A12) => R12,
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
        new(...args: infer A6): infer R6
        new(...args: infer A7): infer R7
        new(...args: infer A8): infer R8
        new(...args: infer A9): infer R9
        new(...args: infer A10): infer R10
        new(...args: infer A11): infer R11
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5,
        new (...args: A6) => R6,
        new (...args: A7) => R7,
        new (...args: A8) => R8,
        new (...args: A9) => R9,
        new (...args: A10) => R10,
        new (...args: A11) => R11,
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
        new(...args: infer A6): infer R6
        new(...args: infer A7): infer R7
        new(...args: infer A8): infer R8
        new(...args: infer A9): infer R9
        new(...args: infer A10): infer R10
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5,
        new (...args: A6) => R6,
        new (...args: A7) => R7,
        new (...args: A8) => R8,
        new (...args: A9) => R9,
        new (...args: A10) => R10,
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
        new(...args: infer A6): infer R6
        new(...args: infer A7): infer R7
        new(...args: infer A8): infer R8
        new(...args: infer A9): infer R9
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5,
        new (...args: A6) => R6,
        new (...args: A7) => R7,
        new (...args: A8) => R8,
        new (...args: A9) => R9,
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
        new(...args: infer A6): infer R6
        new(...args: infer A7): infer R7
        new(...args: infer A8): infer R8
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5,
        new (...args: A6) => R6,
        new (...args: A7) => R7,
        new (...args: A8) => R8,
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
        new(...args: infer A6): infer R6
        new(...args: infer A7): infer R7
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5,
        new (...args: A6) => R6,
        new (...args: A7) => R7,
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
        new(...args: infer A6): infer R6
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5,
        new (...args: A6) => R6,
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
        new(...args: infer A5): infer R5
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4,
        new (...args: A5) => R5
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
        new(...args: infer A4): infer R4
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
        new(...args: infer A3): infer R3
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3
    ]
    : T extends {
        new(...args: infer A1): infer R1
        new(...args: infer A2): infer R2
    }
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2
    ]
    : T extends {
        new(...args: infer A1): infer R1
    }
    ? [
        new (...args: A1) => R1
    ]
    : never
// #endregion

// #region Geomtoy
export type StaticMethodsMapper<T extends { new (...args: any[]): any }> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K] extends (...args: any[]) => any ? T[K] : never;
};
export type OwnerCarrier = { owner: Geomtoy };

export type ConstructorTailer<T extends { new (...args: any[]): any }> = {
    (...args: Tail<ConstructorParameters<ConstructorOverloads<T>[number]>>): InstanceType<T>;
};
export type Factory<T extends { new (...args: any[]): any }> = ConstructorTailer<T> & StaticMethodsMapper<T> & OwnerCarrier;

// export
export type RecursivePartial<T> = {
    [K in keyof T]?: T[K] extends (infer U)[] ? RecursivePartial<U>[] : T[K] extends object ? RecursivePartial<T[K]> : T[K];
};

/** @internal */
export type ObjectFactoryCollection = {
    readonly [K in keyof ObjectCollection]: Factory<ObjectCollection[K]>;
};

// Geomtoy global options
export type Options = {
    epsilon: number;
    graphics: {
        pointSize: number;
        lineArrow: boolean;
        vectorArrow: boolean;
        rayArrow: boolean;
        arrow: {
            width: number;
            length: number;
            foldback: number;
            noFoldback: boolean;
        };
    };
    pathSampleRatio: number;
};

export interface ViewportDescriptor {
    width: number;
    height: number;
    density: number;
    zoom: number;
    origin: [number, number];
    pan: [number, number];
    xAxisPositiveOnRight: boolean;
    yAxisPositiveOnBottom: boolean;
    globalTransformation: Matrix;
    globalViewBox: [number, number, number, number];
}

// #endregion

// #region Shape
export type Direction = "positive" | "negative";
export interface ClosedShape {
    getLength(): number;
    getArea(): number;
    getWindingDirection(): Direction;
    setWindingDirection?(direction: Direction): void;
    isPointOn(point: [number, number] | Point): boolean;
    isPointOutside(point: [number, number] | Point): boolean;
    isPointInside(point: [number, number] | Point): boolean;
}
export interface FiniteOpenShape {
    getLength(): number;
    isPointOn(point: [number, number] | Point): boolean;
}
export interface InfiniteOpenShape {
    isPointOn(point: [number, number] | Point): boolean;
}

export interface RotationFeaturedShape {
    get rotation();
    set rotation(value: number);
}

export interface TransformableShape {
    apply(transformation: Transformation): Shape;
}
// #endregion

// #region Data
export type PointLineData = {
    point: Point;
    line: Line;
};
export type PointsLineData = {
    points: Point[];
    line: Line;
};
export type AnglePointLineData = {
    angle: number;
    point: Point;
    line: Line;
};
export type LineSegmentLineData = {
    lineSegment: LineSegment;
    line: Line;
};
export type LineSegmentRayLineData = {
    lineSegment: LineSegment;
    ray: Ray;
    line: Line;
};
// #endregion

// #region Event
// export type EventTargetEventNamesPair<T extends EventTarget> = T | [T, string];

// export type EventObjectFromEventTargetEventNamesPair<T extends EventTargetEventNamesPair<U>[], U extends EventTarget> = {
//     [K in keyof T & number]:
//         T[K] extends U
//         ? EventObject<U>
//         : T[K] extends [U, string]
//         ? EventObject<T[K][0]>
//         : never;
// };

export type EventTargetEventsPair = [EventTarget, string];

export type EventObjectFromPair<T extends EventTargetEventsPair[]> = {
    [K in keyof T]: T[K] extends EventTargetEventsPair ? EventObject<T[K][0]> : never;
};

// export const enum EventHandlerType {
//     On,
//     Bind
// }

// export type EventHandler = OnEventHandler | BindEventHandler

// export type OnEventHandler = {
//     callback: (e: SimpleEventObject | CollectionEventObject) => void
//     context: EventTarget
//     priority: number
//     type: EventHandlerType.On
// }
// export type BindEventHandler = {
//     callback: (e: (EmptyEventObject | SimpleEventObject | CollectionEventObject)[]) => void
//     context: EventTarget
//     relatedEventTargets: EventTarget[]
//     priority: number
//     type: EventHandlerType.Bind
// }

// export const enum EventObjectType {
//     Empty,
//     Simple,
//     Collection
// }
// export type EventObject = EmptyEventObject | SimpleEventObject | CollectionEventObject

// export type EmptyEventObject = {
//     target: EventTarget
//     type: EventObjectType.Empty
// }
// export type SimpleEventObject = {
//     target: EventTarget
//     type: EventObjectType.Simple
//     eventName: string
// }
// export type CollectionEventObject = {
//     target: EventTarget
//     type: EventObjectType.Collection
//     eventName: string
//     uuid: string
//     index: number
// }
// #endregion

// #region Graphics
export const enum GraphicsCommandType {
    MoveTo = "moveTo",
    LineTo = "lineTo",
    BezierCurveTo = "bezierCurveTo",
    QuadraticBezierCurveTo = "quadraticBezierCurveTo",
    ArcTo = "arcTo",
    Close = "close",
    Text = "text",
    Image = "image"
}

export type GraphicsCommand =
    | GraphicsMoveToCommand
    | GraphicsLineToCommand
    | GraphicsBezierCurveToCommand
    | GraphicsQuadraticBezierCurveToCommand
    | GraphicsArcToCommand
    | GraphicsCloseCommand
    | GraphicsTextCommand
    | GraphicsImageCommand;

export type GraphicsGeometryCommand =
    | GraphicsMoveToCommand
    | GraphicsLineToCommand
    | GraphicsBezierCurveToCommand
    | GraphicsQuadraticBezierCurveToCommand
    | GraphicsArcToCommand
    | GraphicsCloseCommand;

export type GraphicsImageCommand = {
    type: GraphicsCommandType.Image;
    x: number;
    y: number;
    width: number;
    height: number;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
    imageSource: string;
};
export type GraphicsTextCommand = {
    type: GraphicsCommandType.Text;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fontFamily: string;
    fontBold: boolean;
    fontItalic: boolean;
};

export type GraphicsMoveToCommand = {
    type: GraphicsCommandType.MoveTo;
    x: number;
    y: number;
};
export type GraphicsLineToCommand = {
    type: GraphicsCommandType.LineTo;
    x: number;
    y: number;
};
export type GraphicsBezierCurveToCommand = {
    type: GraphicsCommandType.BezierCurveTo;
    x: number;
    y: number;
    controlPoint1X: number;
    controlPoint1Y: number;
    controlPoint2X: number;
    controlPoint2Y: number;
};
export type GraphicsQuadraticBezierCurveToCommand = {
    type: GraphicsCommandType.QuadraticBezierCurveTo;
    x: number;
    y: number;
    controlPointX: number;
    controlPointY: number;
};
export type GraphicsArcToCommand = {
    type: GraphicsCommandType.ArcTo;
    x: number;
    y: number;
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    xAxisRotation: number;
    startAngle: number;
    endAngle: number;
    largeArc: boolean;
    positive: boolean;
};
export type GraphicsCloseCommand = {
    type: GraphicsCommandType.Close;
};

// #endregion

// #region Font
export type FontConfig = {
    fontSize: number;
    fontFamily: string;
    fontBold: boolean;
    fontItalic: boolean;
};
// #endregion

// #region Path
export type PathCommand = PathMoveToCommand | PathLineToCommand | PathBezierCurveToCommand | PathQuadraticBezierCurveToCommand | PathArcToCommand;

export type PathCommandWithUuid = PathCommand & { uuid: string };

export const enum PathCommandType {
    MoveTo = "M",
    LineTo = "L",
    BezierCurveTo = "C",
    QuadraticBezierCurveTo = "Q",
    ArcTo = "A"
}

export type PathMoveToCommand = {
    type: PathCommandType.MoveTo;
    x: number;
    y: number;
};
export type PathLineToCommand = {
    type: PathCommandType.LineTo;
    x: number;
    y: number;
};
export type PathBezierCurveToCommand = {
    type: PathCommandType.BezierCurveTo;
    x: number;
    y: number;
    controlPoint1X: number;
    controlPoint1Y: number;
    controlPoint2X: number;
    controlPoint2Y: number;
};
export type PathQuadraticBezierCurveToCommand = {
    type: PathCommandType.QuadraticBezierCurveTo;
    x: number;
    y: number;
    controlPointX: number;
    controlPointY: number;
};
export type PathArcToCommand = {
    type: PathCommandType.ArcTo;
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
    xAxisRotation: number;
    largeArc: boolean;
    positive: boolean;
};
// #endregion

// #region Polygon
export type PolygonVertex = {
    x: number;
    y: number;
};

export type PolygonVertexWithUuid = PolygonVertex & { uuid: string };

// #endregion

// #region Relationship
export type AnyShape = InstanceType<ShapeCollection[keyof ShapeCollection]>;

export type KeyOfShape<T> = {
    [K in keyof ShapeCollection]: ShapeCollection[K] extends T ? K : never;
}[keyof ShapeCollection];

export type AnyRelationship = {
    [K in keyof typeof Relationship.relationshipOperators]: typeof Relationship.relationshipOperators[K];
}[keyof typeof Relationship.relationshipOperators];

export type VerbOfRelationship<T extends AnyRelationship> = T["verb"];

// prettier-ignore
export type RelationshipMethodName<T extends AnyShape, U extends AnyShape, V extends AnyRelationship> = 
    `${Uncapitalize<KeyOfShape<T>>}${VerbOfRelationship<V>}${KeyOfShape<U>}` & keyof V

export type RelationshipMethod<T extends AnyShape, U extends AnyShape, V extends AnyRelationship> = V[RelationshipMethodName<T, U, V>] extends (...args: any[]) => any
    ? V[RelationshipMethodName<T, U, V>]
    : never;

// #endregion
