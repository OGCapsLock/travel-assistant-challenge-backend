"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUser = exports.newUser = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
//Midlewares
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const port = Number(process.env.PORT) || 5000;
const SECRET_KEY = "$2b$08$niErDh//kmlAMFVA1Y0/iOiF/Q5qjmq6dlyN0A7/zaU3hVRNMsfNy";
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        res.locals.user = user; // Armazena o usuário autenticado em res.locals
        next();
    });
};
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = {
        userName: username,
        password: password,
    };
    const found = yield fetchUser(user);
    if (found) {
        const token = jsonwebtoken_1.default.sign({ id: found.id, username: found.userName }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token });
    }
    res.status(401).json({ message: "Credenciais inválidas." });
}));
app.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "Esta é uma rota protegida. Você está autenticado!" });
});
const userRouter = express_1.default.Router();
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hello World!");
}));
const prisma = new client_1.PrismaClient();
function newUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user
            .create({
            data: Object.assign({}, user),
        })
            .then(() => {
            return true;
        })
            .catch(() => {
            return false;
        });
    });
}
exports.newUser = newUser;
function fetchUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user
            .findFirstOrThrow({
            where: Object.assign({}, user),
        })
            .then((data) => {
            return data;
        })
            .catch(() => {
            console.log("Usuario nao encontrado");
        });
    });
}
exports.fetchUser = fetchUser;
app.listen(port, () => console.log("Servidor a correr na porta " + port));
exports.default = app;
//# sourceMappingURL=index.js.map