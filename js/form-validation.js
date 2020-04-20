// # I took it from : https://www.sitepoint.com/basic-jquery-form-validation-tutorial/
// Wait for the DOM to be ready
$(function() {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form[name='signUpForm']").validate({
      // Specify validation rules
      rules: {
        // The key name on the left side is the name attribute
        // of an input field. Validation rules are defined
        // on the right side
        fullName: "required",
        userName: "required",
        email: {
          required: true,
          // Specify that email should be validated
          // by the built-in "email" rule
          email: true
        },
        bDay: {
            required: true,
          },

        password: {
          required: true,
          minlength: 6
        },
      
        checkPassword: {
            required: true,
            minlength: 6
        },
      // Specify validation error messages
      messages: {
        fullName: "Please enter your firstname",
        bDay: "Please enter your bDay",
        password: {
          required: "Please provide a password",
          minlength: "Your password must be at least 6 characters long"
        },
        email: "Please enter a valid email address"
      },
      // Make sure the form is submitted to the destination defined
      // in the "action" attribute of the form when valid
      submitHandler: function(form) {
        form.submit();
      }
      });
  });