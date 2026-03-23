export const success = (data: any, message = "Success") => ({ message, data });
export const errorResponse = (message: string, code: number) => ({ message, code });
