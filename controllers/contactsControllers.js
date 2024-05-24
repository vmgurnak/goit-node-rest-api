import express from 'express';
const app = express();

import contactsService from '../services/contactsServices.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.send(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);
  if (contact) {
    res.send(contact);
  } else {
    res.status(404).send({ message: 'Not found' });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.removeContact(id);
  if (contact) {
    res.send(contact);
  } else {
    res.status(404).send({ message: 'Not found' });
  }
};

export const createContact = async (req, res) => {
  const contact = req.body;

  const { error } = createContactSchema.validate(contact, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .send({ message: error.details.map((err) => err.message).join(', ') });
  }

  const newContact = await contactsService.addContact(contact);
  res.status(201).send(newContact);
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
