import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .send({ status: 400, message: `ID ${id} is not valid` });
  }
  next();
};

export default isValidId;
