import { ObjectId } from 'mongodb';
import { transactions } from '../config/mongoCollections.js';
import validation from '../validation.js'

const exportedMethods = {

    async getAllTransactions(userId) {
        userId = validation.checkId(userId, 'User ID')

        const transactionCollections = await transactions()
        return await transactionCollections
            .find({ user_id: userId })
            .toArray();
    },

    async getTransaction(transactionId) {
        transactionId = validation.checkId(transactionId, 'Transaction ID')

        const transactionCollections = await transactions()
        const transaction = await transactionCollections.findOne({ _id: ObjectId(transactionId) })
        if (!transaction) {
            throw 'Error: Transaction not found'
        }
        return transaction
    },

    async addTransaction(userId, paymentType, amount, description, category) {
        userId = validation.checkId(userId, 'User ID')
        paymentType = validation.checkString(paymentType, 'Payment Type')
        amount = validation.checkNumber(amount, 'Amount')
        description = validation.checkString(description, 'Description')
        category = validation.checkString(category, 'Category')
        const date = new Date()

        const newTransaction = {
            user_id: ObjectId(userId),
            transaction_date: date.toISOString(),
            amount: amount,
            description: description,
            category: category
        }
        const transactionCollections = await transactions()
        const insertInformation = await transactionCollections.insertOne(newTransaction)
        const newId = insertInformation.insertedId
        return await getTransaction(newId.toString())

    },

    async removeTransaction(transactionId) {
        transactionId = validation.checkId(transactionId, 'Transaction ID')

        const transactionCollections = await transactions()
        const deletionInfo = transactionCollections.findOneAndDelete({
            _id: ObjectId(transactionId)
        })
        if (deletionInfo.lastErrorObject.n === 0) {
            throw `Could not delete post with id of ${transactionId}`
        }
        return { deleted: true }
    },

    async updateTransaction(transactionId, updatedTransaction) {
        transactionId = validation.checkId(transactionId)
        updatedTransaction.user_id = validation.checkId(updatedTransaction.user_id, 'User ID')
        // Check date validations
        updatedTransaction.amount = validation.checkNumber(updatedTransaction.amount, 'Amount')
        updatedTransaction.description = validation.checkString(updatedTransaction.description, 'Description')
        updatedTransaction.category = validation.checkString(updatedTransaction.category)

        let updatedTransactionData = {
            user_id: updatedTransaction.user_id,
            transaction_date: updatedTransaction.transaction_date,
            amount: updatedTransaction.amount,
            description: updatedTransaction.description,
            category: updatedTransaction.category
        }
        const transactionCollections = await transactions()
        const updatedInfo = await transactionCollections.findOneAndReplace(
            { _id: ObjectId(transactionId) },
            updatedTransactionData,
            { returnDocument: 'after' }
        )
        if (updatedInfo.lastErrorObject.n === 0)
            throw `Error: Update failed! Could not update transaction with id ${transactionId}`;
        return updatedInfo.value;
    }

}

export default exportedMethods;

