import { app } from "./app.js";
import connectDb from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and running at PORT ${PORT}`);
  });
});
