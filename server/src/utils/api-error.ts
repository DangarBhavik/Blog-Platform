class ApiError extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            success: false
        };
    }
}

export default ApiError;