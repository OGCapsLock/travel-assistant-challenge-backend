import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const prisma = new PrismaClient();

export async function newUser(user:{userName:string,password:string}) {
  return await prisma.user
    .create({
      data: {...user},
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

const userRouter = express.Router();

app.listen(port, () => console.log("Servidor a correr na porta " + port));
