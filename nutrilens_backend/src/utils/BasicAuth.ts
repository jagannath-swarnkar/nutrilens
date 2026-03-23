import atob from "atob";

export const BasicAuth = async (req: any, res: any, next: any) => {
    try {
        let token = "";
        if (!req.headers.authorization) {
            return res.status(401).send({
                message: "Unauthorized!",
                status: 401,
            });
        }
        if (req.headers.authorization.startsWith("Basic")) {
            token = req.headers.authorization.split(" ")[1];
        } else {
            token = req.headers.authorization;
        }
        const decoded = atob(token);
        const tokenData = {
            username: decoded.split(":")[0],
            password: decoded.split(":")[1],
        };
        if (
            tokenData.username !== process.env.BASIC_AUTH_USERNAME ||
            tokenData.password !== process.env.BASIC_AUTH_PASS
        ) {
            return res.status(401).json({
                message: "Unauthorized!",
                status: 401,
                error: "Invalid credentials",
            });
        }
        req.tokenData = tokenData;
        next();
    } catch (error) {
        console.log("BasicAuth error:", error);
        return res.status(401).json({
            message: "Unauthorized!",
            status: 401,
            error: "Invalid token",
        });
    }
};
