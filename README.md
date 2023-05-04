# Personal-finance-tracker
Personal finance tracker


@Yuvaraj - login back button bug
Login page isn't secure. Dashboard is being rendered by clicking back button.
Add logout button and forgot password

<!-- !!Validation errors: -->
Settings.handlebars
registration.handlebars
all update functions (currency symbol giving error on update transaction)
updateTransaction.handlebars {
    Error: Bad value $9000 for attribute value on element input: Expected a minus sign or a digit but saw $ instead.
    From line 35, column 5; to line 35, column 113
    <input type="number" id="amount" name="amount" placeholder="Enter amount" step="0.01" value="$9000" required };