import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';
import validation from '../validation.js'
import bcrypt from "bcrypt"

const exportedMethods = {
    async get_user_by_email(email) {
        validation.checkString(email, 'email');
        const user_collection = await users();

        return await user_collection.findOne({ 'email': email })
        //console.log(data);

    },

    async get_user_by_id(id) {
        validation.checkString(email, 'email');
        const user_collection = await users();

        return await user_collection.findOne({ '_id': id })
    },

    async add_user(firstname, lastname, dob, email, new_password, region) {
        //console.log("I am in the function")
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
            "created_at": new Date(),
            "region": region
        }
        const user_collection = await users();

        await user_collection.insertOne(data);

        //console.log('Data added')

    },

    async checkUser(emailAddress, password) {
        // if (!emailAddress || !password || ) {
        //   throw ("Error: You must provide both email address and password");
        // }
        // console.log(emailAddress);
        // console.log(password);
        // try {
        //     validation.validateEmail(emailAddress);
        // }
        // catch (e) {
        //     console.log(e);
        // }
        // try {
        //     validation.validatePassword(password);
        // }
        // catch (e) {
        //     console.log(e);
        // }

        const user_collection = await users();

        try {
            const user = await user_collection.findOne({ email: emailAddress })
            //console.log(user);
            if (!user) {
                throw ("Either Email address or password is invalid");
            }
            if (!await bcrypt.compare(password, user.password)) {
                throw ("Either Email address or password is invalid");
            }
            else {
                //return { "firstName": user.firstName, "lastName": user.lastName, "emailAddress": user.emailAddress, "role": user.role }
                return user;
            }
        }

        catch (e) {
            console.log(e);
        }

    },

    check_currency_symbol(region) {
        const currencyMap = {
            'China': '¥',
            'India': '₹',
            'United States': '$',
            'Indonesia': 'Rp',
            'Pakistan': '₨',
            'Brazil': 'R$',
            'Nigeria': '₦',
            'Bangladesh': '৳',
            'Russia': '₽',
            'Mexico': '$',
            'Japan': '¥',
            'Ethiopia': 'Br',
            'Philippines': '₱',
            'Egypt': '£',
            'Vietnam': '₫',
            'DR Congo': 'FC',
            'Turkey': '₺',
            'Iran': '﷼',
            'Germany': '€',
            'Thailand': '฿',
            'United Kingdom': '£',
            'France': '€',
            'Italy': '€',
            'Tanzania': 'Sh',
            'South Africa': 'R',
            'Myanmar': 'Ks',
            'Kenya': 'Sh',
            'South Korea': '₩',
            'Colombia': '$',
            'Spain': '€',
            'Uganda': 'Sh',
            'Argentina': '$',
            'Algeria': 'د.ج',
            'Sudan': 'SDG',
            'Ukraine': '₴',
            'Iraq': 'ع.د',
            'Afghanistan': '؋',
            'Poland': 'zł',
            'Canada': '$',
            'Morocco': 'د.م.',
            'Uzbekistan': 'soʻm',
            'Saudi Arabia': '﷼',
            'Peru': 'S/',
            'Malaysia': 'RM',
            'Angola': 'Kz',
            'Mozambique': 'MT',
            'Yemen': '﷼',
            'Nepal': 'रू',
            'Venezuela': 'Bs.',
        };

        let symbol = currencyMap[region];

        return symbol;

    }
}


export default exportedMethods; 