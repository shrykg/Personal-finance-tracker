//registration form

// Select the form and attach a submit event listener

const form = document.getElementById('registration-form');
const login_form = document.getElementById('login-form');
if (form) {
    form.addEventListener('submit', function (event) {
        let errorContainer = document.querySelector('#error-container');
        errorContainer.innerHTML = '';
        errorContainer.hidden = true;
        console.log('in form')
        // Prevent the form from being submitted
        event.preventDefault();
        //console.log('in submit handle')
        // Validate the form fields

        const firstNameInput = document.querySelector('#firstname').value;
        const lastNameInput = document.querySelector('#lastname').value;
        const emailAddressInput = document.querySelector('#email').value;
        const passwordInput = document.querySelector('#password_initial').value;
        const confirmPasswordInput = document.querySelector('#password_confirm').value;
        const dob = document.querySelector('#dob').value;
        let errors = [];

        if (firstNameInput === '') {
            errors.push('Firstname is required');
        }
        try {
            validateFirstName(firstNameInput);
        }
        catch (e) {
            errors.push(e);
        }

        if (lastNameInput === '') {
            errors.push('Lastname is required');
        }
        try {
            validateLastName(lastNameInput);
        }
        catch (e) {
            errors.push(e);
        }

        if (emailAddressInput === '') {
            errors.push('Email address is required');
        } else if (!isValidEmail(emailAddressInput)) {
            errors.push('Email address is invalid');
        }

        if (passwordInput === '') {
            errors.push('Password is required');
        } else if (!isValidPassword(passwordInput)) {
            errors.push('Password must be at least 8 characters long and contain a combination of letters, numbers, and special characters and atleast 1 Uppercase letter');
        }

        if (confirmPasswordInput === '') {
            errors.push('Confirm password is required');
        } else if (passwordInput !== confirmPasswordInput) {
            errors.push('Passwords do not match');
        }


        if (dob === '') {
            errors.push('Please enter a valid dob');
        }
        let age = validateDOB(dob);

        if (age < 13) {
            errors.push('You must be 13 years or older to register on the website !')
        }

        // Display error messages if there are any
        if (errors.length > 0) {
            errorContainer.hidden = false;
            errors.forEach(function (error) {
                const errorElement = document.createElement('div');
                errorElement.classList.add('error');
                errorElement.innerText = error;

                errorContainer.appendChild(errorElement);
            });

        } else {
            // If all fields are valid, submit the form to the server
            form.submit();
        }
    });
}

//console.log(form)
if (login_form) {
    login_form.addEventListener('submit', function (event) {
        // Prevent the form from being submitted
        event.preventDefault();
        // Validate the form fields

        const emailAddressInput = document.querySelector('#username').value;
        const passwordInput = document.querySelector('#password').value;

        let errors = [];

        if (emailAddressInput === '') {
            errors.push('Email address is required');
        } else if (!isValidEmail(emailAddressInput)) {
            errors.push('Email address is invalid');
        }

        if (passwordInput === '') {
            errors.push('Password is required');
        }

        // Display error messages if there are any
        if (errors.length > 0) {
            const errorContainer = document.querySelector('#error-container-login');
            errorContainer.innerHTML = '';

            errors.forEach(function (error) {
                const errorElement = document.createElement('div');
                errorElement.classList.add('error');
                errorElement.innerText = error;

                errorContainer.appendChild(errorElement);
            });

        } else {
            // If all fields are valid, submit the form to the server
            login_form.submit();
        }
    });
}




// Validate the email address
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate the password
function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function validateFirstName(firstName) {
    const regex = /^[a-zA-Z]{2,25}$/;
    if (!regex.test(firstName)) {
        throw ("First name must be a valid string with at least 2 characters and at most 25 characters.");
    }
}

function validateLastName(lastName) {
    const regex = /^[a-zA-Z]{2,25}$/;
    if (!regex.test(lastName)) {
        throw ("Last name must be a valid string with at least 2 characters and at most 25 characters.");
    }
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    if (!regex.test(email)) {
        throw ("Invalid email address.");
    }
}

function validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
        throw ("Password must be a valid string with at least 8 characters, containing at least one uppercase letter, one number, and one special character.");
    }
}

function validateDOB(dob) {
    const birthdate = new Date(dob);
    // calculate the age
    const ageInMilliseconds = Date.now() - birthdate.getTime();
    const ageDate = new Date(ageInMilliseconds);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    // display the age
    return age;
}


