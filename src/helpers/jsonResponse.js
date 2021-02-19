import statusCodes from '../constants/statusCodes';

/**
 * @param  {Object} data
 * @param  {ServerResponse} res
 * @return {ServerResponse} Response
 */
const jsonResponse = ({ status = statusCodes.OK, res, ...data }) => {
  return res.status(status).json({
    status,
    ...data,
  });
};

export default jsonResponse;
