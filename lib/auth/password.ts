import bcrypt from "bcryptjs";

const ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "12", 10);

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, ROUNDS);

export const verifyPassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);
