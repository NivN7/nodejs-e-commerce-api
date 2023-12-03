import { Response } from "express";
import jwt from "jsonwebtoken";

const createJWT = ({ payload }: { payload: any }): string | null => {
  const { JWT_SECRET, JWT_LIFETIME } = process.env;

  if (JWT_SECRET && JWT_LIFETIME) {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_LIFETIME,
    });
    return token;
  }

  return null;
};

const isTokenValid = ({ token }: { token: string }): any => {
  const { JWT_SECRET } = process.env;

  if (JWT_SECRET) {
    return jwt.verify(token, JWT_SECRET);
  }

  throw new Error("JWT_SECRET is not defined.");
};

const attachCookiesToResponse = ({
  res,
  user,
}: {
  res: Response;
  user: any;
}) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
