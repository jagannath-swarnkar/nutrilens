export interface IUser {
    name: string;
    email: string;
    password: string;
    status?: "active" | "inactive";
    emailVerified?: boolean;
    createdAt?: Date;
}

export interface IFood {
    name: string;
    category: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    servingSize?: number;
    servingUnit?: string;
    userId?: string;
    createdAt?: Date;
}

export interface IMealLog {
    foodId: string;
    quantity: number;
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    logDate: Date;
    userId?: string;
    createdAt?: Date;
}

export interface IAggregationResponse {
    [key: string]: any;
}
