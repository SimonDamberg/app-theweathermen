"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const smhi_1 = __importDefault(require("./routes/smhi"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const cors = require('cors');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
const port = process.env.PORT;
const mongoString = process.env.DATABASE_URL;
mongoose_1.default.set('strictQuery', false);
mongoString && mongoose_1.default.connect(mongoString);
const database = mongoose_1.default.connection;
database.on('error', (error) => {
    console.log(error);
});
database.once('connected', () => {
    console.log('Database Connected');
});
app.use('/smhi', smhi_1.default);
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server!');
});
app.get('/health', (req, res) => {
    res.send({ status: 'OK' });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
