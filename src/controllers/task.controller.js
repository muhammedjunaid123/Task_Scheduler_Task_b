import {
  create_task_repo,
  getAll_repo,
} from "../repositories/task.repository.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const create_task = asyncHandler(async (req, res) => {
  let result = await create_task_repo(req.body);
  if (result) {
    res.json(new apiResponse(201, [], "task created successfully"));
  }
});
const getAll = asyncHandler(async (req, res) => {
  const result = await getAll_repo(req.query.date);   
  if (result) {
    res.json(new apiResponse(200, result));
  }
});

export { create_task, getAll };
