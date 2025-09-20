import express from "express";
import notFoundHandler from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

//import router
import userRouter from "./routes/user.router.js"

const app = express();

//middleware
app.use(cookieParser()); //Ensure this is added before authentication-related routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/v/users", userRouter);


// Error Handling
app.use(errorHandler);
app.use(notFoundHandler);

export { app };
