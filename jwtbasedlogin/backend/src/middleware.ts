import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123123"; // replace with process.env.JWT_SECRET

export interface AuthRequest extends Request {
  userId?: string;
  username?:string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Malformed token" });
    return;
  }

  try {
    // Cast to unknown first to satisfy TypeScript
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: string ,username:string};
    req.userId = decoded.id;
  req.username = decoded.username;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}
