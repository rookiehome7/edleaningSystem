function signUp(){
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  var userFirstName = document.getElementById("firstname_field").value;
  var userLastName = document.getElementById("lastname_field").value;
  var userRole = document.getElementById("role_field").value;
  if (userEmail && userPass && userFirstName && userLastNam && userRole)
  {
	firebase.auth().createUserWithEmailAndPassword(userEmail,userPass).catch(function(error){
			var errorCode = error.code;
			var errorMessage = error.message;
			window.alert("Error : " + errorMessage);

			console.log(error);
		});
	  insertData(userEmail,userPass,userFirstName,userLastName,userRole);
	  alert("Register Success");
	  //window.location.href = "login.html";
	setTimeout("location.href = 'index.html';",2000);
  }
  else
  {
  	window.alert("Please fill all form!!");
  }
	
}

function insertData(email,password,fname,lname,role){
	var firebaseRef = firebase.database().ref("users");
	firebaseRef.push({
		firstname : fname,
		lastname : lname,
		email : email,
		password : password,
		role : role
	});
	console.log("Insert Success");

}
