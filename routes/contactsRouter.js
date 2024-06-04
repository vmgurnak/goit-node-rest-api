import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from '../controllers/contactsControllers.js';

import isValidId from '../middlewares/isValidId.js';

const jsonParser = express.json();

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', isValidId, getOneContact);

contactsRouter.delete('/:id', isValidId, deleteContact);

contactsRouter.post('/', jsonParser, createContact);

contactsRouter.put('/:id', isValidId, jsonParser, updateContact);

contactsRouter.patch(
  '/:id/favorite',
  isValidId,
  jsonParser,
  updateStatusContact
);

export default contactsRouter;
