import { create_task_repo } from "../repositories/task.repository.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const create_task = asyncHandler(async (req, res) => {
    console.log(req.body);
    
  let result = await create_task_repo(req.body);
  if (result) {
    res.json(new apiResponse(201, [], "task created successfully"));
  }
});

export { create_task };
