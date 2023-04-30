import { users } from '../config/mongoCollections.js';
import validation from '../validation.js'
import bcrypt from "bcrypt"
import { ObjectId } from 'mongodb';

export async function update_user_name(id, new_value) {
    const user_collection = await users();

    user_collection.updateOne(
        { _id: new ObjectId(id) }, // filter to find the document
        { $set: { firstname: new_value } } // update operation to set the field to a new value
    )

}

export async function update_user_last_name(id, new_value) {
    const user_collection = await users();

    user_collection.updateOne(
        { _id: new ObjectId(id) }, // filter to find the document
        { $set: { lastname: new_value } } // update operation to set the field to a new value
    )

}

export async function update_user_dob(id, new_value) {
    const user_collection = await users();

    user_collection.updateOne(
        { _id: new ObjectId(id) }, // filter to find the document
        { $set: { dob: new_value } } // update operation to set the field to a new value
    )

}

export async function update_password(id, old_password, new_password) {
    const user_collection = await users();
    const user = await user_collection.findOne({ _id: new ObjectId(id) })
    console.log(user);
    if (!await bcrypt.compare(old_password, user.password)) {
        throw ("Invalid Password");
    }

    else {
        const saltRounds = 10;
        let hashed_password = await bcrypt.hash(new_password, saltRounds);

        user_collection.updateOne(
            { _id: new ObjectId(id) }, // filter to find the document
            { $set: { password: hashed_password } } // update operation to set the field to a new value
        )
    }
}

