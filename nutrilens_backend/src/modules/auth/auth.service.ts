import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "./auth.model";

export const loginService = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email, emailVerified: true, status: "active" });
    if (!user) return { error: "Invalid email or password!" };
    const match = await bcrypt.compare(password, user.password as string);
    if (!match) return { error: "Invalid email or password!" };
    const tokenPayload: any = { email: user.email, userId: user._id, role: (user as any).role };
    const token = jwt.sign(tokenPayload, process.env.SECRETE_KEY as string, { expiresIn: 60 * 60 * 24 });
    return { token, email: user.email, userId: user._id, role: (user as any).role };
};

export const signupService = async (name: string, email: string, password: string) => {
    const existing = await UserModel.findOne({ email });
    if (existing) return { error: "Email already registered!" };
    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        name,
        email,
        password: hashed,
        status: "active",
        emailVerified: true,
        createdAt: new Date(),
    });
    return { userId: user._id, email: user.email };
};

export const getProfileService = async (userId: string) => {
    return UserModel.findById(userId, { password: 0, __v: 0 });
};
