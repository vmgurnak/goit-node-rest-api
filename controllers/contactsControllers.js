import contactsService from '../services/contactsServices.js';
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from '../schemas/contactsSchemas.js';

export const getAllContacts = async (req, res, next) => {
  const { query } = req;
  console.log(query);

  const { userId } = req.user;
  try {
    const contacts = await contactsService.listContacts(userId);
    res.status(200).send({
      status: 200,
      message: 'Contacts successfully received',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const contact = await contactsService.getContactByIdOwner(id, userId);
    if (contact === null) {
      return res
        .status(404)
        .send({ status: 404, message: `ID ${id} is not found` });
    }
    res.status(200).send({
      status: 200,
      message: 'Contacts successfully received',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const contact = await contactsService.removeContact(id, userId);
    if (contact === null) {
      return res
        .status(404)
        .send({ status: 404, message: `ID ${id} is not found` });
    }
    res.status(204).send({
      status: 204,
      message: 'Contact successfully deleted',
    });
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

  contact.owner = req.user.userId;

  try {
    const newContact = await contactsService.addContact(contact);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  const { userId } = req.user;

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

  updateData.owner = userId;

  try {
    const updatedContact = await contactsService.updateContact(
      id,
      updateData,
      userId
    );
    if (updatedContact === null) {
      res.status(404).send({ message: `ID ${id} is not found` });
    }
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  const { userId } = req.user;

  const { error } = updateStatusContactSchema.validate(updateData, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .send({ message: error.details.map((err) => err.message).join(', ') });
  }

  updateData.owner = userId;

  try {
    const updatedStatusContact = await contactsService.updateStatusContact(
      id,
      updateData,
      userId
    );
    if (updatedStatusContact === null) {
      res.status(404).send({ message: `ID ${id} is not found` });
    }
    res.status(200).send(updatedStatusContact);
  } catch (error) {
    next(error);
  }
};
