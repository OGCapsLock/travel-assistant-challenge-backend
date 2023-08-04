import { PrismaClient } from "@prisma/client";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
const app = express();
//Midlewares
dotenv.config();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = Number(process.env.PORT) || 5000;
import bcrypt from "bcrypt";
const SECRET_KEY =
  "$2b$08$niErDh//kmlAMFVA1Y0/iOiF/Q5qjmq6dlyN0A7/zaU3hVRNMsfNy";
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    res.locals.user = user; // Armazena o usuário autenticado em res.locals
    next();
  });
};
app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = {
    userName: username,
    password: password,
  };
  const found = await fetchUser(user);
  if (found) {
    const token = jwt.sign(
      { id: found?.id, username: found?.userName },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: "Credenciais inválidas." });
});
app.post("/user", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = {
    userName: username,
    password: password,
  };
  console.log(user, "user");

  const found = await fetchUser(user);
  if (found) {
    console.log(found);
    return res.status(403).json({ status: 403, message: "User exists" });
  }
  const data = await newUser(user);
  if (!data) {
    console.log(data);
    return res
      .status(400)
      .json({ status: 400, message: "Algum valor nao foi especificado" });
  }
  res.status(201).json({ message: "User criado", id: data?.id });
});

app.get("/protected", authenticateToken, (req: Request, res: Response) => {
  res.json({ message: "Esta é uma rota protegida. Você está autenticado!" });
});

const userRouter = express.Router();

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

const prisma = new PrismaClient();

export async function newUser(user: { userName: string; password: string }) {
  return await prisma.user
    .create({
      data: { ...user },
    })
    .then((data) => {
      return data;
    })
    .catch(() => {
      console.log("Erro ao criar user");
    });
}
export async function fetchUser(user: { userName: string; password: string }) {
  return await prisma.user
    .findMany({
      where: {
        userName: user.userName,
      },
      take: 1,
    })
    .then((data) => {
      return data?.[0];
    })
    .catch(() => {
      console.log("Usuario nao encontrado");
    });
}

app.listen(port, () => console.log("Servidor a correr na porta " + port));

export default app;
