import * as jose from 'jose';
import {PUBLIC_JWT_KEY} from "$env/static/public";
const JWT = new TextEncoder().encode(PUBLIC_JWT_KEY)
const alg = 'HS256';

export async function createAndSignJWT(value: string) {
    try {
    if (await verifyJWT(value)) return value;
    } catch (error) {}
  try {
    const jwt = await new jose.SignJWT({ "value": value })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(JWT);
    return jwt;
  } catch (error) {
    throw new Error('Error creating and signing JWT');
  }
}
export async function verifyJWT(jwt: string) {
    if (!jwt) return false;
  try {
    const verified = await jose.jwtVerify(jwt, JWT, {
        algorithms: [alg],
        });
    return verified;
  } catch (error) {
    throw new Error('Error verifying JWT');
  }
}