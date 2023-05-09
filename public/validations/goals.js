let goalForm = document.getElementById("goal-form");
let goal_saving_form=document.getElementById("goal_saving_form");
if (goalForm) {
  goalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let errorDiv = document.getElementById("error");
    let err = [];
    errorDiv.hidden = true;
    errorDiv.innerHTML = "";

    let goalSelect = document.getElementById("goal-select").value.trim().toLowerCase();
    if (!goalSelect) { err.push("Please select a goal purpose"); }
    if (typeof goalSelect !== "string") { err.push("Please enter a valid goal purpose"); }
    if(goalSelect.length===0){err.push("Goal purpose cannot be empty string")}

    let validOptions = ["crush_credit_card_debt", "wipe_out_my_loans", "save_for_a_rainy_day", "prepare_for_retirement", "buy_a_home", "buy_a_car", "save_for_college", "take_a_trip", "improve_my_home", "something_else"];
    if (!validOptions.includes(goalSelect)) { err.push("Please select a valid goal purpose"); }
    


    let goalName = document.getElementById("goal_name").value.trim();
    if (!goalName) { err.push("Please provide a name for your goal"); }
    if (typeof goalName !== "string") { err.push("Please enter a valid goal name") }
    if(goalName.length===0){err.push("Goal name cannot be empty string")}
    let nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(goalName)) {
      err.push("Please enter a valid goal name");
    }

    let goalAmount = document.getElementById("goal_amount").value.trim();
    if (!goalAmount) { err.push("Please provide an amount for your goal"); }
    goalAmount = Number(goalAmount);
    if (isNaN(goalAmount) || goalAmount <= 0) { err.push("Please enter a valid amount."); }
    if (goalAmount > 999999999) { err.push("Enter amount under 9 digits only"); }

    let goalDate = document.getElementById("goal_date").value.trim();
    if (!goalDate) { err.push("Please provide a deadline for your goal"); }
    if (!typeof goalDate === 'string') { err.push("Enter date in only YYYY-MM-DD string format") }

    let isValidDate = moment(goalDate, "YYYY-MM-DD", true).isValid();
    if (isValidDate === false) { err.push("Please enter the deadline in YYYY-MM-DD format"); }
    goalDate = moment(goalDate).format("YYYY-MM-DD");
    let today = moment().format("YYYY-MM-DD");
    if (moment(goalDate).isBefore(today)) {
      err.push("Goal deadline cannot be earlier than today.");
    }
    let minDate = moment(today).add(6, 'months').format("YYYY-MM-DD");
    let maxDate = moment(today).add(20, 'years').format("YYYY-MM-DD");
    if (moment(goalDate).isBefore(minDate)) {
        err.push("Goal deadline must be at least 6 months from today.");    
    }
    if (moment(goalDate).isAfter(maxDate)) {
         err.push("Goal deadline cannot be more than 20 years from today.");
    }
    if (err.length > 0) {
      errorDiv.hidden = false;
      for (let i = 0; i < err.length; i++) {
        errorDiv.innerHTML += err[i] + "<br/>";
      }
    } else {
      errorDiv.hidden = true;
      goalForm.submit();
      goalForm.reset();
    }
  })
}
if(goal_saving_form){
  goal_saving_form.addEventListener('submit', (event) => {
    event.preventDefault();
    let errorDiv = document.getElementById("error");
    let err = [];
    errorDiv.hidden = true;
    errorDiv.innerHTML = "";

    
    let goalName = document.getElementById("goal_select").value.trim();
    if (!goalName) { err.push("Please provide a name for your goal"); }
    if (typeof goalName !== "string") { err.push("Please enter a valid goal name") }
    if(goalName.length===0){err.push("Goal name cannot be empty string")}
    let nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(goalName)) {
      err.push("Please enter a valid goal name");
    }

    let savings = document.getElementById("amount").value.trim();
    if (!savings) { err.push("Please provide an amount for your goal"); }
    savings = Number(savings);
    if (isNaN(savings) || savings <= 0) { err.push("Please enter a valid amount."); }
    if (savings > 999999999) { err.push("Enter amount under 9 digits only"); }

    if (err.length > 0) {
      errorDiv.hidden = false;
      for (let i = 0; i < err.length; i++) {
        errorDiv.innerHTML += err[i] + "<br/>";
      }
    } else {
      errorDiv.hidden = true;
      goal_saving_form.submit();
      goal_saving_form.reset();
    }
  });
}