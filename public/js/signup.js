function signUp(){
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  var userFirstName = document.getElementById("firstname_field").value;
  var userLastName = document.getElementById("lastname_field").value;
  var userRole = document.getElementById("role_field").value;
  if (userEmail && userPass && userFirstName && userLastName && userRole)
  {
	firebase.auth().createUserWithEmailAndPassword(userEmail,userPass).then(function(){
		firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
		firstname : userFirstName,
		lastname : userLastName,
		role : userRole 
		}, function(error) {
			if (error) {
				alert("Data could not be saved."+error);
			} 
			else {
				alert("Register Successfully.");
				window.location = "login.html";
				//setTimeout("location.href = 'login.html';",2000);
			}
		});
	}).catch(function(error){
			var errorCode = error.code;
			var errorMessage = error.message;
			window.alert("Error : " + errorMessage);
			console.log(error);
		});
  }
  else
  {
  	window.alert("Please fill all forms!");
  }	
}

