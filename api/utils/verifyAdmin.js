import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyAdmin = (req, res, next) => {
  const token =
    req.cookies?.admin_token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin")
      return next(errorHandler(403, "Forbidden"));
    req.admin = decoded;
    next();
  });
};
