import { Router } from "express";
import { create_task } from "../controllers/task.controller.js";

const route = Router();

route.post('/create',create_task)

export default route;
