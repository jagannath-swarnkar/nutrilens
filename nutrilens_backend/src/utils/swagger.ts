import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NutriLens API",
            version: "1.0.0",
            description: "NutriLens — Nutrition Tracking & Analysis REST API documentation",
        },
        servers: [
            { url: "http://localhost:" + (process.env.PORT || 8010), description: "Local" },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT token from /login response. Format: Bearer <token>",
                },
                BasicAuth: {
                    type: "http",
                    scheme: "basic",
                    description: "Base64 encoded username:password from env BASIC_AUTH_USERNAME / BASIC_AUTH_PASS",
                },
            },
            schemas: {
                Error400: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                },
                Error401: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        status: { type: "number", example: 401 },
                    },
                },
                Error500: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        code: { type: "number", example: 500 },
                    },
                },
                Food: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        category: { type: "string" },
                        calories: { type: "number" },
                        protein: { type: "number" },
                        carbs: { type: "number" },
                        fat: { type: "number" },
                        fiber: { type: "number", nullable: true },
                        servingSize: { type: "number", nullable: true },
                        servingUnit: { type: "string", nullable: true },
                        userId: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                MealLog: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        foodId: { type: "string" },
                        quantity: { type: "number" },
                        mealType: { type: "string", enum: ["breakfast", "lunch", "dinner", "snack"] },
                        logDate: { type: "string", format: "date-time" },
                        userId: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        status: { type: "string", enum: ["active", "inactive"] },
                        emailVerified: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    },
    apis: ["./src/modules/**/*.routes.ts", "./src/modules/**/*.controller.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
