"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapScoreToLevel = mapScoreToLevel;
exports.maxLevel = maxLevel;
/** Map percentage → awarded level for a given step (per spec). */
function mapScoreToLevel(step, scorePct) {
    const s = scorePct;
    if (step === 1) {
        if (s < 25)
            return { proceedNext: false }; // fail + lock
        if (s < 50)
            return { level: 'A1', proceedNext: false };
        if (s < 75)
            return { level: 'A2', proceedNext: false };
        return { level: 'A2', proceedNext: true };
    }
    if (step === 2) {
        if (s < 25)
            return { level: 'A2', proceedNext: false };
        if (s < 50)
            return { level: 'B1', proceedNext: false };
        if (s < 75)
            return { level: 'B2', proceedNext: false };
        return { level: 'B2', proceedNext: true };
    }
    // step 3
    if (s < 25)
        return { level: 'B2', proceedNext: false };
    if (s < 50)
        return { level: 'C1', proceedNext: false };
    return { level: 'C2', proceedNext: false };
}
/** Compare two levels and return the higher one. */
function maxLevel(a, b) {
    const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (!a)
        return b;
    if (!b)
        return a;
    return order.indexOf(a) >= order.indexOf(b) ? a : b;
}
