$('.del-btn').click(function() {
  const goalId = $(this).data('goal-id');
  const goalElement = $(this).closest('.goal-entry'); // Select the table row with the "goal-entry" class

  if (confirm("Are you sure you want to delete this transaction?")) {
    $.ajax({
      url: `/goals/remove/${goalId}`,
      type: 'GET',
      success: function(response) {
        if (response.status === 'success') {
          goalElement.remove(); // Remove the deleted entry's HTML element (the 'tr' element) from the page
        } else {
          console.error('Error deleting goal:', response);
          alert('Error deleting goal. Please try again later.');
        }
      },
      error: function(err) {
        console.error('Error deleting goal:', err);
        alert('Error deleting goal. Please try again later.');
      },
    });
  }
});
