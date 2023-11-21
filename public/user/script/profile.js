function validateForm() {
    const form = document.getElementById("signupForm");
    const nameField = document.getElementById("Fullname");
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("passworduser");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const generalError = document.getElementById("error");
  
    let isValid = true;
  
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    generalError.textContent = "";
  
    const namePattern = /^[a-z ,.'-]+$/i;
    if (!namePattern.test(nameField.value.trim())) {
      nameError.textContent =
        "Name must contain only letters and be at least 4 characters long";
      isValid = false;
    }
  
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(emailField.value)) {
      emailError.textContent = "Invalid email address";
      isValid = false;
    }
  
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(passwordField.value)) {
      passwordError.textContent =
        "Minimum eight characters, at least one letter, one number and one special character";
      isValid = false;
    }
  
    if (passwordField.value !== confirmPasswordField.value) {
      confirmPasswordError.textContent = "Passwords doesn't match";
      isValid = false;
    }
  
    if (isValid) {
      // If the form is valid, you can submit it programmatically
      form.submit();
    }
  }