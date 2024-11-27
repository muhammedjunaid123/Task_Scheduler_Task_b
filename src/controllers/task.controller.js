import nodemailer from "nodemailer";

import {
  deleteData_repo,
  update_email_repo,
  update_repo,
} from "../repositories/data.repository.js";
import {
  create_task_repo,
  deleteTask_repo,
  getAll_repo,
  next_occurrence_repo,
  recreate_repo,
  reminder_task_repo,
  task_detail_repo,
  update_task_recreate_repo,
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
  const result = await getAll_repo(req.query.date, req.query.search);
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
const task_detail = asyncHandler(async (req, res) => {
  let result = await task_detail_repo(req.query.id);
  if (result) {
    res.json(new apiResponse(200, result[0]));
  }
});
const next_occurrence = asyncHandler(async (req, res) => {
  const result = await next_occurrence_repo(req.query.id);
  let next = new Date(result[0]["due_date"]);
  if (result[0]["pattern"] == "daily") {
    next.setDate(next.getDate() + 1);
  } else if (result[0]["pattern"] == "weekly") {
    next.setDate(next.getDate() + 7);
  } else if (result[0]["pattern"] == "monthly") {
    next.setMonth(next.getMonth() + 1);
  }

  res.json(new apiResponse(200, next));
});

const recreate = async (req, res) => {
  try {
    let task = await recreate_repo();
    console.log(task);
    for (let t of task) {
      let due_date = new Date(t["due_date"]);
      let create_date = new Date(t["create"]);
      let diff = due_date - create_date;
      let next = new Date(t["due_date"]);

      if (t["pattern"] == "daily") {
        next.setDate(next.getDate() + 1);
      } else if (t["pattern"] == "weekly") {
        next.setDate(next.getDate() + 7);
      } else if (t["pattern"] == "monthly") {
        next.setMonth(next.getMonth() + 1);
      }
      due_date = new Date(next.getTime() + diff);
      await update_task_recreate_repo(t._id, due_date, next);
    }
  } catch (error) {
    console.log(error, "err");
  }
};
const email_send = async () => {
  try {
    let result = await reminder_task_repo();
    console.log(result, "result");

    for (let i = 0; i < result.length; i++) {
      console.log(result[i]);

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.DEV_MAIL,
          pass: process.env.DEV_PASS,
        },
      });

      const mailOption = {
        to: process.env.email,
        from: "task@gmail.com",
        subject: "task reminder",
        text: "task",
        html: `<table style="max-width: 600px; margin: 0 auto; padding: 20px;">
  <tr>
      <td style="text-align: center; background-color: #000; padding: 10px; color: #fff;">
          <h1>Task Reminder: last Minutes Left!</h1>
      </td>
  </tr>
  <tr>
      <td style="padding: 20px;">
          <p>Hello</p>
          <p>This is a reminder that your task is due in last minutes. Please make sure to complete it before the due time.</p>
          <p><strong>Task Name:</strong> ${result[i]["name"]}</p>
          <p><strong>Due Date:</strong> ${result[i]["datas"][0]["due_date"]}</p>
          <p>We encourage you to finish the task as soon as possible to stay on track with your schedule.</p>

          <p>Thank you for staying on top of your tasks!</p>
          <p>Best regards,<br>Jchatapp Team</p>
      </td>
  </tr>
  <tr>
      <td style="text-align: center; background-color: #000; padding: 10px; color: #fff;">
          <p>&copy; ${new Date().getFullYear()} taskTeam. All rights reserved.</p>
      </td>
  </tr>
</table>
`,
      };

      await transporter.sendMail(mailOption, async (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email has been sent:");
          await update_email_repo(result[i]["datas"][0]["_id"]);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export {
  create_task,
  getAll,
  update,
  deleteTask,
  task_detail,
  next_occurrence,
  recreate,
  email_send,
};
