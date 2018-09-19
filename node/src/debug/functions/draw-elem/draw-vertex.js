"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawVertex(cpNode, visible = true, displayDelay) {
    let visibleClass = visible ? '' : ' invisible';
    let circle = cpNode.cp.circle;
    let draw = _debug_.fs.draw;
    const THIN = 'thin20';
    draw.circle(circle, 'red ' + THIN + ' nofill ' + visibleClass, displayDelay);
    draw.crossHair(circle.center, 'red ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
    let cps = cpNode.getCps();
    console.log(cps);
    for (let i = 0; i < cps.length; i++) {
        let cp = cps[i];
        let edgeCircle = cp.next.cp.circle;
        draw.circle(edgeCircle, 'pink ' + THIN + ' nofill ' + visibleClass, displayDelay);
        draw.crossHair(edgeCircle.center, 'pink ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
        let p1 = circle.center;
        let p2 = edgeCircle.center;
        let thin = i === 0 ? 'thin10' : (i === 1 ? 'thin20' : 'thin35');
        draw.line([p1, p2], 'yellow ' + thin + ' nofill ' + visibleClass, displayDelay);
    }
}
exports.drawVertex = drawVertex;