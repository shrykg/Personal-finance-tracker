import transactionDataFunctions from './transactions.js'
import login_reg_functions from './login_registration.js'
import budgetDataFunctions from './budget.js';
import plaidDataFunctions from './plaid.js'

export const budgetData = budgetDataFunctions;
export const transactionData = transactionDataFunctions
export const login_reg_data = login_reg_functions
export const plaidData = plaidDataFunctions