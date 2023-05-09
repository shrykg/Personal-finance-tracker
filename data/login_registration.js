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
        // validation.checkString(email, 'email');
        const user_collection = await users();

        return await user_collection.findOne({ '_id': new ObjectId(id) })
    },

    async add_user(firstname, lastname, dob, email, new_password, region) {
        //console.log("I am in the function")
        firstname = firstname.trim();
        firstname = validation.checkString(firstname, 'firstname');
        lastname = lastname.trim()
        lastname = validation.checkString(lastname, 'lastname');
        email = email.trim();
        email = email.toLowerCase();
        email = validation.checkString(email, 'email');

        let age = validation.validateDOB(dob);
        if (age < 13) {
            throw ('You must be more than 13 years old to register !')
        }

        try {
            validation.validatePassword(new_password);
        }
        catch (e) {
            console.log(e);
        }

        const saltRounds = 10;

        let hashed_password = await bcrypt.hash(new_password, saltRounds);
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

        try {
            const newInsertInformation = await user_collection.insertOne(data);
            const newId = newInsertInformation.insertedId;
            return await this.get_user_by_id(newId.toString())
        }
        catch (e) {
            console.log(e);
        }
        

    },

    async checkUser(emailAddress, password) {
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

        if (!symbol) {
            throw ('Invalid region entered , please select from dropdown');
        }
        return symbol;

    }
}


export default exportedMethods; 