"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp_node_1 = require("./cp-node");
const get_branches_1 = require("./get-branches");
const flo_bezier3_1 = require("flo-bezier3");
const get_curve_to_next_1 = require("./get-curve-to-next");
const get_curve_between_1 = require("./get-curve/get-curve-between");
const mat_1 = require("./mat");
const create_new_cp_tree_1 = require("./mat/create-new-cp-tree");
/**
 * Simplifies the given MAT by replacing the piecewise quad beziers composing
 * the MAT with fewer ones to within a given tolerance.
 * @param cpNode A representation of the MAT
 * @param anlgeTolerance Tolerance given as the degrees difference of the unit
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required - defaults to 15.
 * @param hausdorffTolerance The approximate maximum Hausdorff Distance tolerance -
 * defaults to 0.1
 * @param hausdorffSpacing The spacing on the curves used to calculate the Hausdorff
 * Distance - defaults to 1
 */
function simplifyMat(mat, anlgeTolerance = 15, hausdorffTolerance = 1e-1, hausdorffSpacing = 1e0) {
    let cpNode = mat.cpNode;
    let simpleMap = new Map();
    // Start from a leaf
    while (!cpNode.isTerminating()) {
        cpNode = cpNode.next;
    }
    let branches = get_branches_1.getBranches(cpNode, anlgeTolerance);
    let canDeletes = [];
    for (let k = 0; k < branches.length; k++) {
        let branch = branches[k];
        // Try to remove some
        let j = 0;
        while (j < branch.length) {
            let i = j;
            while (true) {
                j++;
                if (j === branch.length) {
                    break;
                }
                let hd = getTotalHausdorffDistance(i, j, branch, hausdorffSpacing);
                if (hd > hausdorffTolerance) {
                    break;
                }
                else {
                    canDeletes.push(branch[j]);
                }
            }
            if (i + 1 === j) {
                // no simplification occured
            }
            else {
                let branStart = branch[i];
                let branEnd = branch[j - 1];
                let medial = flo_bezier3_1.toCubic(get_curve_between_1.getCurveBetween(branStart, branEnd.next));
                let rev = medial.slice().reverse();
                let curCpNode = branStart;
                let prevT = 0;
                while (curCpNode !== branEnd) {
                    let t = flo_bezier3_1.closestPointOnBezier(medial, curCpNode.next.cp.circle.center).t;
                    simpleMap.set(curCpNode, { ps: medial, ts: [prevT, t] });
                    let oppositeCpNode = curCpNode.nextOnCircle.prev;
                    simpleMap.set(oppositeCpNode, { ps: rev, ts: [1 - t, 1 - prevT] });
                    prevT = t;
                    curCpNode = curCpNode.next;
                }
                simpleMap.set(curCpNode, { ps: medial, ts: [prevT, 1] });
                let oppositeCpNode = curCpNode.nextOnCircle.prev;
                simpleMap.set(oppositeCpNode, { ps: rev, ts: [0, 1 - prevT] });
            }
        }
    }
    for (let cpNode of canDeletes) {
        let isTerminating = cpNode.isTerminating();
        let onCircleCount = cpNode.getCpNodesOnCircle().length;
        if (isTerminating || onCircleCount !== 2) {
            continue;
        }
        cp_node_1.CpNode.remove(cpNode);
    }
    return new mat_1.Mat(cpNode, create_new_cp_tree_1.createNewCpTree(cpNode));
}
exports.simplifyMat = simplifyMat;
function getTotalHausdorffDistance(i, j, branch, hausdorffSpacing) {
    let hds = [];
    let longCurve = get_curve_between_1.getCurveBetween(branch[i], branch[j].next);
    for (let m = i; m < j + 1; m++) {
        hds.push(flo_bezier3_1.hausdorffDistance(get_curve_to_next_1.getCurveToNext(branch[m]), longCurve, hausdorffSpacing));
    }
    return Math.max(...hds);
}
//# sourceMappingURL=simplify-mat.js.map