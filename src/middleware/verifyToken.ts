import { RequestHandler } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import * as userRepositories from "../repositories/userRepositories";

const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Token Invalid"
      });
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "JWT" || !token) {
      return res.status(401).json({
        success: false,
        message: "Token Invalid"
      });
    }

    jwt.verify(
      token,
      process.env.SECRET_AUTH ?? "",
      async (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err || !decoded || typeof decoded === "string") {
          return res.status(401).json({
            success: false,
            message: "Token Invalid"
          });
        }

        const payload = decoded as { id: string };

        const user = await userRepositories.getUserById(payload.id);

        (req as any).user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.role
        };

        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
