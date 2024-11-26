import Task_model from "../models/task.model.js";
import { create_data_repo } from "./data.repository.js";

const create_task_repo = async (data) => {
  const { name, pattern, due_date } = data;
  const Data = await create_data_repo(due_date);

  let Task = new Task_model({
    name: name,
    pattern: pattern,
    datas: [Data._id],
  });
  Task = await Task.save();
  Data.foreign_id = Task._id;
  return Data.save();
};

export { create_task_repo };
