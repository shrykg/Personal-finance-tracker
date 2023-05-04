import { ObjectId } from 'mongodb';
import { plaid } from '../config/mongoCollections.js';
import validation from '../validation.js'


const exportedMethods = {

    async storePlaidCredentials(accessToken, itemId, userId) {
        console.log('store plaid credentials called')
        userId = validation.checkId(userId, 'User ID')
        let plaidInfo = {
            user_id: new ObjectId(userId),
            accessToken: accessToken,
            itemId: itemId
        }
        const plaidCollections = await plaid()
        const newInsertInformation = await plaidCollections.insertOne(plaidInfo)
        console.log(newInsertInformation)
        const newId = newInsertInformation.insertedId;
        return await this.getPlaidCredentials(userId)
    },

    async getPlaidCredentials(userId) {
        userId = validation.checkId(userId, 'User ID')
        const plaidCollections = await plaid()
        const plaidinfo = await plaidCollections.findOne({ user_id: new ObjectId(userId)})
        if (!plaidinfo) {
            throw 'Error: Plaid Credentials not found'
        }
        return plaidinfo
    },

    async removePlaidCredentials(userId) {
        userId = validation.checkId(userId, 'User ID')
        const plaidCollections = await plaid()
        const deletionInfo = await plaidCollections.findOneAndDelete({
            user_id: new ObjectId(userId)
        })
        if (deletionInfo.lastErrorObject.n === 0) {
            throw `Could not delete plaid info with user id of ${userId}`
        }
        return { deleted: true }
    }

}

export default exportedMethods;