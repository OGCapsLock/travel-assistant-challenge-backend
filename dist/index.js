"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUser = exports.newUser = void 0;
var client_1 = require("@prisma/client");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var dotenv_1 = __importDefault(require("dotenv"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var body_parser_1 = __importDefault(require("body-parser"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var app = (0, express_1.default)();
//Midlewares
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
var port = Number(process.env.PORT) || 5000;
var SECRET_KEY = "$2b$08$niErDh//kmlAMFVA1Y0/iOiF/Q5qjmq6dlyN0A7/zaU3hVRNMsfNy";
var authenticateToken = function (req, res, next) {
    var token = req.header("Authorization");
    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, function (err, user) {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        res.locals.user = user; // Armazena o usuário autenticado em res.locals
        next();
    });
};
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, found, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                user = {
                    userName: username,
                    password: password,
                };
                return [4 /*yield*/, fetchUser(user)];
            case 1:
                found = _b.sent();
                if (found) {
                    token = jsonwebtoken_1.default.sign({ id: found.id, username: found.userName }, SECRET_KEY, { expiresIn: "1h" });
                    return [2 /*return*/, res.json({ token: token })];
                }
                res.status(401).json({ message: "Credenciais inválidas." });
                return [2 /*return*/];
        }
    });
}); });
app.get("/protected", authenticateToken, function (req, res) {
    res.json({ message: "Esta é uma rota protegida. Você está autenticado!" });
});
var userRouter = express_1.default.Router();
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send("Hello World!");
        return [2 /*return*/];
    });
}); });
var prisma = new client_1.PrismaClient();
function newUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user
                        .create({
                        data: __assign({}, user),
                    })
                        .then(function () {
                        return true;
                    })
                        .catch(function () {
                        return false;
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.newUser = newUser;
function fetchUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user
                        .findFirstOrThrow({
                        where: __assign({}, user),
                    })
                        .then(function (data) {
                        return data;
                    })
                        .catch(function () {
                        console.log("Usuario nao encontrado");
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.fetchUser = fetchUser;
app.listen(port, function () { return console.log("Servidor a correr na porta " + port); });
exports.default = app;
