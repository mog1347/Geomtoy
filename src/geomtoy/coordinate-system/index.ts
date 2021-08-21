import math from "../utility/math"
import vec2 from "../utility/vec2"

class Cartesian {
    constructor(public x: number, public y: number) {}
    toPolar() {
        let { x, y } = this,
            r = math.hypot(x, y),
            theta = math.atan2(y, x)
        return new Polar(r, theta)
    }
    toBarycentric(c1: [number, number], c2: [number, number], c3: [number, number]) {
        let { x, y } = this,
            // d = vec2.cross(vec2.from(c3, c1), vec2.from(c3, c2)),
            // a1 = vec2.cross(vec2.from(c3, [x, y]), vec2.from(c3, c2)),
            // a2 = vec2.cross(vec2.from(c3, [x, y]), vec2.from(c1, c3)),
            // lambda1 = a1 / d,
            // lambda2 = a2 / d,
            // lambda3 = 1 - lambda1 - lambda2
            a1 = vec2.cross(vec2.from(c2,c3),vec2.from(c2,[x,y])),
            a2 = vec2.cross(vec2.from(c3,c1),vec2.from(c3,[x,y])),
            a3 = vec2.cross(vec2.from(c1,c2),vec2.from(c1,[x,y]))
        return new Barycentric(a1, a2, a3)
    }
    toTrilinear(c1: [number, number], c2: [number, number], c3: [number, number]) {
        let { lambda1, lambda2, lambda3 } = this.toBarycentric(c1, c2, c3),
            l1 = vec2.magnitude(vec2.from(c2, c3)),
            l2 = vec2.magnitude(vec2.from(c3, c1)),
            l3 = vec2.magnitude(vec2.from(c1, c2))

        lambda1 /= l1
        lambda2 /= l2
        lambda3 /= l3
        return new Trilinear(lambda1, lambda2, lambda3)
    }
    valueOf(): [number, number] {
        return [this.x, this.y]
    }
}

class Polar {
    constructor(public r: number, public theta: number) {}
    toCartesian() {
        let { r, theta } = this,
            x = r * math.cos(theta),
            y = r * math.sin(theta)
        return new Cartesian(x, y)
    }
    valueOf(): [number, number] {
        return [this.r, this.theta]
    }
}

class Barycentric {
    constructor(public lambda1: number, public lambda2: number, public lambda3: number) {
        this.simplify()
    }
    simplify() {
        let { lambda1, lambda2, lambda3 } = this
        if (!math.equalTo(lambda1 + lambda2 + lambda3, 1, Number.EPSILON)) {
            let sum = lambda1 + lambda2 + lambda3
            this.lambda1 /= sum
            this.lambda2 /= sum
            this.lambda3 /= sum
        }
    }
    toCartesian(c1: [number, number], c2: [number, number], c3: [number, number]) {
        let { lambda1, lambda2, lambda3 } = this,
            [x, y] = vec2.add(vec2.add(vec2.scalarMultiply(c1, lambda1), vec2.scalarMultiply(c2, lambda2)), vec2.scalarMultiply(c3, lambda3))
        return new Cartesian(x, y)
    }
    valueOf(): [number, number, number] {
        return [this.lambda1, this.lambda2, this.lambda3]
    }
}

class Trilinear {
    constructor(public lambda1: number, public lambda2: number, public lambda3: number) {
        this.simplify()
    }
    simplify() {
        let { lambda1, lambda2, lambda3 } = this
        if (!math.equalTo(lambda1 + lambda2 + lambda3, 1, Number.EPSILON)) {
            let sum = lambda1 + lambda2 + lambda3
            this.lambda1 /= sum
            this.lambda2 /= sum
            this.lambda3 /= sum
        }
    }
    toCartesian(c1: [number, number], c2: [number, number], c3: [number, number]) {
        let { lambda1, lambda2, lambda3 } = this,
            l1 = vec2.magnitude(vec2.from(c2, c3)),
            l2 = vec2.magnitude(vec2.from(c3, c1)),
            l3 = vec2.magnitude(vec2.from(c1, c2))

        lambda1 *= l1
        lambda2 *= l2
        lambda3 *= l3
        return new Barycentric(lambda1, lambda2, lambda3).toCartesian(c1, c2, c3)
    }
    valueOf(): [number, number, number] {
        return [this.lambda1, this.lambda2, this.lambda3]
    }
}

export { Cartesian, Polar, Barycentric, Trilinear }
