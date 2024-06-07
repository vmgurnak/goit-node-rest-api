import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});
