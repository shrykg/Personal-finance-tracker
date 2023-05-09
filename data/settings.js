import { users } from '../config/mongoCollections.js';
import validation from '../validation.js'
import bcrypt from "bcrypt"
import { ObjectId } from 'mongodb';

export async function update_user_name(id, new_value) {
    if (!new_value) {
        throw ('Field is required')
    }
    const user_collection = await users();
    try {
        user_collection.updateOne(
            { _id: new ObjectId(id) }, // filter to find the document
            { $set: { firstname: new_value } } // update operation to set the field to a new value
        )
    }
    catch (e) {
        console.log(e);
    }

}

export async function update_user_last_name(id, new_value) {
    if (!new_value) {
        throw ('Field is required')
    }
    const user_collection = await users();

    try {
        user_collection.updateOne(
            { _id: new ObjectId(id) }, // filter to find the document
            { $set: { lastname: new_value } } // update operation to set the field to a new value
        )
    }
    catch (e) {
        console.log(e);
    }

}

export async function update_user_dob(id, new_value) {
    if (!new_value) {
        throw ('Field is required')
    }
    const user_collection = await users();
    try {
        user_collection.updateOne(
            { _id: new ObjectId(id) }, // filter to find the document
            { $set: { dob: new_value } } // update operation to set the field to a new value
        )
    }

    catch (e) {
        console.log(e);
    }


}

export async function update_password(id, old_password, new_password) {
    const user_collection = await users();
    let user = ''
    if (!id || !old_password || !new_password) {
        throw ("These fields are required");
    }
    try {
        user = await user_collection.findOne({ _id: new ObjectId(id) })
    }

    catch (e) {
        console.log(e);
    }


    if (!await bcrypt.compare(old_password, user.password)) {
        throw ("Invalid Password");
    }

    else if (await bcrypt.compare(new_password, user.password)) {
        throw ("New password and current password cannot be the same");
    }

    else {
        const saltRounds = 10;
        let hashed_password = await bcrypt.hash(new_password, saltRounds);
        try {
            user_collection.updateOne(
                { _id: new ObjectId(id) }, // filter to find the document
                { $set: { password: hashed_password } } // update operation to set the field to a new value
            )
        }

        catch (e) {
            console.log(e);
        }

    }

    return true;
}

