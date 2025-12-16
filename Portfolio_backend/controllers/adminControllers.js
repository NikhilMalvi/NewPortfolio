import jwt from "jsonwebtoken";

export const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password cannot be empty",
      });
    }

    if (email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    // Create token with 24-hour expiry
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
