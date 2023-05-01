let budget=document.getElementById("budget_form")

if(budget)
{
    budget.addEventListener('submit', (event) => {
        event.preventDefault();
        let errorDiv=document.getElementById("error");
        let err=[];
        errorDiv.hidden=true;
        errorDiv.innerHTML="";

        let amount = document.getElementById("amount").value.trim();
        if(!amount){err.push("Please Provide amount")}
        amount = Number(amount);
        if (isNaN(amount) || amount<=0 ) { err.push("Please Enter a valid amount.") }
        if(amount>999999999){err.push("Enter amount under 9 digits only")}
        
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


        let start_Date= document.getElementById("start_Date").value.trim()
        let end_Date =document.getElementById("end_Date").value.trim()

        if(!start_Date){err.push("Please select start_date")}
        if(!end_Date){err.push("Please select end_date")}
        if(start_Date.trim().length==0){err.push("Please Enter start_Date")}
        if(end_Date.trim().length==0){err.push("Please Enter end_Date")}

        if(!typeof start_Date==='string' || !typeof end_Date==='string'){err.push("Enter dates in only YYYY-MM-DD string format")}

        let isValidDate = moment(start_Date, "YYYY-MM-DD", true).isValid();
        if(isValidDate===false){err.push("Please Enter Start date in YYYY-MM-DD format")}

        isValidDate = moment(end_Date, "YYYY-MM-DD", true).isValid();
        if(isValidDate===false){err.push("Please Enter End date in YYYY-MM-DD format")}

        start_Date= moment(start_Date).format("YYYY-MM-DD");
        end_Date= moment(end_Date).format("YYYY-MM-DD");
        let today = moment().format("YYYY-MM-DD");
        let maxEndDate = moment(today).add(2, 'years').format("YYYY-MM-DD");

        if(moment(start_Date).isBefore(today))
        {
            err.push("Start date cannot be earlier than today.");
        }
        if (moment(today).isSame(end_Date)) 
        {
            err.push("End date cannot be today");
        }
        if(moment(end_Date).isBefore(today))
        {
            err.push("End date cannot be earlier than today.");
        }
        if(moment(end_Date).isBefore(start_Date))
        {
            err.push("End date cannot be earlier than start date.");
        }
        if(moment(end_Date).isAfter(maxEndDate))
        {
            err.push("End date cannot be more than 2 years from today.");
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
            budget.submit();
        }
    })
}