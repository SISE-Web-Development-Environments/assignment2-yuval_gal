// // # I took it from : https://www.sitepoint.com/basic-jquery-form-validation-tutorial/

// // Wait for the DOM to be ready
// $(function() {
//     // Initialize form validation on the registration form.
//     // It has the name attribute "registration"
//     $("form[name='signup-form']").validate({
//       // Specify validation rules
    //   rules: {
    //     // The key name on the left side is the name attribute
    //     // of an input field. Validation rules are defined
    //     // on the right side
    //     email: {
    //       required: true,
    //       // Specify that email should be validated
    //       // by the built-in "email" rule
    //       email: true
    //     },
    //     fullName: {
    //         required: true,
    //         letters:true
    //       },
    //       userName: {
    //         required: true,
    //       },
    //       bDay: {
    //         required: true,
            
    //       },
    //       password: {
    //         required: true,
    //         minlength: 6,
    //         lettersNumbers: true
    //     },
    //     checkPassword: {
    //       required: true,
    //       minlength: 6,
    //       lettersNumbers: true
    //     }
    //   },
//       // Specify validation error messages
      
      
    //   messages: {
    //     fullName: "Please enter your full name",
    //     userName: "Please enter your username",
    //     bDay: "Please enter your bDay",
    //     password: {
    //         required: "Please provide a password",
    //         minlength: "Your password must be at least 6 characters long"
    //         },
    //     email: "Please enter a valid email address"
    //   },
//       // Make sure the form is submitted to the destination defined
//       // in the "action" attribute of the form when valid
//       submitHandler: function(form) {
//         form.submit();
//       }
//     });
//   });


// //   I took from : https://stackoverflow.com/questions/2794162/jquery-validation-plugin-accept-only-alphabetical-characters
  
// jQuery.validator.addMethod("letters", function(value, element) {
//     return this.optional(element) || /^[a-z]+$/i.test(value);
//   }, "Letters only please"); 

//   jQuery.validator.addMethod("lettersNumbers", function(value, element) {
//     return /[a-z].*[0-9]|[0-9].*[a-z]/i.test(value); 
//   }, "Letters and numbers only please"); 



  
	$.validator.setDefaults({
		submitHandler: function() {
			alert("submitted!");
		}
	});

	$().ready(function() {
		// validate the comment form when it is submitted
		$("form[name='signUpForm']").validate();

		// validate signup form on keyup and submit
		$("form[name='signUpForm']").validate({
            rules: {
                // The key name on the left side is the name attribute
                // of an input field. Validation rules are defined
                // on the right side
                email: {
                  required: true,
                  // Specify that email should be validated
                  // by the built-in "email" rule
                  email: true
                },
                fullName: {
                    required: true,
                    letters:true
                  },
                  userName: {
                    required: true,
                  },
                  bDay: {
                    required: true,
                    
                  },
                  password: {
                    required: true,
                    minlength: 6,
                    lettersNumbers: true
                },
                checkPassword: {
                  required: true,
                  minlength: 6,
                  lettersNumbers: true,
                  equalTo:"#password"
                }
              },
			messages: {
                messages: {
                    fullName: "Please enter your full name",
                    userName: "Please enter your username",
                    bDay: "Please enter your bDay",
                    password: {
                        required: "Please provide a password",
                        minlength: "Your password must be at least 6 characters long"
                        },
                    email: "Please enter a valid email address"
                  },
				password: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long"
				},
				confirm_password: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long",
					equalTo: "Please enter the same password as above"
				},

			}
		});

		// propose username by combining first- and lastname
		$("#username").focus(function() {
			var firstname = $("#firstname").val();
			var lastname = $("#lastname").val();
			if (firstname && lastname && !this.value) {
				this.value = firstname + "." + lastname;
			}
		});

		//code to hide topic selection, disable for demo
		var newsletter = $("#newsletter");
		// newsletter topics are optional, hide at first
		var inital = newsletter.is(":checked");
		var topics = $("#newsletter_topics")[inital ? "removeClass" : "addClass"]("gray");
		var topicInputs = topics.find("input").attr("disabled", !inital);
		// show when newsletter is checked
		newsletter.click(function() {
			topics[this.checked ? "removeClass" : "addClass"]("gray");
			topicInputs.attr("disabled", !this.checked);
		});
	});
	