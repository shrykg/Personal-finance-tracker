let budget=document.getElementById("budget_form")

if(budget)
{
    budget.addEventListener('submit', (event) => {
        event.preventDefault();
        let errorDiv=document.getElementById("error");
        let err=[];
        errorDiv.hidden=true;
        errorDiv.innerHTML="";

        let amount = Number(document.getElementById("amount").value);
        let category = document.getElementById("category").value.trim();
        let start_Date= document.getElementById("start_Date").value
        let end_Date=document.getElementById("end_Date").value
    
        if (isNaN(amount) || amount<=0) { err.push("Please enter a valid amount.") }
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
        if(err.length>0)
        {
            errorDiv.hidden=false
            for(let i=0;i<err.length;i++)
            {
                errorDiv.innerHTML+= err[i] + " "
            }
        }
        else
        {
            budget.submit();
        }
    })
}