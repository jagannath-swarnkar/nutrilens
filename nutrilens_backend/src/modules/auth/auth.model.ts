import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user", index: true },
    status: { type: String, default: "inactive", enum: ["active", "inactive"] },
    emailVerified: { type: Boolean, default: false },
    createdAt: { type: Date },
});

export default model("Users", UserSchema);
