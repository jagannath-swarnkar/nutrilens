import Joi from "joi";
import { loginService, signupService, getProfileService } from "./auth.service";

export const login = async (_req: any, _res: any) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    const { error, value } = schema.validate(_req.body);
    if (error) return _res.status(400).json({ message: error.message, code: 400 });
    try {
        const result = await loginService(value.email, value.password);
        if (result.error) return _res.status(400).json({ message: result.error, code: 400 });
        return _res.status(200).json({ message: "Login successful!", data: result });
    } catch (err: any) {
        return _res.status(500).json({ message: err.message || "Internal Server Error!", code: 500 });
    }
};

export const signup = async (_req: any, _res: any) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    let payload: any;
    try {
        payload = await schema.validateAsync(_req.body);
    } catch (err: any) {
        return _res.status(400).json({ message: err.message });
    }
    try {
        const result = await signupService(payload.name, payload.email, payload.password);
        if (result.error) return _res.status(400).json({ message: result.error });
        return _res.status(201).json({ message: "User registered successfully!", data: result });
    } catch (err: any) {
        return _res.status(500).json({ message: err.message || "Internal Server Error!", code: 500 });
    }
};

export const getProfile = async (_req: any, _res: any) => {
    try {
        const user = await getProfileService(_req.tokenData._id);
        return _res.status(200).json(user);
    } catch (err: any) {
        return _res.status(500).json({ message: err.message || "Internal Server Error!", code: 500 });
    }
};
