import { celebrate, Joi } from 'celebrate';
import userTypes from '../../../../constants/userType';

export const passwordSchema = Joi.string().min(5).trim();

const email = Joi.string().trim().email();
const phone = Joi.string()
  .trim()
  .min(10)
  .max(14)
  .regex(/^\+?\d+$/);

export const signupSchema = celebrate({
  body: Joi.object().keys({
    firstName: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .min(3)
      .max(30)
      .required(),

    lastName: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .min(3)
      .max(30)
      .required(),

    middleName: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .min(3)
      .max(30)
      .optional(),
    phone: phone.required(),
    email: email.optional(),
    avatar: Joi.string().uri().optional(),
    password: passwordSchema.required(),
    userType: Joi.string()
      .valid(...Object.values(userTypes))
      .default(userTypes.COMMISSIONNAIRE),
  }),
});

// export const loginSchema = celebrate({
//   body: Joi.object().keys({
//     email: email.required(),
//     password: passwordSchema.required(),
//   }),
// });

// export const initPasswordResetSchema = celebrate({
//   body: Joi.object().keys({
//     phone: phone.required(),
//   }),
// });

// export const completePasswordResetSchema = celebrate({
//   body: Joi.object().keys({
//     password: passwordSchema.required(),
//     token: Joi.string().required(),
//   }),
// });
