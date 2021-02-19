import UserModel from '../models/User';
import jsonResponse from '../helpers/jsonResponse';
import statusCodes from '../constants/statusCodes';

const checkPhoneNumberExist = async (req, res, next) => {
  const {
    body: { phone },
  } = req;
  const existingUser = await UserModel.findOne({ phone });
  if (existingUser) {
    return jsonResponse({
      res,
      status: statusCodes.BAD_REQUEST,
      data: {
        message: `Le numero de téléphone ${phone} est déjà utilisé`,
      },
    });
  }

  return next();
};

export default checkPhoneNumberExist;
