import statusCodes from '../constants/statusCodes';
import jsonResponse from '../helpers/jsonResponse';

// const isProduction = process.env.NODE_ENV === 'production';

const asyncHandler = (cb) => async (req, res, next) => {
  try {
    await cb(req, res, next);
  } catch (err) {
    const status = err.status || statusCodes.INTERNAL_SERVER_ERROR;

    return jsonResponse({
      res,
      status,
      message:
        err?.errors && err?.errors[0]
          ? err?.errors[0].message
          : err.message || err.data.errorMessage,
    });
  }
};

export default asyncHandler;
