import express from 'express';
import ApiError from '../utils/api-error';
import bcrypt from 'bcryptjs';
import { createNewUser, loginUser, refreshTokenUser , logoutUser } from '../services/repositories/auth';
import apiResponse from '../utils/api-response';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        if (!email || !password) {
            const error = new ApiError(400, "Email and password are required");
            return res.status(error.statusCode).json(error);
        }

        if (password.length < 6) {
            const error = new ApiError(400, "Password must be at least 6 characters long");
            return res.status(error.statusCode).json(error);
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await createNewUser({ name, email, password: hashedPassword });

        const response = new apiResponse(201, "User registered successfully", user);
        return res.status(response.statusCode).json(response);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";  
        const apiError = new ApiError(500, errorMessage);
        return res.status(apiError.statusCode).json(apiError);
    }
}

export const login = async(req: express.Request, res: express.Response) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            const error = new ApiError(400, "Email and password are required");
            return res.status(error.statusCode).json(error);
        }

        const user = await loginUser({ email, password });

                res.cookie("accessToken", user.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });

                res.cookie("refreshToken", user.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });

        const response = new apiResponse(200, "User logged in successfully", user);
        return res.status(response.statusCode).json(response);
  
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";  
        const apiError = new ApiError(401, errorMessage);
        return res.status(apiError.statusCode).json(apiError);
    }
}

export const refreshToken = async (req: express.Request, res: express.Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            const error = new ApiError(401, "Refresh token is missing");
            return res.status(error.statusCode).json(error);
        }

        const result = await refreshTokenUser(refreshToken);

                res.cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });

                res.cookie("refreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });

        const response = new apiResponse(200, "Token refreshed successfully", result);
        return res.status(response.statusCode).json(response);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        const apiError = new ApiError(401, errorMessage);
        return res.status(apiError.statusCode).json(apiError);
    }
};

export const logout = async(req: express.Request, res: express.Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            const error = new ApiError(401, "Refresh token is missing");
            return res.status(error.statusCode).json(error);
        }
        
        const logout = await logoutUser({refreshToken })
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });
        const response = new apiResponse(200, "User logged out successfully", null);
        return res.status(response.statusCode).json(response);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        const apiError = new ApiError(500, errorMessage);
        return res.status(apiError.statusCode).json(apiError);
    }
};
