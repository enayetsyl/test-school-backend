"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const DEFAULT_ROUNDS = 10;
// Lazy-load bcrypt with fallback to bcryptjs (no top-level await)
const libPromise = (async () => {
    try {
        const mod = await Promise.resolve().then(() => __importStar(require("bcrypt")));
        return mod;
    }
    catch {
        try {
            const mod = await Promise.resolve().then(() => __importStar(require("bcryptjs")));
            return mod;
        }
        catch {
            throw new Error("No bcrypt/bcryptjs available. Please install at least one.");
        }
    }
})();
async function hashPassword(plain, rounds = DEFAULT_ROUNDS) {
    const lib = await libPromise;
    return lib.hash(plain, rounds);
}
async function comparePassword(plain, hash) {
    const lib = await libPromise;
    return lib.compare(plain, hash);
}
