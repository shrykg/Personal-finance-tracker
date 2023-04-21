import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';
import validation from '../validation.js'
import bcrypt from "bcrypt"

const exportedMethods = {
    async get_user_by_email(email) {
        validation.checkString(email, 'email');
        const user_collection = await users();

        return await user_collection.findOne({ 'email': email })
    },

    async get_user_by_id(id) {
        validation.checkString(email, 'email');
        const user_collection = await users();

        return await user_collection.findOne({ '_id': id })
    },

    async add_user(firstname, lastname, dob, email, new_password) {
        console.log("I am in the function")
        firstname = validation.checkString(firstname, 'firstname');
        lastname = validation.checkString(lastname, 'lastname');
        email = validation.checkString(email, 'email');
        firstname = validation.checkString(firstname, 'firstname');
        const saltRounds = 10;

        let hashed_password = await bcrypt.hash(new_password, saltRounds);
        //let valid_pwd = validation.validatePassword(new_password);

        // if (!valid_pwd) {
        //     throw ('Error: password must be 8 characters or long')
        // }

        // const passwordInput = document.querySelector('#password_confirm');
        // const submitButton = document.querySelector('#register_button');
        // const errorLabel = document.querySelector('#error-label');

        // submitButton.addEventListener('click', function () {
        //     const password = passwordInput.value;
        //     if (!validatePassword(password)) {
        //         errorLabel.textContent = 'Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.';
        //         errorLabel.style.display = 'block';
        //     } else {
        //         errorLabel.style.display = 'none';
        //         // submit the form or perform other actions
        //     }
        // });
        const data = {
            "firstname": firstname,
            "lastname": lastname,
            "dob": dob,
            "email": email,
            "password": hashed_password,
            "created_at": new Date()
        }
        const user_collection = await users();

        await user_collection.insertOne(data);

        console.log('Data added')

    }

}


export default exportedMethods; 