import crypto from 'node:crypto'

export default class TokenService {
  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }
}
