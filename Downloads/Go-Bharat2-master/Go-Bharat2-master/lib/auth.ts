import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext password using bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare plaintext password with hashed password.
 */
export async function comparePassword(
  plainText: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}

/**
 * Validate email format.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password requirements (minimum 6 characters).
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long.",
    };
  }
  return { isValid: true };
}
