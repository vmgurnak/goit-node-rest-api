import * as fs from 'fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

import Contact from '../models/contacts.js';

const contactsPath = path.resolve('db', 'contacts.json');
// async function listContacts() {
//   const data = await fs.readFile(contactsPath, { encoding: 'utf-8' });
//   const contacts = JSON.parse(data);
//   return contacts;
// }

async function listContacts() {
  const contacts = await Contact.find();
  return contacts;
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}

async function removeContact(contactId) {
  const deleteContact = await Contact.findByIdAndDelete(contactId);
  return deleteContact;
}

async function addContact(contact) {
  const contacts = await Contact.create(contact);
  return contacts;
}

async function updateContact(contactId, updateData) {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true }
  );
  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
