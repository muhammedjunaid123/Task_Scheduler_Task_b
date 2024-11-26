import { Router } from "express";
import { create_task, deleteTask, getAll, update } from "../controllers/task.controller.js";

const route = Router();

route.post("/create", create_task);
route.get("/getAll", getAll);
route.put("/update", update);
route.delete("/delete", deleteTask);

export default route;
