//fieldsets
var current_fs, next_fs, previous_fs; 
//fieldset properties to animate
var left, opacity, scale; 
//flag for animation
var animating; 
// flag to prevent going to next step if input is invalid 
var error = false;
// flag to prevent form from submitting in case of invalid input 
var bind = false; 

$("document").ready(function() {

	/*
	 * function to validate input email and check
	 * if it mathes abcd@domain.com pattern using regex 
	 **/
	function isEmail(email) {
  		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-]))+\.com$/;
  		return regex.test(email);
	}

	/*
	 * function to validate input name and check
	 * if contains only alphabets and spaces using regex 
	 **/	
	function isName(name) {
  		var regex = /^[a-zA-Z ]+$/;
  		return regex.test(name);
	}
	
	// add style to drop down list
	$(".drop-down-list").select2({
  		placeholder: "Select your branch",
  		minimumResultsForSearch: Infinity
	});

	// make radio buttons and checkboxes attractive
	$('.icheck-style').iCheck({
    	checkboxClass: 'icheckbox_square-blue',
    	radioClass: 'iradio_square-blue',
    });
	
	// when next button is clicked
	$(".next").click(function(){
		current_fs = $(this).parent();
		next_fs = $(this).parent().next();
		
		// if first fs is shown
		if ($("fieldset").index(current_fs) == 0) {
			// check if name field is empty or invalid
			var name = $("#name").val();
			if (name.length <= 0) {
				$("#name-err").text("Name is required");
				$("#name-err").css("visibility", "visible");
				error = true;
			} else if (!(isName(name))) {
				$("#name-err").text("Only alphabets and spaces are allowed");
				$("#name-err").css("visibility", "visible");
				error = true;
			} else {
				//
				$("#name-err").css("visibility", "hidden");
			}

			// check if branch selected
			var branch = $("#branch").val();
			if (branch.length <= 0) {
				$("#branch-err").text("Branch is required");
				$("#branch-err").css("visibility", "visible");
				error = true;
			} else {
				//
				$("#branch-err").css("visibility", "hidden");
			}

			// check if year is selected
			var year = $("input[name=year]:checked").val();
			if (typeof year == 'undefined') {
				$("#year-err").text("Year is required");
				$("#year-err").css("visibility", "visible");
				error = true;
			} else {
				$("#year-err").css("visibility", "hidden");
			}
			
		} else if ($("fieldset").index(current_fs) == 1) {
			// check if mobile num is entered
			var number = $("#number").val();
			if (number.length <= 0) {
				$("#number-err").text("Mobile Number is required");
				$("#number-err").css("visibility", "visible");
				error = true;
			} else {
				$("#number-err").css("visibility", "hidden");
			}
			
			// check if email is entered or is of valid type abcd@domain.com
			var email = $("#email").val();
			if (email.length <= 0) {
				$("#email-err").text("Email is required");
				$("#email-err").css("visibility", "visible");
				error = true;
			} else if (!isEmail(email)){
				$("#email-err").text("Invalid email address");
				$("#email-err").css("visibility", "visible");
				error = true;        		
        	}
			else {
				$("#email-err").css("visibility", "hidden");
			}
		}

		if(animating || error) {
			// reset error var
			error = false;

			return false;
		}
		animating = true;
		
		
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		
		//show the next fieldset
		next_fs.show(); 
		//hide the current fieldset with style ;)
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				// scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				// bring next_fs from the right(50%)
				left = (now * 50)+"%";
				// increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({
	        		'transform': 'scale('+scale+')',
	        		'position': 'absolute'
	      		});
				next_fs.css({'left': left, 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$(".previous").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();
		
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				// scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				// take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				// increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$(".submit").click(function() {
		// check if any of the preferences is selected
		var pref = $("input[type='checkbox']:checked").val();
		
		if (pref != "on") {
			// stop from submitting form
			bind = true;
			
			// display error message
			$("#pref-err").text("Preference is required");
			$("#pref-err").css("visibility", "visible");
		} else {
				$("#pref-err").css("visibility", "hidden");
					bind = false;
		}

		// check if answer is not empty
		var answer = $("#answer").val();
		if (answer.length <= 0) {
			// stop from submitting form
			bind = true;

			// display error message
			$("#answer-err").text("Your answer matters!");
			$("#answer-err").css("visibility", "visible");
		} else {
				$("#answer-err").css("visibility", "hidden");
				if (!bind)
					bind = false;
		}

		// stop form from submitting if bind var is true else restore its functionality
		if (bind) {
			$("form").submit(function(e){
				e.preventDefault(e);
			});
		} else {
			$("form").unbind('submit').submit();	
		}
	});

});