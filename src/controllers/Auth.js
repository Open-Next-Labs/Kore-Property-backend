import 'dotenv/config';
import { hashSync, compareSync } from 'bcrypt';
import { sign, verify, decode } from 'jsonwebtoken';
import User from '../models/User';
import statusCodes from '../constants/statusCodes';
import jsonResponse from '../helpers/jsonResponse';

class AuthCtrl {
  static async signup(req, res) {
    const user = await User.create({
      ...req.body,
      password: hashSync(
        req.body.password,
        Number(process.env.BCRYPT_SALTING_ROUNDS),
      ),
    });

    return jsonResponse({
      res,
      status: statusCodes.CREATED,
      message: `Vous avez été enregistré avec succès`,
      data: {
        user,
        token: sign(
          {
            id: user._id,
            email: user.email,
            tokenType: 'access',
          },
          process.env.JWT_SECRET,
        ),
      },
    });
  }

  static async login(req, res) {
    return;
  }
}

export default AuthCtrl;
