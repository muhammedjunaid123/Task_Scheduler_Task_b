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

const getAll_repo = (date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  return Task_model.aggregate([
    {
      $lookup: {
        from: "datas",
        localField: "datas",
        foreignField: "_id",
        as: "datas",
      },
    },
    {
      $addFields: {
        datas: {
          $filter: {
            input: "$datas",
            as: "data",
            cond: {
              $and: [
                { $gte: ["$$data.due_date", startDate] },
                { $lte: ["$$data.due_date", endDate] },
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        datas: {
          $sortArray: {
            input: "$datas",
            sortBy: { due_date: -1 },
          },
        },
      },
    },
    {
      $addFields: {
        datas: {
          $slice: ["$datas", 1],
        },
      },
    },
    {
      $match: {
        $expr: { $gt: [{ $size: "$datas" }, 0] },
      },
    },
  ]);
};

export { create_task_repo, getAll_repo };
