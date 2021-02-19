import UserModel from '../models/User';
import jsonResponse from '../helpers/jsonResponse';
import statusCodes from '../constants/statusCodes';

const checkEmailExist = async (req, res, next) => {
  const {
    body: { email },
  } = req;

  if (!email) {
    return next();
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return jsonResponse({
      res,
      status: statusCodes.BAD_REQUEST,
      data: {
        message: `L'adresse email ${email} est déjà utilisé`,
      },
    });
  }

  return next();
};

export default checkEmailExist;
