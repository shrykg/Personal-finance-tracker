

$(document).ready(function() {
    if ($('.transaction-row').length == 0) {
        // Hide the filter form
        $('#filter-form').css('display', 'none');
      }
    // Attach event listener to the form submission
    $("#filter-form").submit(function(event) {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Get the form input values
      let startDate = $("#start-date-input").val();
      let endDate = $("#end-date-input").val();
      const category = $("#category-input").val();

      // Validate the input values
      let errors = [];
      
      let today = moment().format("YYYY-MM-DD");
      let minDate = moment("2021-01-01").format("YYYY-MM-DD");  
    if (startDate) {
        let isValidFormatStart = moment(startDate, "YYYY-MM-DD", true).isValid();
        if (!isValidFormatStart) {
            errors.push("Start date must be in the format yyyy-mm-dd.")
        } 
        let start = moment(startDate).format("YYYY-MM-DD");
        if(moment(startDate).isAfter(today)){
            errors.push("Transaction date must be today or before today.");
        }
        if(moment(startDate).isBefore(minDate)){
            errors.push("Transaction date must be within the last 2 years from today.");
        }
    }
    if (endDate) {
        let isValidFormatEnd = moment(endDate, "YYYY-MM-DD", true).isValid();
        if (!isValidFormatEnd) {
        errors.push("End date must be in the format yyyy-mm-dd.")
        }
        let end = moment(endDate).format("YYYY-MM-DD");
        if(moment(endDate).isAfter(today)){
            errors.push("Transaction date must be today or before today.");
        }
        if(moment(endDate).isBefore(minDate)){
            errors.push("Transaction date must be within the last 2 years from today.");
        }
    }
    
       
      // Validate end date
      if (startDate && endDate) {
        let start = moment(startDate).format("YYYY-MM-DD");
        let end = moment(endDate).format("YYYY-MM-DD");
        if (end < start) {
            errors.push("End date cannot be before start date.");
          }
      }
      
      // Display errors or submit the form
      if (errors.length > 0) {
        // Display error messages
        const errorMessage = errors.join("<br>");
        $("#error-message").html(errorMessage).show();
      } else {
        // Submit the form
        $("#filter-form")[0].submit();
      }
    });
  });
  