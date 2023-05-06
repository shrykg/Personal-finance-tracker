
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
        return result;
    },

    async getAllTransactions(userId) {
        userId = validation.checkId(userId, 'User ID')
        const transactionCollections = await transactions()
        var result = await transactionCollections
            .find({ user_id: new ObjectId(userId) })
            .toArray();
        return result
    },


    async getTransaction(transactionId) {
        transactionId = validation.checkId(transactionId, 'Transaction ID')
        const transactionCollections = await transactions()
        const transaction = await transactionCollections.findOne({ _id: new ObjectId(transactionId) })
        if (!transaction) {
            throw 'Error: Transaction not found'
        }
        return transaction
    },

    async addTransaction(userId, paymentType, amount, description, category, date) {

        userId = validation.checkId(userId,'User ID')
        paymentType = validation.checkString(paymentType,'Payment Type')
        amount = validation.checkNumber(amount,'Amount')
        description = validation.checkString(description,'Description')
        category = validation.checkString(category,'Category')
        date = validation.checkDate(date,'Date')
       
        let newTransaction = {
            user_id: new ObjectId(userId),
            transaction_date: date,
            amount: amount,
            description: description,
            category: category,
            paymentType: paymentType,
        }
        
        const transactionCollections = await transactions()
        const newInsertInformation = await transactionCollections.insertOne(newTransaction)
        if (!newInsertInformation) {
            throw 'Could not add transaction'
        }
        const newId = newInsertInformation.insertedId;
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
        updatedTransaction.transaction_date = validation.checkDate(updatedTransaction.transaction_date, 'Transaction Date')
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

    async getTransactionsByDateRange(userId, startDate, endDate) {
        userId = validation.checkId(userId, 'User ID');
        const transactionCollections = await transactions();
        const transactions1 = await transactionCollections.find({
            user_id: new ObjectId(userId),
            transaction_date: { $gte: startDate, $lte: endDate },
        }).toArray();

        const transformedResult = transactions1.map((transaction) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date1 = new Date(transaction.transaction_date);
            const formattedDate = date1.toISOString(options);
            return {
                ...transaction,
                // amount: amount,
                transaction_date: formattedDate
            };
        });

        // console.log("Transformed result:", transformedResult); // Add this line

        return transformedResult;

    },

    async getTransactionsByDateRangeAndCategory(userId, startDate, endDate, category) {
        userId = validation.checkId(userId, 'User ID');
        // console.log("Before");
        const transactionCollections = await transactions();
        // console.log("After");


        // Create an object to hold the filter criteria
        const filter = { user_id: new ObjectId(userId) };
        if (startDate && endDate) {
            filter.transaction_date = { $gte: startDate, $lte: endDate };
        }
        if (category) {
            filter.category = category;
        }

        // Use the filter object to find transactions that match the criteria
        const transactions1 = await transactionCollections.find(filter).toArray();
        // console.log('filtered transactions')
        // console.log(transactions1)

        const transformedResult = transactions1.map((transaction) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date2 = new Date(transaction.transaction_date);
            const formattedDate = date2.toISOString(options);
            return {
                ...transaction,
                transaction_date: formattedDate
            };
        });

        // console.log("Transformed result:", transformedResult);

        return transformedResult;
    },

    async getTransactionsByDateRangeAndCategoryWithoutDateFormat(userId, startDate, endDate, category) {
        userId = validation.checkId(userId, 'User ID');
        // console.log("Before");
        const transactionCollections = await transactions();
        // console.log("After");


        // Create an object to hold the filter criteria
        const filter = { user_id: new ObjectId(userId) };
        if (startDate && endDate) {
            filter.transaction_date = { $gte: startDate, $lte: endDate };
        }
        if (category) {
            filter.category = category;
        }

        // Use the filter object to find transactions that match the criteria
        const transactions1 = await transactionCollections.find(filter).toArray();
        console.log('filtered transactions')
        console.log(transactions1)


        // console.log("Transformed result:", transformedResult);

        return transactions1;
    }



}

export default exportedMethods;

