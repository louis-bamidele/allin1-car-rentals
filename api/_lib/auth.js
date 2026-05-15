import jwt from "jsonwebtoken";
import { connectDB } from "./db.js";
import User from "./models/User.js";

// Returns the user if the Bearer token is valid, otherwise writes a 401 and returns null
export async function verifyAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authenticated" });
    return null;
  }
  try {
    await connectDB();
    const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return null;
    }
    return user;
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return null;
  }
}
