
import { ObjectId } from 'mongodb';

import { transactions } from '../config/mongoCollections.js';
import validation from '../validation.js'

const exportedMethods = {

    async getLatestTransactions(userId) {
        userId = validation.checkId(userId, 'User ID')
        const transactionCollections = await transactions()
        const result = await transactionCollections
            .find({ user_id: new ObjectId(userId) })
            .sort({ transaction_date: -1 })
            .limit(10)
            .toArray();

        // const transformedResult = result.map((transaction) => {
        //     const options = { year: 'numeric', month: 'long', day: 'numeric' };
        //     const formattedDate = transaction.transaction_date.toLocaleDateString("en-US", options);
        //     return {
        //         ...transaction,
        //         transaction_date: formattedDate
        //     };
        // });

        return result;
    },

    async getAllTransactions(userId) {
        userId = validation.checkId(userId, 'User ID')
        const transactionCollections = await transactions()
        var result = await transactionCollections
            .find({ user_id: new ObjectId(userId) })
            .toArray();
        // var transformedResult = result.map((transaction) => {
        //     const options = { year: 'numeric', month: 'long', day: 'numeric' };
        //     const formattedDate = transaction.transaction_date.toLocaleDateString("en-US", options);
        //     return {
        //         ...transaction,
        //         transaction_date: formattedDate
        //     };
        // })
        return result
    },


    async getTransaction(transactionId) {
        transactionId = validation.checkId(transactionId, 'Transaction ID')
        const transactionCollections = await transactions()
        const transaction = await transactionCollections.findOne({ _id: new ObjectId(transactionId) })
        if (!transaction) {
            throw 'Error: Transaction not found'
        }
        // const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // const formattedDate = transaction.transaction_date.toLocaleDateString("en-US", options);
        // transaction.transaction_date = formattedDate
        return transaction
    },

    async addTransaction(userId, paymentType, amount, description, category, date) {

        //console.log('start')
        //console.log(userId)
        //console.log(paymentType)
        //console.log(amount)
        //console.log(description)
        //console.log(category)
        //console.log(date)
        // userId = validation.checkId(userId,'User ID')
        // paymentType = validation.checkString(paymentType,'Payment Type')
        // amount = validation.checkNumber(amount,'Amount')
        // description = validation.checkString(description,'Description')
        // category = validation.checkString(category,'Category')
        // date = validation.checkString(date,'Date')
        //console.log('beforeeeee')
        let newTransaction = {
            user_id: new ObjectId(userId),
            transaction_date: date,
            amount: amount,
            description: description,
            category: category,
            paymentType: paymentType,
        }
        //console.log('afterrrrrr')
        const transactionCollections = await transactions()
        const newInsertInformation = await transactionCollections.insertOne(newTransaction)
        const newId = newInsertInformation.insertedId;
        //console.log(newId)
        //console.log(newId.toString())
        return await this.getTransaction(newId.toString())
    },


    async removeTransaction(transactionId) {
        transactionId = validation.checkId(transactionId, 'Transaction ID')

        const transactionCollections = await transactions()
        const deletionInfo = await transactionCollections.findOneAndDelete({
            _id: new ObjectId(transactionId)
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
            user_id: new ObjectId(updatedTransaction.user_id),
            transaction_date: updatedTransaction.transaction_date,
            amount: updatedTransaction.amount,
            description: updatedTransaction.description,
            category: updatedTransaction.category,
            paymentType: updatedTransaction.paymentType
        }
        const transactionCollections = await transactions()
        const updatedInfo = await transactionCollections.findOneAndReplace(
            { _id: new ObjectId(transactionId) },
            updatedTransactionData,
            { returnDocument: 'after' }
        )
        if (updatedInfo.lastErrorObject.n === 0)
            throw `Error: Update failed! Could not update transaction with id ${transactionId}`;
        return updatedInfo.value;
    },

    async getTransactionsByDateRange(userId, startDate, endDate, symbol) {
        userId = validation.checkId(userId, 'User ID');
        //console.log("Before");
        const transactionCollections = await transactions();
        //console.log("After");
        const transactions1 = await transactionCollections.find({
            user_id: new ObjectId(userId),
            transaction_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        }).toArray();

        // const transformedResult = transactions1.map((transaction) => {
        //     let amount = transaction.amount;
        //     // console.log(symbol);
        //     // console.log(symbol.length);
        //     amount = amount.slice(symbol.length);
        //     amount = parseInt(amount);
        //     const options = { year: 'numeric', month: 'long', day: 'numeric' };
        //     const formattedDate = transaction.transaction_date.toLocaleDateString("en-US", options);
        //     return {
        //         ...transaction,
        //         amount: amount,
        //         transaction_date: formattedDate
        //     };
        // });

        // console.log("Transformed result:", transformedResult); // Add this line

        return transactions1;

    },

    async getTransactionsByDateRangeAndCategory(userId, startDate, endDate, category) {
        userId = validation.checkId(userId, 'User ID');
        // console.log("Before");
        const transactionCollections = await transactions();
        // console.log("After");

        // Create an object to hold the filter criteria
        const filter = { user_id: new ObjectId(userId) };
        if (startDate && endDate) {
            filter.transaction_date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (category) {
            filter.category = category;
        }

        // Use the filter object to find transactions that match the criteria
        const transactions1 = await transactionCollections.find(filter).toArray();

        // const transformedResult = transactions1.map((transaction) => {
        //     const options = { year: 'numeric', month: 'long', day: 'numeric' };
        //     const formattedDate = transaction.transaction_date.toLocaleDateString("en-US", options);
        //     return {
        //         ...transaction,
        //         transaction_date: formattedDate
        //     };
        // });

        // console.log("Transformed result:", transformedResult);
        return transactions1;
    },

    // export_to_excel = (transactions, col_names, filePath) => {

    // }

    

}

export default exportedMethods;

