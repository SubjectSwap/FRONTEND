// utils/crypto.js

// Generate an RSA key pair (2048 bits, for compatibility with backend)
export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  return keyPair;
}

// Export a CryptoKey public key to PEM string
export async function exportPublicKey(key) {
  const spki = await window.crypto.subtle.exportKey("spki", key);
  const b64 = window.btoa(String.fromCharCode(...new Uint8Array(spki)));
  const pem = `-----BEGIN PUBLIC KEY-----\n${b64.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;
  return pem;
}

// Export a CryptoKey private key to PEM string
export async function exportPrivateKey(key) {
  const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", key);
  const b64 = window.btoa(String.fromCharCode(...new Uint8Array(pkcs8)));
  const pem = `-----BEGIN PRIVATE KEY-----\n${b64.match(/.{1,64}/g).join('\n')}\n-----END PRIVATE KEY-----`;
  return pem;
}

// Import a PEM public key to CryptoKey
export async function importPublicKey(pem) {
  const b64 = pem.replace(/-----.*?-----|\s/g, '');
  const binary = Uint8Array.from(window.atob(b64), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "spki",
    binary.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

// Import a PEM private key to CryptoKey
export async function importPrivateKey(pem) {
  const b64 = pem.replace(/-----.*?-----|\s/g, '');
  const binary = Uint8Array.from(window.atob(b64), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "pkcs8",
    binary.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  );
}

// Encrypt a string with a public key (PEM or CryptoKey)
export async function encryptWithPublicKey(publicKey, message) {
  let key = publicKey;
  if (typeof publicKey === "string") key = await importPublicKey(publicKey);
  const enc = new TextEncoder().encode(message);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    enc
  );
  return window.btoa(String.fromCharCode(...new Uint8Array(encrypted))); // base64 for transport
}

// Decrypt a base64 string with a private key (PEM or CryptoKey)
export async function decryptWithPrivateKey(privateKey, encryptedBase64) {
 console.log("Private Key:", await exportPrivateKey(privateKey));
 console.log("Encrypted Base64:", encryptedBase64);
  let key = privateKey;
  if (typeof privateKey === "string") key = await importPrivateKey(privateKey);
  const encrypted = Uint8Array.from(window.atob(encryptedBase64), c => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    key,
    encrypted.buffer
  );
  return new TextDecoder().decode(decrypted);
}