import Data_model from "../models/data.model.js";
import Task_model from "../models/task.model.js";

const create_data_repo = (due_date, create_date) => {
  due_date = new Date(due_date);
  return new Data_model({
    due_date: due_date,
    create_date: create_date ? create_date : Date.now(),
  });
};

const update_repo = (data) => {
  const { id, status } = data;
  return Data_model.findByIdAndUpdate(
    { _id: id },
    { $set: { status: status, completed_date: Date.now() } }
  );
};
const deleteData_repo = (id) => {
  return Data_model.deleteMany({ foreign_id: id });
};
const update_email_repo = async (id) => {
  await Data_model.findByIdAndUpdate(
    { _id: id },
    { $set: { email_send: true } }
  );
};
export { create_data_repo, update_repo, deleteData_repo, update_email_repo };
