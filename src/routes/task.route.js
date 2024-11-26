import { Router } from "express";
import { create_task, getAll } from "../controllers/task.controller.js";

const route = Router();

route.post('/create',create_task)
route.get('/getAll',getAll)

export default route;
