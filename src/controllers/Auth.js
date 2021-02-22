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
            phone: user.phone,
            tokenType: 'access',
          },
          process.env.JWT_SECRET,
        ),
      },
    });
  }

  static async login(req, res) {
    const existingRecord = await User.findOne({
      phone: req.body.phone,
    });

    if (
      existingRecord &&
      compareSync(req.body.password, existingRecord.password)
    ) {
      return jsonResponse({
        status: statusCodes.OK,
        res,
        data: {
          ...existingRecord._doc,
          password: undefined,
          tokenType: 'access',
          token: sign(
            {
              id: existingRecord._id,
              phone: existingRecord.phone,
              tokenType: 'access',
            },
            process.env.JWT_SECRET,
          ),
        },
      });
    }

    return jsonResponse({
      status: statusCodes.NOT_FOUND,
      res,
      message: 'Numéro de téléphone ou mot de passe incorrect',
    });
  }
}

export default AuthCtrl;
