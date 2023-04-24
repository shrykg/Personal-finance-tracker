import { ObjectId } from 'mongodb';
// Need to add validations for date
const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkNumber(numVal, varName) {
    if (!numVal) throw `Error: You must supply a ${varName}!`;
    if (typeof numVal !== 'number') throw `Error: ${varName} must be a number!`;
    if (numVal <= 0)
      throw `Error: ${varName} should be greater than 0`;
    if (isNaN(numVal))
      throw `Error: ${numVal} is not a valid value for ${varName} as it is not a number`;
    return numVal;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  validatePassword(new_password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return regex.test(new_password);
  },

  validateFirstName(firstName) {
    const regex = /^[a-zA-Z]{2,25}$/;
    if (!regex.test(firstName)) {
      throw ("First name must be a valid string with at least 2 characters and at most 25 characters.");
    }
  },

  validateLastName(lastName) {
    const regex = /^[a-zA-Z]{2,25}$/;
    if (!regex.test(lastName)) {
      throw ("Last name must be a valid string with at least 2 characters and at most 25 characters.");
    }
  },

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    if (!regex.test(email)) {
      throw ("Invalid email address.");
    }
  },

  validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      throw ("Password must be a valid string with at least 8 characters, containing at least one uppercase letter, one number, and one special character.");
    }
  },

  validateRole(role) {
    if (role.toLowerCase() !== "admin" && role.toLowerCase() !== "user") {
      throw ("Role must be either 'admin' or 'user'");
    }
  },

  getTime() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let time = hours + ":" + minutes;

    return time;

  }
};

export default exportedMethods;