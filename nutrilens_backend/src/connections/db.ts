import mongoose from "mongoose";
require("dotenv").config();

console.info("connecting to db..............");
mongoose
    .connect(process.env.DB_CONNECTION as string, {})
    .then(() => {
        console.info("Database connected successfully!");
    })
    .catch((error) => {
        console.error("Error connecting to database: ", error.message);
    });
