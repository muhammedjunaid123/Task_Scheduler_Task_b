import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
dotenv.config({
  path: "./.env",
});
var corsOptions = {
  origin: process.env.domain,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(errorHandler);
export default app;
