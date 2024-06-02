import Contact from '../models/contacts.js';

async function listContacts() {
  const contacts = await Contact.find();
  return contacts;
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

async function updateStatusContact(contactId, updateData) {
  const updatedStatusContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true }
  );
  return updatedStatusContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
