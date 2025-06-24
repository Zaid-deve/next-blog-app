import jwt from 'jsonwebtoken';

export const jwtHash = async (data: any, expiresIn?: 3600) => {
    try {
        const token = await jwt.sign(data, process.env.JWT_SECRET as string, {
            expiresIn
        });
        return token;
    } catch (e: any) { }
    return null;
}

export const jwtVerify = async (data: string) => {
    try {
        const decoded = await jwt.verify(data, process.env.JWT_SECRET as string);
        return decoded;
    } catch (e: any) { }
    return null;
}