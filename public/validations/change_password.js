const form = document.getElementById('change-password-form');
if (form) {
    form.addEventListener('submit', function (event) {
        let errorContainer = document.querySelector('#error-container-change_password');
        errorContainer.innerHTML = '';
        errorContainer.hidden = true;
        // Prevent the form from being submitted
        event.preventDefault();
        //console.log('in submit handle')
        // Validate the form fields

        const old_passwordInput = document.querySelector('#current_pwd').value;
        const passwordInput = document.querySelector('#new_pwd').value;
        const confirmPasswordInput = document.querySelector('#confirm_new_pwd').value;
        let errors = [];

        if (old_passwordInput === '') {
            errors.push('Password is required');
        }

        if (passwordInput === '') {
            errors.push('Password is required');
        } else if (!isValidPassword(passwordInput)) {
            errors.push('Password must be at least 8 characters long and contain a combination of letters, numbers, and special characters');
        }

        if (confirmPasswordInput === '') {
            errors.push('Confirm password is required');
        } else if (passwordInput !== confirmPasswordInput) {
            errors.push('Passwords do not match');
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

        }

        else {
            // If all fields are valid, submit the form to the server
            form.submit();
        }
    });
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
        throw ("Password must be a valid string with at least 8 characters, containing at least one uppercase letter, one number, and one special character.");
    }
}