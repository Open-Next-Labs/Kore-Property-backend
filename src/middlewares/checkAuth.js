import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UNAUTHORIZED } from '../constants/statusCodes';
import jsonResponse from '../helpers/jsonResponse';
import User from '../models/User';

const { JWT_SECRET = '' } = process.env;

const checkAuth = () => async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const token = authorization.slice(4);

  if (!token) {
    return jsonResponse({
      res,
      status: UNAUTHORIZED,
      message: 'Unauthorized access',
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err || !decoded) {
      if (err.name === 'TokenExpiredError') {
        return jsonResponse({
          res,
          status: UNAUTHORIZED,
          message: 'Session expired. Please login again',
        });
      }

      console.log(decoded, err, token);

      return jsonResponse({
        res,
        status: UNAUTHORIZED,
        message: 'Invalid token',
      });
    }

    const currentUser = await User.findOne({ email: decoded.email }).select(
      '-password',
    );

    if (!currentUser) {
      return jsonResponse({
        res,
        status: UNAUTHORIZED,
        message: 'Invalid token',
      });
    }

    req.token = token;
    req.currentUser = currentUser;
    next();
  });
};

export default checkAuth;
