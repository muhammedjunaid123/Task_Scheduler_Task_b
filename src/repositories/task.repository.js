import mongoose, { now } from "mongoose";
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

const getAll_repo = (date, search) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  return Task_model.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: ".*" + search + ".*", $options: "i" } },
          { pattern: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      },
    },
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
const task_detail_repo = (id) => {
  id = new mongoose.Types.ObjectId(id);
  return Task_model.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: "datas",
        localField: "datas",
        foreignField: "_id",
        as: "datas",
      },
    },
  ]);
};
const deleteTask_repo = (id) => {
  return Task_model.deleteOne({ _id: id });
};
const next_occurrence_repo = (id) => {
  id = new mongoose.Types.ObjectId(id);
  return Task_model.aggregate([
    {
      $match: {
        _id: id,
      },
    },
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
          $sortArray: {
            input: "$datas",
            sortBy: { due_date: -1 },
          },
        },
      },
    },

    {
      $project: {
        due_date: { $arrayElemAt: ["$datas.due_date", 0] },
        pattern: "$pattern",
      },
    },
  ]);
};
const recreate_repo = async () => {
  let today = new Date();
  return await Task_model.aggregate([
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
          $slice: [
            {
              $sortArray: {
                input: "$datas",
                sortBy: { due_date: -1 },
              },
            },
            1,
          ],
        },
      },
    },
    {
      $addFields: {
        datas: {
          $filter: {
            input: "$datas",
            as: "data",
            cond: { $lte: ["$$data.due_date", today] },
          },
        },
      },
    },
    {
      $match: {
        datas: { $ne: [] },
      },
    },
    {
      $project: {
        create: { $arrayElemAt: ["$datas.create_date", 0] },
        due_date: { $arrayElemAt: ["$datas.due_date", 0] },
        pattern: "$pattern",
      },
    },
  ]);
};
const update_task_recreate_repo = async (id, due_date, create_date) => {
  const Data = await create_data_repo(due_date, create_date);
  await Task_model.findByIdAndUpdate(
    { _id: id },
    { $push: { datas: Data._id } }
  );
  Data.foreign_id = id;
  return Data.save();
};
const reminder_task_repo = async () => {
  let today = new Date();
  let after = new Date(today.getTime() + 30 * 60000);
  return await Task_model.aggregate([
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
          $slice: [
            {
              $sortArray: {
                input: "$datas",
                sortBy: { due_date: -1 },
              },
            },
            1,
          ],
        },
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
                {
                  $lte: ["$$data.due_date", after],
                },
                { $gte: ["$$data.due_date", today] },
              ],
            },
          },
        },
      },
    },
    {
      $match: {
        datas: { $ne: [] },
      },
    },
    {
      $match: {
        "datas.email_send": false,
      },
    },
  ]);
};

export {
  create_task_repo,
  getAll_repo,
  deleteTask_repo,
  task_detail_repo,
  next_occurrence_repo,
  recreate_repo,
  update_task_recreate_repo,
  reminder_task_repo,
};
