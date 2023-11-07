"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMHI = exports.smhiSchema = void 0;
const mongoose_1 = require("mongoose");
// Create a Schema corresponding to the document interface.
exports.smhiSchema = new mongoose_1.Schema({
    test: { type: String, required: true },
});
// Create a Model.
exports.SMHI = (0, mongoose_1.model)('SMHI', exports.smhiSchema);
