const jwt = require("jsonwebtoken")

class JwtTokenManager {
  constructor() {
    this.jwt = jwt
  }

  async createAccessToken(payload) {
    return this.jwt.sign(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async createRefreshToken(payload) {
    return this.jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this.jwt.verify(token);
      this.jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError("refresh token tidak valid");
    }
  }

  async decodePayload(token) {
    const artifacts = this.jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;
