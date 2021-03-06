const firebase = require('firebase');
const { off } = require('../app');

const getContacts = (offset, limit) => {
   const phoneReference = firebase.database().ref("/Phones/");
   return new Promise((resolve, reject) => {
      phoneReference.on("value", function (snapshot) {
         const folders = snapshot.val();
         if (snapshot.val() === null) {
            resolve([]);
         } else {
            const data = Object.keys(folders).map(o => Object.assign({ id: o }, folders[o])).splice(offset, limit);
            resolve(data);
         }
         phoneReference.off("value");
      }, function (errorObject) {
         console.log("Read data failed" + errorObject.code);
         reject("Read data failed" + errorObject.code)
      });
   })
}

const getPages = () => {
   const phoneReference = firebase.database().ref("/Phones/");
   return new Promise((resolve, reject) => {
      phoneReference.on("value", function (snapshot) {
         const folders = snapshot.val();
         if (snapshot.val() === null) {
            resolve([]);
         } else {
            const data = Object.keys(folders).map(o => Object.assign({ id: o }, folders[o])).length;
            resolve(data);
         }
         phoneReference.off("value");
      }, function (errorObject) {
         console.log("Read data failed" + errorObject.code);
         reject("Read data failed" + errorObject.code)
      });
   })
}

const createContact = (contact) => {
   const referencePath = `/Phones/${contact.id}/`;
   const phoneReference = firebase.database().ref(referencePath);
   return new Promise((resolve, reject) => {
      phoneReference.set({ name: contact.name, phone: contact.phone }, function (error) {
         if (error) {
            reject("Data could not be saved." + error)
         } else {
            resolve(contact);
         }
      });
   });
}

const updateContact = (contact) => {
   var referencePath = `/Phones/${contact.id}/`;
   var phoneReference = firebase.database().ref(referencePath);
   return new Promise((resolve, reject) => {
      phoneReference.update({ name: contact.name, phone: contact.phone }, function (error) {
         if (error) {
            reject("Data could not be updated" + error)
         } else {
            resolve(contact);
         }
      });
   })
}

const deleteContact = (contact) => {
   var referencePath = `/Phones/${contact.id}/`;
   var phoneReference = firebase.database().ref(referencePath);
   return (new Promise((resolve, reject) => {
      phoneReference.remove((error) => {
         if (error) {
            reject("Data could not be deleted." + error);
         } else {
            resolve(contact);
         }
      })
   }));
}

const searchContacts = (name, phone, offset = 0, limit = 5) => {
   let regName = new RegExp(name, 'ig');
   let regPhone = new RegExp(phone, 'g');
   console.log(regPhone)
   const phoneReference = firebase.database().ref("/Phones/");
   return new Promise((resolve, reject) => {
      phoneReference.on("value", function (snapshot) {
         const folders = snapshot.val();
         if (snapshot.val() === null) {
            resolve([]);
         } else {
            const data = Object.keys(folders).map(o => Object.assign({ id: o }, folders[o]))
               .filter(item => {
                  if (name && phone) {
                     return item.name.match(regName) && item.phone.match(regPhone)
                  } else if (name) {
                     return item.name.match(regName)
                  } else if (phone) {
                     return item.phone.match(regPhone)
                  } else {
                     return false;
                  }
               })
               .splice(offset, limit)
            resolve(data);
         }
         phoneReference.off("value");
      }, function (errorObject) {
         console.log("Read data failed" + errorObject.code);
         reject("Read data failed" + errorObject.code)
      });
   })
}

const searchContactsPages = (name, phone) => {
   let regName = new RegExp(name, 'ig');
   let regPhone = new RegExp(phone, 'g');
   console.log(regPhone)
   const phoneReference = firebase.database().ref("/Phones/");
   return new Promise((resolve, reject) => {
      phoneReference.on("value", function (snapshot) {
         const folders = snapshot.val();
         if (snapshot.val() === null) {
            resolve([]);
         } else {
            const data = Object.keys(folders).map(o => Object.assign({ id: o }, folders[o]))
               .filter(item => {
                  if (name && phone) {
                     return item.name.match(regName) && item.phone.match(regPhone)
                  } else if (name) {
                     return item.name.match(regName)
                  } else if (phone) {
                     return item.phone.match(regPhone)
                  } else {
                     return false;
                  }
               })

            resolve(data.length);
         }
         phoneReference.off("value");
      }, function (errorObject) {
         console.log("Read data failed" + errorObject.code);
         reject("Read data failed" + errorObject.code)
      });
   })
}

module.exports = { getContacts, createContact, updateContact, deleteContact, searchContacts, getPages, searchContactsPages }