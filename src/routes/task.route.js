import { Router } from "express";
import { create_task, getAll, update } from "../controllers/task.controller.js";

const route = Router();

route.post("/create", create_task);
route.get("/getAll", getAll);
route.put("/update", update);

export default route;
