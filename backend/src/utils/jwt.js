// backend/src/utils/jwt.js
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

/**
 * 生成JWT Token
 * @param {Object} payload - 载荷数据（保持最小化）
 * @returns {string} JWT Token
 */
export function signToken(payload) {
  try {
    // 确保payload是纯对象且最小化
    const cleanPayload = {
      uid: payload.uid,
      // 不要添加其他不必要的字段，比如email等
    };

    return jwt.sign(
      cleanPayload,
      config.jwtSecret,
      {
        expiresIn: config.jwtExpires,
        issuer: 'your-app-name', // 保持简短
        algorithm: 'HS256' // 明确指定算法
      }
    );
  } catch (error) {
    console.error('JWT sign error:', error);
    throw new Error('Token generation failed');
  }
}

/**
 * 验证JWT Token
 * @param {string} token - JWT Token
 * @returns {Object|null} 解码后的载荷
 */
export function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    // 检查token长度，如果过长可能有问题
    if (token.length > 500) {
      console.warn('Token seems too long:', token.length);
      return null;
    }

    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'], // 限制算法
      issuer: 'your-app-name'
    });

    return decoded;
  } catch (error) {
    console.error('JWT verify error:', error.message);
    return null;
  }
}