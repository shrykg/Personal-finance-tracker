import * as XLSX from 'xlsx';
import { transactionData } from '../data/index.js';

// Define the name of the sheet

async function exportToExcel(user_id) {
    try {
        const wb = XLSX.utils.book_new();
        const sheetName = 'Transactions';

        // Define the column headers for the sheet
        const headers = ['Transaction Date', 'Amount', 'Description', 'Category', 'Payment Type'];
        // Retrieve all the transactions from the database
        //const transactions = await transaction_collection.find({}).toArray();

        const transactions = await transactionData.getAllTransactions(user_id);

        // Convert the transactions data to a format that can be written to an Excel sheet
        const data = transactions.map(transaction => [transaction.transaction_date, transaction.amount, transaction.description, transaction.category, transaction.paymentType]);

        // Create a new worksheet
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Save the workbook to a file
        XLSX.writeFile(wb, 'transactions.xlsx');

        console.log('Export to Excel complete.');

        return true;
        // Close the database connection
    } catch (err) {
        console.error(err);
    }
}

export { exportToExcel }; 