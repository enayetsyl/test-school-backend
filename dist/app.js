"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
// import { errorHandler } from './middleware/error.middleware';
const routes_1 = __importDefault(require("./routes"));
const respond_middleware_1 = require("./middleware/respond.middleware");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(respond_middleware_1.respondMiddleware);
// Routes
app.use('/api/v1', routes_1.default);
// Error handler
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
