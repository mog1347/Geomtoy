export declare function sealed(constructor: new (...args: any[]) => any): void;
export declare function is(type: "realNumber" | "positiveNumber" | "negativeNumber" | "size" | "boolean" | "point" | "line" | "ellipse"): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
