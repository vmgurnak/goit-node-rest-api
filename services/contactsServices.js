import Contact from '../models/contacts.js';

async function listContacts(owner) {
  const contacts = await Contact.find(owner);
  return contacts;
}

async function getContactByIdOwner(id, userId) {
  const contact = await Contact.findOne({ _id: id, owner: userId });
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

async function updateContact(id, updateData) {
  const updatedContact = await Contact.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  console.log(updateContact);
  return updatedContact;
}

async function updateStatusContact(contactId, updateData) {
  const updatedStatusContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true }
  );
  console.log(updatedStatusContact);
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
