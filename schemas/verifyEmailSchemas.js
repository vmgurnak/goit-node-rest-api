import Joi from 'joi';

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
