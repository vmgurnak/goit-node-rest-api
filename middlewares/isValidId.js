import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ message: `ID ${id} is not valid` });
  }
  next();
};

export default isValidId;
