/*Show and hide menu for looged user. */
function displayMenu() {
	element = document.getElementById('user_actions');
	if (element.style.display == "block") {
		document.getElementById('user_actions').style.display='none';
	}
	else {
		document.getElementById('user_actions').style.display='block';
	}
} 

function hideMenu(e) {
	if (e.target != document.getElementById('user_actions')
		&& e.target != document.getElementById('actions_button1') 
		&& e.target != document.getElementById('actions_button2') ) {
			document.getElementById('user_actions').style.display='none';			
	}
}

/* Changing display property of element with id = id*/
function change(id) {
	element = document.getElementById(id);			
	if (element.style.display == 'none') {
		element.style.display = 'block';
	}
	else {
		element.style.display = 'none';				
	}
}

/* Changing display property of element with id = id*/
function change_add_new() {
	element = document.getElementById('add_new');		
	button = document.getElementById('add_new_button');

	if (element.style.display == 'block') {
		element.style.display = 'none';				
		button.style.background = 'url(img/add_new.png)';
	}
	else {
		element.style.display = 'block';
		button.style.background = 'url(img/hide_add_new.png)';
	}
}
