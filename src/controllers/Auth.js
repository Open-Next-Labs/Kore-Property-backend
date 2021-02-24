import 'dotenv/config';
import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
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

    // Send a message to the new phone number with 6 digits

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

  static async initiateResetPassword(req, res) {
    const existingRecord = await User.findOne({
      phone: req.body.phone,
    });

    if (!existingRecord) {
      return jsonResponse({
        status: statusCodes.NOT_FOUND,
        res,
        message: `L'utilisateur avec ce numéro de téléphone (${req.body.phone}) n'a pas été trouvé`,
      });
    }

    // on doit remplacer le token par un numero a 6 caracteres
    const token = sign(
      {
        id: existingRecord._id,
        phone: existingRecord.phone,
        tokenType: 'passwordReset',
      },
      process.env.JWT_SECRET,
      { expiresIn: '3h' },
    );

    // send sms with a random 6 digits

    existingRecord.resetToken = token;
    existingRecord.save();

    return jsonResponse({
      status: statusCodes.OK,
      res,
      message: 'Un sms de confirmation a été envoyé à votre numéro',
    });
  }

  static async completeResetPassword(req, res) {
    const user = await User.findOne({
      resetToken: req.body.token,
    });

    if (user) {
      user.password = hashSync(
        req.body.password,
        Number(process.env.BCRYPT_SALTING_ROUNDS),
      );
      user.resetToken = null;
      user.save();

      return jsonResponse({
        status: statusCodes.OK,
        res,
        message: 'Le mot de passe a été restoré avec succès',
      });
    }
    return jsonResponse({
      status: statusCodes.NOT_ACCEPTABLE,
      res,
      message: "Le code de verification n'est pas correct",
    });
  }
}

export default AuthCtrl;
