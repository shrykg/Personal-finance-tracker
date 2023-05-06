
$(document).ready(function() {

    function submitData() {
        const transactionId = $("#edit-transaction-button").data('transaction-id');
        console.log(transactionId)
        console.log($('#edit-transaction-form').serialize())
        $.ajax({
            url: '/transactions/' + transactionId,
            type: 'PUT',
            data: $('#edit-transaction-form').serialize(),
            success: function (result) {
                // Do something with the result
                window.location.href = '/transactions/seeAllTransaction';
            },
            error: function(error) {
                console.log(error);
            }
        });
     }

    // Handle form submission
    $('#edit-transaction-form').submit(function(event) {
      event.preventDefault();
  
      // Reset error messages
      $('#error-div').empty();
  
      // Get form data
      const formData = {
        description: $('#description').val().trim(),
        category: $('#category').val().trim(),
        amount: $('#amount').val().trim(),
        transaction_date: $('#transaction_date').val().trim(),
        paymentType: $('#paymentType').val().trim()
      };
  
      // Validate form data
      const errors = validate(formData);
  
      if (errors.length > 0) {
        // Display errors
        const errorList = $('<ul></ul>');
        errors.forEach(function(error) {
          errorList.append($('<li></li>').text(error));
        });
        $('#error-div').append(errorList);
      } else {
        // Submit form data
        // const transactionId = $('#edit-transaction-button').data('transaction-id');
        // const url = `/api/transactions/${transactionId}`;
  
        // $.ajax({
        //   url: url,
        //   type: 'PUT',
        //   contentType: 'application/json',
        //   data: JSON.stringify(formData),
        //   success: function(result) {
        //     window.location.href = '/dashboard';
        //   },
        //   error: function(jqXHR, textStatus, errorThrown) {
        //     console.log(jqXHR);
        //     console.log(textStatus);
        //     console.log(errorThrown);
        //   }
        // });
        submitData()
      }
    });
  
    // Validation function
    function validate(formData) {
      const errors = [];
  
      // Check for empty description
      if (!formData.description) {errors.push('Description is not provided.')} 
      if (typeof formData.description !== 'string'){errors.push('Description must be a string.')}
      if (formData.description.trim().length === 0) {errors.push('Description must not be an empty string.')} 
      if (!/[a-zA-Z]/.test(formData.description)) {
        errors.push('Description must contain at least one alphabetical character.')}
      const words = formData.description.trim().split(/\s+/);
      if (words.length > 25) {
        errors.push("Description must have less than 25 words")}
  
      // Check for invalid category
      const categories = [
        'groceries',
        'shopping',
        'eating_out',
        'bills',
        'transportation',
        'entertainment',
        'travel',
        'healthcare',
        'education',
        'miscellaneous'
      ];
      if (!categories.includes(formData.category.toLowerCase())) {
        errors.push('Invalid category selected.');
      }
        let category = formData.category.trim();
        if(!category){errors.push("Please select category")}
        if(typeof category!=='string'){errors.push("Select valid category")}
        
        
  
      // Check for non-numeric or negative amount
        let amount = formData.amount
        if(!amount){errors.push("Please Provide amount")}
        amount = Number(amount);
        amount = Number(amount.tofixed(2))
        if (isNaN(amount) || amount<=0 ) { errors.push("Please Enter a valid amount.") }  
        if(amount>999999999){errors.push("Enter amount under 9 digits only")}  
  
      // Check for invalid date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const isValidFormat = dateRegex.test(formData.transaction_date);

  if (!isValidFormat) {
    errors.push("Transaction date must be in the format yyyy-mm-dd.")
  }

  const minDate = new Date("2021-01-01");
  const maxDate = new Date();
  const transactionDate = new Date(formData.transaction_date);

  if (transactionDate < minDate) {
    errors.push("Transaction date must be after January 1, 2021.")
  } else if (transactionDate > maxDate) {
    errors.push("Transaction date cannot be a future date.")
  }
  
      // Check for invalid payment type
      const paymentTypes = ['Cash', 'Checking', 'Pending'];
      if (!paymentTypes.includes(formData.paymentType)) {
        errors.push('Invalid payment type selected.');
      }
  
      return errors;
    }
  
  });
  