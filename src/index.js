import express from 'express';
import cors from 'cors';
import db from './config/connections';
import statusCodes from './constants/statusCodes';
import jsonResponse from './helpers/jsonResponse';
import joiErrors from './middlewares/joiErrors';
import routers from './routes';

db.connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routers);

app.use(joiErrors());

// Application routing
app.get('/', (req, res) => {
  return res.status(statusCodes.OK).json({
    status: statusCodes.OK,
    message: 'Rest API',
  });
});

// Catch wrong routes
app.use('*', (req, res, next) => {
  const error = new Error('Not found');
  error.status = statusCodes.NOT_FOUND;

  const status = error.status || statusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Something went wrong. Please try again';
  return jsonResponse({
    res,
    status,
    message,
  });
});

export default app;
