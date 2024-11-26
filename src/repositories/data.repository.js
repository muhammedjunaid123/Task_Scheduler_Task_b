import Data_model from "../models/data.model.js";

const create_data_repo = (due_date) => {
  due_date = new Date(due_date);
  return new Data_model({
    due_date: due_date,
  });
};

const update_repo = (data) => {
  const { id, status } = data;
return  Data_model.findByIdAndUpdate({_id:id},{$set:{status:status}})
 
};
export { create_data_repo,update_repo };
