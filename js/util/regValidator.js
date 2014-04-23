//Registration validator module
function validate()
{
	var password = document.registerform.pass;
	var repassword = document.registerform.repass;
	var mail = document.registerform.email;

	if(validatePassword(password, repassword))
	{
		if(validateEmail(mail))
		{
			if (botBlocker()) 
			{
				return true;
			}
		}
	}
	return false;
}

function validatePassword(p1, p2)
{
	var passMinLength = 6;
	var passMaxLength = 20;
	var passLen = p1.value.length;
	if(passLen >= passMinLength && passLen <= passMaxLength)
	{
		if(p2.value.localeCompare(p1.value) == 0)
		{
			return true;
		}
		else
		{
			p2.focus();
			alert("Password must match!");
			return false;
		}
	}
	else
	{
		p1.focus();
		alert("Password must have at least 6 letters and must be shorter than 20 signs!");
		return false;
	}
}

function validateEmail(em)
{
	var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
	if(em.value.match(pattern))
		return true;
	else
	{
		alert("You have entered incorrect email address!");
		em.focus();
		return false;
	}
}

function botBlocker()
{
	var fVal = Number(document.getElementById("fNum").innerText);
	var sVal = Number(document.getElementById("sNum").innerText);
	var ans = Number(document.registerform.check.value); 
	console.log(fVal);
	console.log(sVal);
	console.log(ans);

	if (fVal+sVal == ans) 
	{
		return true;
	}
	else
	{
		alert("Wrong answer, try again!");
		return false;
	}
}


















