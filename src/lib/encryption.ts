import JSEncrypt from "jsencrypt";

/**
 * Encrypts a string using RSA-2048 with PKCS1_v1_5 padding.
 * @param data The plaintext data to encrypt.
 * @param publicKey The PEM-formatted RSA public key.
 * @returns Base64 encoded ciphertext string.
 */
export const encryptData = (data: string, publicKey: string): string => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encrypted = encrypt.encrypt(data);
  if (!encrypted) {
    throw new Error("Encryption failed");
  }
  return encrypted;
};
