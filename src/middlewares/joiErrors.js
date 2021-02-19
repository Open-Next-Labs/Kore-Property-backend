import { isCelebrateError } from 'celebrate';
import jsonResponse from '../helpers/jsonResponse';
import statusCodes from '../constants/statusCodes';

const joiErrors = () => (err, req, res, next) => {
  if (!isCelebrateError(err)) return next(err);
  const joiError = err?.joi?.details[0];
  const errors = {
    [joiError?.context?.key]: joiError,
  };

  return jsonResponse({
    res,
    status: statusCodes.BAD_REQUEST,
    data: {
      message: joiError?.message,
      errors,
    },
  });
};

export default joiErrors;
