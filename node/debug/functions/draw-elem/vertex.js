"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_draw_1 = require("flo-draw");
/** @hidden */
function vertex(g, cpNode, visible = true, displayDelay) {
    let visibleClass = visible ? '' : ' invisible';
    let circle = cpNode.cp.circle;
    const THIN = 'thin20';
    let cps = cpNode.getCpNodesOnCircle();
    console.log(cps);
    let $svgs = [];
    let $circle = flo_draw_1.drawFs.circle(g, circle, 'red ' + THIN + ' nofill ' + visibleClass, displayDelay);
    let $crossHair = flo_draw_1.drawFs.crossHair(g, circle.center, 'red ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
    $svgs = [...$circle, ...$crossHair];
    for (let i = 0; i < cps.length; i++) {
        let cp = cps[i];
        let edgeCircle = cp.next.cp.circle;
        let $circle = flo_draw_1.drawFs.circle(g, edgeCircle, 'pink ' + THIN + ' nofill ' + visibleClass, displayDelay);
        let $crossHair = flo_draw_1.drawFs.crossHair(g, edgeCircle.center, 'pink ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
        $svgs.push(...$circle, ...$crossHair);
        let p1 = circle.center;
        let p2 = edgeCircle.center;
        let thin = i === 0 ? 'thin10' : (i === 1 ? 'thin20' : 'thin35');
        let $line = flo_draw_1.drawFs.line(g, [p1, p2], 'yellow ' + thin + ' nofill ' + visibleClass, displayDelay);
        $svgs.push(...$line);
    }
    return $svgs;
}
exports.vertex = vertex;
//# sourceMappingURL=vertex.js.map