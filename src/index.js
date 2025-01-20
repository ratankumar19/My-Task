"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movies_1 = __importDefault(require("./routes/movies"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' }); // Load environment variables from .env
// console.log('TMDB_TOKEN:', process.env.TMDB_BEARER_TOKEN);
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use('/movies', movies_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
