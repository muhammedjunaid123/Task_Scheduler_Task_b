import { Router } from "express";
import { create_task, deleteTask, getAll, next_occurrence, task_detail, update } from "../controllers/task.controller.js";

const route = Router();

route.post("/create", create_task);
route.get("/getAll", getAll);
route.put("/update", update);
route.delete("/delete", deleteTask);
route.get("/task_detail", task_detail);
route.get("/next_occurrence", next_occurrence);

export default route;
