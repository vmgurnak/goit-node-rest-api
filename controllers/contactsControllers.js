import express from 'express';

const app = express();

import contactsService from '../services/contactsServices.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await contactsService.getContactById(id);
    if (contact === null) {
      return res.status(404).send({ message: 'Not found' });
    }
    console.log(res.send);
    res.send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await contactsService.removeContact(id);
    if (contact === null) {
      return res.status(404).send({ message: 'Not found' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const contact = req.body;

  const { error } = createContactSchema.validate(contact, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .send({ message: error.details.map((err) => err.message).join(', ') });
  }
  try {
    const newContact = await contactsService.addContact(contact);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .send({ message: 'Body must have at least one field' });
  }

  const { error } = updateContactSchema.validate(updateData, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .send({ message: error.details.map((err) => err.message).join(', ') });
  }

  const updatedContact = await contactsService.updateContact(id, updateData);
  if (!updatedContact) {
    res.status(404).send({ message: 'Not found' });
  }
  res.status(200).send(updatedContact);
};
