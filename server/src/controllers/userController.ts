import { Response } from "express";
import ApiError from "../utils/api-error";
import apiResponse from "../utils/api-response";
import { findUserById } from "../services/repositories/user";
import { AuthenticatedRequest } from "../types/index";

export const me = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      const error = new ApiError(401, "Unauthorized");
      return res.status(error.statusCode).json(error);
    }

    const user = await findUserById(req.user.id);

    if (!user) {
      const error = new ApiError(404, "User not found");
      return res.status(error.statusCode).json(error);
    }

    const response = new apiResponse(200, "User profile fetched successfully", user);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    const apiError = new ApiError(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
    return res.status(apiError.statusCode).json(apiError);
  }
};