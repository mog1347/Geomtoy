import Vector2 from "./Vector2";
import Maths from "./Maths";
import Type from "./Type";

import type { StaticClass } from "./types";

interface Complex extends StaticClass {}
class Complex {
    /**
     * The imaginary unit, the square root of -1.
     */
    static i() {
        return [0, 1] as [number, number];
    }
    /**
     * The `real` part (first entry) of complex number `c`.
     * @param c
     * @param real
     */
    static real(c: [number, number], real?: number) {
        if (real !== undefined) c[0] = real;
        return c[0];
    }
    /**
     * The `imag(imaginary)` part (second entry) of complex number `c`.
     * @param c
     * @param imag
     */
    static imag(c: [number, number], imag?: number) {
        if (imag !== undefined) c[1] = imag;
        return c[1];
    }
    /**
     * Whether complex number `c` is purely real number.
     * @param c
     */
    static isPurelyReal(c: [number, number]) {
        return c[1] === 0;
    }
    /**
     * Whether complex number `c` is purely imaginary number.
     * @param c
     */
    static isPurelyImag(c: [number, number]) {
        return c[0] === 0;
    }
    /**
     * The modulus of complex number `c`.
     * @param c
     */
    static modulus(c: [number, number]) {
        return Vector2.magnitude(c);
    }
    /**
     * The squared modulus of complex number `c`.
     * @param c
     */
    static squaredModulus(c: [number, number]) {
        return Vector2.squaredMagnitude(c);
    }
    /**
     * The argument of complex number `c`.
     * @param c
     */
    static argument(c: [number, number]) {
        return Vector2.angle(c);
    }
    /**
     * Returns a new complex number from argument `a` and modulus `m`
     * @param a
     * @param m
     */
    static from(a: number, m: number) {
        return Vector2.from2(a, m);
    }
    /**
     * Whether complex number `c` is valid.
     * @param c
     */
    static isValid(c: [number, number]) {
        return c.every(elem => Type.isExtendedRealNumber(elem));
    }
    /**
     * Returns a new complex number of adding `c1` by `c2`.
     * @param c1
     * @param c2
     */
    static add(c1: [number, number], c2: [number, number]) {
        return Vector2.add(c1, c2);
    }
    /**
     * Returns a new complex number of subtracting `c1` by `c2`.
     * @param c1
     * @param c2
     */
    static subtract(c1: [number, number], c2: [number, number]) {
        return Complex.add(c1, Complex.negative(c2));
    }
    /**
     * Returns a new complex number of multiplying `c1` by `c2`.
     * @param c1
     * @param c2
     */
    static multiply(c1: [number, number], c2: [number, number]) {
        const [re1, im1] = c1;
        const [re2, im2] = c2;
        return [re1 * re2 - im1 * im2, re1 * im2 + im1 * re2] as [number, number];
    }
    /**
     * Returns a new complex number of dividing `c1` by `c2`.
     * @param c1
     * @param c2
     */
    static divide(c1: [number, number], c2: [number, number]) {
        return Complex.multiply(c1, Complex.reciprocal(c2));
    }
    /**
     * Returns the negative of complex number `c`.
     * @param c
     */
    static negative(c: [number, number]) {
        return Vector2.negative(c);
    }
    /**
     * Returns the reciprocal of complex number `c`.
     * @param c
     */
    static reciprocal(c: [number, number]) {
        const [re, im] = c;
        if (re === 0 && im === 0) return [Infinity, Infinity] as [number, number];
        const d = re ** 2 + im ** 2;
        return [re / d, -im / d] as [number, number];
    }
    /**
     * Returns a new complex number of complex number `c` multiplying a scalar `s`.
     * @param c
     * @param s
     */
    static scalarMultiply(c: [number, number], s: number) {
        return Vector2.scalarMultiply(c, s);
    }
    /**
     * Returns the conjugate of complex number `c`.
     * @param c
     */
    static conjugate(c: [number, number]) {
        return [c[0], -c[1]] as [number, number];
    }

