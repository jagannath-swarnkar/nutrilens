import app from "./app";

const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
    console.log(`NutriLens server is running on port: ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/docs`);
});
