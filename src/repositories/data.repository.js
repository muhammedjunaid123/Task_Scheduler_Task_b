import Data_model from "../models/data.model.js";

const create_data_repo = (due_date) => {
  due_date = new Date(due_date);
  return new Data_model({
    due_date: due_date,
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
export { create_data_repo, update_repo, deleteData_repo };
