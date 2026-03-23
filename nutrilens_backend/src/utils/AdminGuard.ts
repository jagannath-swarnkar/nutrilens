export const AdminGuard = async (_req: any, _res: any, next: any) => {
    if (!_req.tokenData || _req.tokenData.role !== "admin") {
        return _res.status(403).json({ message: "Forbidden: Admin access required!", code: 403 });
    }
    next();
};
