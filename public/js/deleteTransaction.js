$('.del-btn').click(function() {
    // Get the transaction ID from the data-transactionId attribute
    let transactionId = $('.del-btn').data('transaction-Id');
    console.log(transactionId)

    if (confirm("Are you sure you want to delete this transaction?")) {
      // code to execute if user clicks "OK"
      $.ajax({
        url: '/transactions/' + transactionId,
        type: 'DELETE',
        success: function(result) {
          console.log('successfully delete')
          // If the transaction was deleted successfully, remove the row from the table
          //  {{!-- window.location.href = '/dashboard'; --}}
           $('button[data-transaction-Id="' + transactionId + '"]').closest('tr').remove();
           if ($('.transaction-row').length == 0) {
            // Hide the filter form
            $('#filter-form').css('display', 'none');
          }
        },
        error: function(error) {
               console.log(error);
           }
      });
    } else {
      // code to execute if user clicks "Cancel"
      
    }
    
  });

  