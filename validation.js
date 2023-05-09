import { ObjectId } from 'mongodb';
import moment from 'moment';
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

  checkDate(dateString, varName) {
    if (!dateString) throw `Error: You must supply a ${varName}!`;
    if (typeof dateString !== 'string') throw `Error: ${varName} must be a string!`;
    dateString = dateString.trim();
    if (dateString.length !== 10) throw `Error: ${varName} must be in the format YYYY-MM-DD!`;
    if (!moment(dateString, 'YYYY-MM-DD', true).isValid()) throw `Error: ${varName} must be in the format YYYY-MM-DD!`;
    const minDate = moment('2021-01-01', 'YYYY-MM-DD');
    const maxDate = moment();
    const date = moment(dateString, 'YYYY-MM-DD');
    if (date.isBefore(minDate)) throw `Error: ${varName} cannot be before January 1, 2021!`;
    if (date.isAfter(maxDate)) throw `Error: ${varName} cannot be after the present date!`;
    return date.format('YYYY-MM-DD');
  },

  checkDate1(dateString, varName) {
    if (!dateString) throw `Error: You must supply a ${varName}!`;
    if (typeof dateString !== 'string') throw `Error: ${varName} must be a string!`;
    dateString = dateString.trim();
    if (dateString.length !== 10) throw `Error: ${varName} must be in the format YYYY-MM-DD!`;
    if (!moment(dateString, 'YYYY-MM-DD', true).isValid()) throw `Error: ${varName} must be in the format YYYY-MM-DD!`;
  
    const todayDate = moment().startOf('day').add(1, 'month');
    const date = moment(dateString, 'YYYY-MM-DD');
  
    if (date.isBefore(todayDate)) throw `Error: ${varName} cannot be before one month from the current date!`;
    return date.format('YYYY-MM-DD');
  },

  checkDateCreatedAtGoals(date, varName) {
    if (!date) throw `Error: You must provide a ${varName}`;
    if (typeof date !== 'string') throw `Error: ${varName} must be a string`;
    date = date.trim();
    if (date.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!moment(date, 'YYYY-MM-DD', true).isValid())
      throw `Error: ${varName} is not a valid date format (YYYY-MM-DD)`;
    return date;
  },

  checkTargetDateAfterCreatedDate(targetDateString, createdDateString, varName, minMonthsDifference) {
    targetDateString = this.checkDateCreatedAtGoals(targetDateString, varName);
    createdDateString = this.checkDateCreatedAtGoals(createdDateString, 'Created Date');
  
    const targetDate = moment(targetDateString, 'YYYY-MM-DD');
    const createdDate = moment(createdDateString, 'YYYY-MM-DD');
    const monthsDifference = targetDate.diff(createdDate, 'months', true);
  
    if (monthsDifference < minMonthsDifference) {
      throw `Error: ${varName} must be at least ${minMonthsDifference} month(s) after the created date.`;
    }
  
    return targetDateString;
  }
  ,

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
    email = email.trim();
    email = email.toLowerCase();
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

  validateDOB(dob) {
    const birthdate = new Date(dob);
    // calculate the age
    const ageInMilliseconds = Date.now() - birthdate.getTime();
    const ageDate = new Date(ageInMilliseconds);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    // display the age
    return age;
  },
  // trim_lowercase(input) {
  //   input = input.trim();
  //   input = input
  // }

  getTime() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let time = hours + ":" + minutes;

    return time;

  },

  checkBudget(category, amount, start_Date, end_Date) {
    if (!category) { throw "Please provide category" }
    if (!typeof category === 'string') { throw "Type of category is not string" }
    let validCategories = [
      "groceries",
      "shopping",
      "eating_out",
      "bills",
      "transportation",
      "entertainment",
      "travel",
      "healthcare",
      "education",
      "miscellaneous"
    ]
    if (!validCategories.includes(category.toLowerCase())) { throw "Please select a valid category" }

    if (!amount) { throw "Please Provide amount" }
    if (isNaN(amount) || amount <= 0) { throw "Please enter a valid amount." }
    if (amount > 999999999) { throw "Enter amount under 9 digits only" }

    if (!start_Date) { throw "Please select start_date" }
    if (!end_Date) { throw "Please select end_date" }
    if (start_Date.trim().length == 0) { throw "Please Enter start_Date" }
    if (end_Date.trim().length == 0) { throw "Please Enter end_Date" }
    if (!typeof start_Date === 'string' || !typeof end_Date === 'string') { throw "Enter date in only YYYY-MM-DD string format" }

    let isValidDate = moment(start_Date, "YYYY-MM-DD", true).isValid();
    if (isValidDate === false) { throw "Please Enter Start date in YYYY-MM-DD format" }

    isValidDate = moment(end_Date, "YYYY-MM-DD", true).isValid();
    if (isValidDate === false) { throw "Please Enter End date in YYYY-MM-DD format" }

    start_Date = moment(start_Date).format("YYYY-MM-DD");
    end_Date = moment(end_Date).format("YYYY-MM-DD");
    let today = moment().format("YYYY-MM-DD");
    let maxEndDate = moment(today).add(1, 'years').format("YYYY-MM-DD");

    if (moment(start_Date).isBefore(today)) {
      throw "Start date cannot be earlier than today.";
    }
    if (moment(end_Date).isBefore(today)) {
      throw "End date cannot be earlier than today.";
    }
    if (moment(end_Date).isBefore(today)) {
      throw "End date cannot be earlier than today.";
    }
    if (moment(end_Date).isBefore(start_Date)) {
      throw "End date cannot be earlier than start date."
    }
    if(moment(end_Date).isAfter(maxEndDate))
    {
      throw "End date cannot be more than 1 year from today.";
    }
  },
  checkGoals(goal_purpose,goal_name,goal_amount,target_date)
  {
    if (!goal_purpose) {
      throw "Please select a goal purpose";
    }
    if (typeof goal_purpose !== "string") { throw "Please enter a valid goal purpose" }
    if(goal_purpose.trim().length===0){throw "Goal Purpose cannot be empty string"}
    let validOptions = ["crush_credit_card_debt", "wipe_out_my_loans", "save_for_a_rainy_day", "prepare_for_retirement", "buy_a_home", "buy_a_car", "save_for_college", "take_a_trip", "improve_my_home", "something_else"];
    let lowerGoalPurpose = goal_purpose.toLowerCase();
    if (!validOptions.includes(lowerGoalPurpose)) {
      throw "Please select a valid goal purpose";
    }
  
    if (!goal_name) {
      throw "Please provide a name for your goal";
    }
    if (typeof goal_name !== "string") { throw "Please enter a valid goal name" }
    if(goal_name.trim().length===0){throw "Goal name cannot be empty string"}
    let nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(goal_name)) {
      throw "Please enter a valid goal name";
    }
  
    if (!goal_amount) {
      throw "Please provide an amount for your goal";
    }
    goal_amount = Number(goal_amount);
    if (isNaN(goal_amount) || goal_amount <= 0) {
      throw "Please enter a valid amount.";
    }
    if (goal_amount > 999999999) {
      throw "Enter amount under 9 digits only";
    }
  
    if (!target_date) {
      throw "Please provide a deadline for your goal";
    }
    if (!typeof target_date === 'string') { throw "Enter date in only YYYY-MM-DD string format" }

    if (target_date.trim().length == 0) { throw "Please Enter start_Date" }
    let isValidDate = moment(target_date, "YYYY-MM-DD", true).isValid();
    if (isValidDate === false) {
      throw "Please enter the deadline in YYYY-MM-DD format";
    }
    target_date = moment(target_date).format("YYYY-MM-DD");
    let today = moment().format("YYYY-MM-DD");
    if (moment(target_date).isBefore(today)) {
      throw "Goal deadline cannot be earlier than today.";
    }
    let minDate = moment(today).add(6, 'months').format("YYYY-MM-DD");
    let maxDate = moment(today).add(20, 'years').format("YYYY-MM-DD");
    if (moment(target_date).isBefore(minDate)) {
      throw "Goal deadline must be at least 6 months from today.";
    }
    if (moment(target_date).isAfter(maxDate)) {
      throw "Goal deadline cannot be more than 20 years from today.";
    }
  },
  checkSavings(goal_name,savings)
  {
    if (!goal_name) {
      throw "Please provide a name for your goal";
    }
    if (typeof goal_name !== "string") { throw "Please enter a valid goal name" }
    if(goal_name.trim().length===0){throw "Goal name cannot be empty string"}
    let nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(goal_name)) {
      throw "Please enter a valid goal name";
    }
    if (!savings) { throw("Please provide an amount for your goal"); }
    savings = Number(savings);
    if (isNaN(savings) || savings <= 0) { throw("Please enter a valid amount."); }
    if (savings > 999999999) { throw("Enter amount under 9 digits only"); }
  }
}
export default exportedMethods;