    /**
     * Returns the natural logarithm (base $e$) of complex number `c`.
     * @note
     * Only the principal value is returned.
     * @param c
     */
    static log(c: [number, number]) {
        const [re, im] = c;
        if (re === 0 && im === 0) return [-Infinity, -Infinity] as [number, number];
        return [Maths.log(Complex.modulus(c)), Complex.argument(c)] as [number, number];
    }
    /**
     * Returns the square root of complex number `c`.
     * @note
     * Only the principal square root is returned. The other one is its conjugate.
     * @param c
     */
    static sqrt(c: [number, number]) {
        const [re, im] = c;
        const m = Complex.modulus(c);
        const [x, y] = [m + re, m - re];
        return [Maths.sqrt(x / 2), (im < 0 ? -1 : 1) * Maths.sqrt(y / 2)] as [number, number];
    }
    /**
     * Returns the base $e$(the base of natural logarithms) raised to the power of the complex exponent `c`.
     * @param c
     */
    static exp(c: [number, number]) {
        const [re, im] = c;
        return [Maths.exp(re) * Maths.cos(im), Maths.exp(re) * Maths.sin(im)] as [number, number];
    }
    // #region Trigonometric and Hyperbolic functions
    /**
     * Returns the sine of complex number `c`.
     * @param c
     */
    static sin(c: [number, number]) {
        const [re, im] = c;
        return [Maths.sin(re) * Maths.cosh(im), Maths.cos(re) * Maths.sinh(im)] as [number, number];
    }
    /**
     * Returns the cosine of complex number `c`.
     * @param c
     */
    static cos(c: [number, number]) {
        const [re, im] = c;
        return [Maths.cos(re) * Maths.cosh(im), -Maths.sin(re) * Maths.sinh(im)] as [number, number];
    }
    /**
     * Returns the tangent of complex number `c`.
     * @param c
     */
    static tan(c: [number, number]) {
        // or return Complex.divide(Complex.sin(c), Complex.cos(c));
        const [re, im] = c;
        const d = Maths.cos(2 * re) + Maths.cosh(2 * im);
        return [Maths.sin(2 * re) / d, Maths.sinh(2 * im) / d];
    }
    /**
     * Returns the arcsine of complex number `c`.
     * @param c
     */
    static asin(c: [number, number]) {
        let s = Complex.sqrt(Complex.subtract([1, 0], Complex.multiply(c, c)));
        s = Complex.add(Complex.multiply(c, [0, 1]), s);
        return Complex.multiply([0, -1], Complex.log(s));
    }
    /**
     * Returns the arccosine of complex number `c`.
     * @param c
     */
    static acos(c: [number, number]) {
        let s = Complex.sqrt(Complex.subtract([1, 0], Complex.multiply(c, c)));
        s = Complex.add(c, Complex.multiply([0, 1], s));
        return Complex.multiply([0, -1], Complex.log(s));
    }
    /**
     * Returns the arctangent of complex number `c`.
     * @param c
     */
    static atan(c: [number, number]) {
        let s = Complex.log(Complex.divide(Complex.subtract([0, 1], c), Complex.add([0, 1], c)));
        return Complex.multiply(s, [0, -0.5]);
    }
    /**
     * Returns the hyperbolic sine of complex number `c`.
     * @param c
     */
    static sinh(c: [number, number]) {
        const [re, im] = c;
        return [Maths.sinh(re) * Maths.cos(im), Maths.cosh(re) * Maths.sin(im)] as [number, number];
    }
    /**
     * Returns the hyperbolic cosine of complex number `c`.
     * @param c
     */
    static cosh(c: [number, number]) {
        const [re, im] = c;
        return [Maths.cosh(re) * Maths.cos(im), Maths.sinh(re) * Maths.sin(im)] as [number, number];
    }
    /**
     * Returns the hyperbolic tangent of complex number `c`.
     * @param c
     */
    static tanh(c: [number, number]) {
        // or return Complex.divide(Complex.sinh(c), Complex.cosh(c));
        const [re, im] = c;
        const d = Maths.cosh(2 * re) + Maths.cos(2 * im);
        return [Maths.sinh(2 * re) / d, Maths.sin(2 * im) / d];
    }
    /**
     * Returns the hyperbolic arcsine of complex number `c`.
     * @param c
     */
    static asinh(c: [number, number]) {
        let s = Complex.sqrt(Complex.add([1, 0], Complex.multiply(c, c)));
        return Complex.log(Complex.add(c, s));
    }
    /**
     * Returns the hyperbolic arccosine of complex number `c`.
     * @param c
     */
    static acosh(c: [number, number]) {
        let s = Complex.sqrt(Complex.add([-1, 0], Complex.multiply(c, c)));
        return Complex.log(Complex.add(c, s));
    }
    /**
     * Returns the hyperbolic arctangent of complex number `c`.
     * @param c
     */
    static atanh(c: [number, number]) {
        let s = Complex.log(Complex.divide(Complex.add([1, 0], c), Complex.subtract([1, 0], c)));
        return Complex.multiply(s, [0.5, 0]);
    }
    // #endregion
}

export default Complex;
