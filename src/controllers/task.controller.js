import {
  deleteData_repo,
  update_repo,
} from "../repositories/data.repository.js";
import {
  create_task_repo,
  deleteTask_repo,
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
const update = asyncHandler(async (req, res) => {
  const result = await update_repo(req.body);
  if (result) {
    res.json(new apiResponse(200, [], "task updated successfully"));
  }
});
const deleteTask = asyncHandler(async (req, res) => {
  await deleteTask_repo(req.query.id);
  const result = await deleteData_repo(req.query.id);
  if (result) {
    res.json(new apiResponse(200, [], "task deleted  successfully"));
  }
});

export { create_task, getAll, update, deleteTask };
