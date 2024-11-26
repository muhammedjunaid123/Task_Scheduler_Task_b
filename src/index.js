import app from "./app.js";
import connectDB from "./db/index.js";

connectDB().then(() => {
  app.listen(process.env.port || 3001, () => {
    console.log(`server is live .... on port${process.env.port || 3001}`);
  });
});
