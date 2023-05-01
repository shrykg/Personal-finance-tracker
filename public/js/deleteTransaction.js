$('.del-btn').click(function() {
    // Get the transaction ID from the data-transactionId attribute
    var transactionId = $('.del-btn').data('transaction-Id');
    console.log(transactionId)
    
    // Send an AJAX request to delete the transaction
    $.ajax({
      url: '/transactions/' + transactionId,
      type: 'DELETE',
      success: function(result) {
        console.log('successfully delete')
        // If the transaction was deleted successfully, remove the row from the table
        //  {{!-- window.location.href = '/dashboard'; --}}
         $('button[data-transaction-Id="' + transactionId + '"]').closest('tr').remove();
      },
      error: function(error) {
             console.log(error);
         }
    });
  });

  