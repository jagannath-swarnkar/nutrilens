import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import routes from "./routes/index";

require("dotenv").config();
require("./connections/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
// import routes

// Swagger docs
app.use("/docs", ...([...swaggerUi.serve, swaggerUi.setup(swaggerSpec)] as any[]));
app.use("/api", routes);

// Health check
app.get("/", (_req, _res) => {
	_res.status(200).json({
		message: "Welcome to NutriLens API",
		version: "1.0.0",
		docs: "/docs"
	});
});

export default app;
