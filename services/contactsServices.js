import Contact from '../models/contacts.js';

async function listContacts(userId) {
  const contacts = await Contact.find({
    owner: userId,
  });
  return contacts;
}

async function getContactByIdOwner(id, userId) {
  const contact = await Contact.findOne({ _id: id, owner: userId });
  return contact;
}

async function removeContact(id, userId) {
  const deleteContact = await Contact.findOneAndDelete({
    _id: id,
    owner: userId,
  });
  return deleteContact;
}

async function addContact(contact) {
  const contacts = await Contact.create(contact);
  return contacts;
}

async function updateContact(id, updateData, userId) {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    updateData,
    { new: true }
  );
  return updatedContact;
}

async function updateStatusContact(id, updateData, userId) {
  const updatedStatusContact = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    updateData,
    { new: true }
  );
  return updatedStatusContact;
}

export default {
  listContacts,
  getContactByIdOwner,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
