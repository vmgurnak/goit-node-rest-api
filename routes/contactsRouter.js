import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from '../controllers/contactsControllers.js';

const jsonParser = express.json();

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', jsonParser, createContact);

contactsRouter.put('/:id', jsonParser, updateContact);

export default contactsRouter;
