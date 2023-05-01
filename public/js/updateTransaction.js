$("#edit-transaction-form").submit(function(event){
    event.preventDefault()
    console.log('Edit transaction tapped')
    submitData()
    
})

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
           console.log('success in request yo')
           window.location.href = '/transactions/seeAllTransaction';
       },
       error: function(error) {
           console.log(error);
       }
   });
}