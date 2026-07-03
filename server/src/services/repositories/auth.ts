import {prisma} from "../../prisma/client";
import bcrypt from "bcryptjs";
import { generateTokens, verifyRefreshToken } from "../../utils/jwt";

export const createNewUser = async ({name, email, password} : {name: string, email: string, password: string}) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password
        }
    });
    return user;
};

export const loginUser = async ({email, password} : {email: string, password: string}) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user || !user.password) {
        throw new Error("Invalid email or password");
    }
   
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const { accessToken, refreshToken } = generateTokens({
        id: user.id,
        email: user.email,
    });

    await prisma.user.update({
    where:{id:user.id},
    data:{
        refreshToken
    }
    })

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        accessToken,
        refreshToken,
    };
};

export const refreshTokenUser = async (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
        throw new Error("Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id,
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
        id: user.id,
        email: user.email,
    });

    await prisma.user.update({
    where:{id:user.id},
    data:{
        refreshToken: newRefreshToken
    }
    })

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        accessToken,
        refreshToken: newRefreshToken,
    };
};

export const logoutUser = async ({ refreshToken} : {refreshToken : string} ) => {
     const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
        throw new Error("Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id,
        }
    });

    if (!user) {
        throw new Error("User not found");
    }
    await prisma.user.update({
    where:{id : user.id },
    data:{
      refreshToken:null
   }
})
}