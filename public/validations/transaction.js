let transaction=document.getElementById("transaction_form")

if(transaction)
{
    transaction.addEventListener('submit', (event) => {
        event.preventDefault();
        let errorDiv=document.getElementById("error");
        let err=[];
        errorDiv.hidden=true;
        errorDiv.innerHTML="";

        let description=document.getElementById("description").value;
        if (!description) {err.push('Description is not provided.')} 
        if (typeof description !== 'string'){err.push('Description must be a string.')}
        if (description.trim().length === 0) {err.push('Description must not be an empty string.')} 
        if (!/[a-zA-Z]/.test(description)) {
        err.push('Description must contain at least one alphabetical character.')}
        const words = description.trim().split(/\s+/);
        if (words.length > 25) {
        err.push("Description must have less than 25 words")}


        let category = document.getElementById("category").value.trim();
        if(!category){err.push("Please select category")}
        if(!typeof category==='string'){err.push("Select valid category")}
        let validCategories = [
            "groceries",
            "shopping",
            "eating_out",
            "bills",
            "transportation",
            "entertainment",
            "travel",
            "healthcare",
            "education",
            "miscellaneous"
            ];
        if (!validCategories.includes(category.toLowerCase())) { err.push("Please select a valid category.");}

        let amount = document.getElementById("amount").value.trim();
        if(!amount){err.push("Please Provide amount")}
        amount = Number(amount);
        amount = Number(amount.toFixed(2))
        if (isNaN(amount) || amount<=0 ) { err.push("Please Enter a valid amount.") }
        if(amount>999999999){err.push("Enter amount under 9 digits only")}  

        let transaction_date=document.getElementById("transaction_date").value.trim();
        if(!transaction_date){err.push("Please select transaction_date")}
        if(transaction_date.trim().length==0){err.push("Please Enter transaction_date")}
        
        if(!typeof transaction_date==='string'){err.push("Enter date in only YYYY-MM-DD string format")}
        let isValidDate = moment(transaction_date, "YYYY-MM-DD", true).isValid();
        if(isValidDate===false){err.push("Please Enter date in YYYY-MM-DD format")}
        
        transaction_date= moment(transaction_date).format("YYYY-MM-DD");
        let today = moment().format("YYYY-MM-DD");
        let minDate = moment("2021-01-01").format("YYYY-MM-DD");
        if(moment(transaction_date).isAfter(today)){
            err.push("Transaction date must be today or before today.");
        }
        if(moment(transaction_date).isBefore(minDate)){
            err.push("Transaction date must be within the last 2 years from today.");
        }
        if(err.length>0)
            {
                errorDiv.hidden=false
                for(let i=0;i<err.length;i++)
                {
                    errorDiv.innerHTML+= err[i] + "</br>"
                }
            }
            else
            {
                transaction.submit();
            }
})
}