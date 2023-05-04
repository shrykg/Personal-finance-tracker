(async ($) => {
    // Grab a Link token to initialize Link
    const createLinkToken = async () => {
      const res = await fetch("/api/create_link_token");
      const data = await res.json();
      const linkToken = data.link_token;
      localStorage.setItem("link_token", linkToken);
      return linkToken;
    };

    // Initialize Link
    const handler = Plaid.create({
      token: await createLinkToken(),
      onSuccess: async (publicToken, metadata) => {
        removeLink()
        addUnlinkAccountLink()
        console.log('on success create link token')
        await fetch("/api/exchange_public_token", {
          method: "POST",
          body: JSON.stringify({ public_token: publicToken }),
          headers: {
            "Content-Type": "application/json",
          },
        }); 
      },
      onEvent: (eventName, metadata) => {
        console.log("Event:", eventName);
        console.log("Metadata:", metadata);
      },
      onExit: (error, metadata) => {
        console.log(error, metadata);
      },
    });

  //   $("#link-account").on("click", function(event) {
  //     event.preventDefault(); // prevent the link from navigating to a different page
  //     // your code to handle the click event goes here
  //     console.log('to handle the on click event')
  //     handler.open();
  //     // $(this).remove()
  // });

  const removeLink = function() {
    $("#link-account").remove()
    $('.dropdown-content-bank').empty();
   }
  
   const addUnlinkAccountLink = function() {
    const transactionLink = $('<a>', {
      href: '/api/transactions',
      text: 'View All Bank Transactions'
    })
    const removeLink = $('<a>', {
      href: '',
      text: 'Remove account'
    })
    // add the new link to the dropdown content
    $('.dropdown-content-bank').append(transactionLink);
    $('.dropdown-content-bank').append(removeLink);
    // add event handlers to the links
    transactionLink.on('click', function(event) {
      event.preventDefault();
      window.location.href = $(this).attr('href');
    });
    
    removeLink.on('click', function(event) {
      event.preventDefault();
      // your code to remove the account goes here
      console.log('remove bank account tapped')
      deleteBankAccount()
    });
   }
  
   const addlinkAccountLink = function() {
    const addLink = $('<a>', {
      href: '',
      text: 'Link Account'
    })
    addLink.on('click', function(event) {
      event.preventDefault();
      // your code to remove the account goes here
      handler.open();
    });
    $('.dropdown-content-bank').append(addLink);
   }
  
    // Retrieves balance information
    const getBalance = async function () {
      const response = await fetch("/api/data", {
        method: "GET",
      });
      const data = await response.json();
  
      //Render response data
      const pre = document.getElementById("response");
      pre.textContent = JSON.stringify(data, null, 2);
      pre.style.background = "#F6F6F6";
    };
  
    // Retrieves balance information
    const fetchTransactions = async function () {
      const response = await fetch("/api/transactions", {
        method: "GET",
      });
      const data = await response.json();
     
    };
  
    const deleteBankAccount = async function () {
      $.ajax({
        url: '/api/removeBankAccount',
        type: 'DELETE',
        success: function(result) {
          console.log(result)
          console.log('successfully delete')
          // If the transaction was deleted successfully, remove the row from the table
          //  {{!-- window.location.href = '/dashboard'; --}}
          $('.dropdown-content-bank').empty();
          const addbankLink = $('<a>', {
            href: '',
            text: 'Link Account'
          })
          $('.dropdown-content-bank').append(addbankLink)
          addbankLink.on('click', function(event) {
               event.preventDefault()
               handler.open();
          })
        },
        error: function(error) {
               console.log(error);
           }
      });
    }
  
    // Check whether account is connected
    const getStatus = async function () {
      console.log('check whether account is connected???')
      const account = await fetch("/api/is_account_connected");
      const connected = await account.json();
      console.log('connected????')
      console.log(connected)
      if (connected.status == true) {
        // getBalance();
        removeLink()
        addUnlinkAccountLink()
      } else {
        removeLink()
        addlinkAccountLink()
      }
    };
  
    getStatus()


  })(jQuery);


 
