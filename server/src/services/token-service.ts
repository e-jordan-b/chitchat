import jwt from 'jsonwebtoken';

export const signToken = (
  userId: string,
  email: string
): string | undefined => {
  const secret = process.env.JWT_SECRET;

  if (!secret) return;

  const token = jwt.sign({ id: userId, email }, secret);
  return token;
};
