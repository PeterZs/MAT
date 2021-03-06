"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_memoize_1 = require("flo-memoize");
const flo_vector2d_1 = require("flo-vector2d");
const corner_1 = require("./mat/corner");
const flo_bezier3_1 = require("flo-bezier3");
/**
 * Represents a bezier curve on the shape boundary / loop.
 */
class Curve {
    /**
     * Primarily for internal use.
     * @param loop The closed loop of bezier curves representing the shape
     * boundary this curve belongs to.
     * @param ps The bezier control points.
     * @param prev The previous curve (when going in a negative direction around
     * the shape boundary, i.e. clockwise for the outer shape and anti-clockwise
     * for the holes (if any)).
     * @param next The next curve (when going in a positive direction around
     * the shape boundary, i.e. anti-clockwise for the outer shape and clockwise
     * for the holes (if any)).
     * @param idx The curve's ordered index in the loop. This imposes a cycling
     * ordering of the curves in the loop.
     */
    constructor(loop, ps, prev, next, idx) {
        this.loop = loop;
        this.ps = ps;
        this.prev = prev;
        this.next = next;
        this.idx = idx;
    }
    /**
     * @hidden
     * Returns information about the corner created at the end of this curve
     * (at t === 1) and the start of the next curve (at t === 0).
     * @param curve The relevant [[Curve]].
     */
    static getCornerAtEnd(curve) {
        return getCornerAtEnd(curve);
    }
}
exports.Curve = Curve;
/**
 * @hidden
 * Angle in degrees to radians.
 */
const DEGREES = {
    //'0'    : 0.0000,
    0.25: 0.0050,
    1: 0.0167,
    4: 0.0698,
    16: 0.2756,
};
/** @hidden */
//const DEGREE_LIMIT = DEGREES[1];
const DEGREE_LIMIT = DEGREES[4];
//const DEGREE_LIMIT = DEGREES[16]; 
/**
 * @hidden
 * Returns a new corner with properties.
 *
 * PRECONDITION: The beziers has control points with max bit-length of 26 and
 * aligned to a 'grid' to have the same exponent. This is so the vectors between
 * control points can be calculated exactly without resorting to adaptive
 * infinite precision floating point operations.
 *
 * @param psI The incoming bezier that ends in the corner
 * @param psO The outgoing bezier that starts at the corner
 */
function getCorner(psI, psO) {
    // getInterfaceCcw must return a number !== 0 if psI and psO are not the
    // same as seen as a curve extension with t ∈ [-∞,+∞]
    let ccw = flo_bezier3_1.getInterfaceCcw(psI, psO);
    let isSharp = ccw < 0;
    let isDull = ccw > 0;
    // Find (non-normalized) tangent of curve.ps at t === 1
    let p0E = psI[psI.length - 2];
    let p1E = psI[psI.length - 1];
    let xE = p1E[0] - p0E[0];
    let yE = p1E[1] - p0E[1];
    let tangentAtEnd = [xE, yE];
    // Find (non-normalized) tangent of curve.next.ps at t === 0
    let p0S = psO[0];
    let p1S = psO[1];
    let xS = p1S[0] - p0S[0];
    let yS = p1S[1] - p0S[1];
    let tangentAtStart = [xS, yS];
    // These use square root and are thus not exact
    let tangents_ = [
        flo_vector2d_1.toUnitVector(tangentAtEnd),
        flo_vector2d_1.toUnitVector(tangentAtStart),
    ];
    // The cross calculated below should be exact due to beziers having been
    // normalized!
    let crossTangents = flo_vector2d_1.cross(tangents_[0], tangents_[1]);
    let isQuiteSharp;
    let isQuiteDull;
    let dotTangents = flo_vector2d_1.dot(tangentAtEnd, tangentAtStart);
    if (dotTangents > 0) {
        // Curves go in same direction
        isQuiteSharp = crossTangents < -DEGREE_LIMIT;
        isQuiteDull = crossTangents > +DEGREE_LIMIT;
    }
    else {
        isQuiteSharp = isSharp;
        isQuiteDull = isDull;
    }
    return new corner_1.Corner(tangents_, crossTangents, isSharp, isDull, isQuiteSharp, isQuiteDull);
}
exports.getCorner = getCorner;
/**
 * @hidden
 * Returns information about the corner created at the end of this curve
 * (at t === 1) and the start of the next curve (at t === 0).
 */
let getCornerAtEnd = flo_memoize_1.memoize(function (curve) {
    let psE = curve.ps;
    let psS = curve.next.ps;
    return getCorner(psE, psS);
});
//# sourceMappingURL=curve.js.map