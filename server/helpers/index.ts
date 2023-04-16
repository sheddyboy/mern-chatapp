import jwt from "jsonwebtoken";

const generateToken = (payload: any, expiresIn: string | number = "1d") => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
  return token;
};

const verifyToken = (token: string) => {
  let payload = null;
  let error = null;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };
  } catch (err) {
    error = err;
  }
  return { payload, error };
};

export { generateToken, verifyToken };
