firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/'+user.uid+'/role').once('value', (snapshot) => {
      if (snapshot.val() == "Teacher"){
        document.getElementById("user_div_teacher").style.display = "block";
        document.getElementById("user_div_student").style.display = "none";
        //alert("Teacher");
      }
      else if (snapshot.val() == "Student") {
        document.getElementById("user_div_teacher").style.display = "none";
        document.getElementById("user_div_student").style.display = "block";
        //alert("Student");
      }
      else {
        alert(snapshot.exists() ? snapshot.val() : "no user role");
      }
      //alert(snapshot.exists() ? snapshot.val() : "no user role");
    }, (error) => {
      if(error) {
      }
    });

    if(user != null){
      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Hello, " + email_id;
      document.getElementById("user_para1").innerHTML = "Hello, " + email_id;
    }
  } 
  else {
    window.location = "login.html";
  }
});




function login(){
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : " + errorMessage);
    // ...
  });

}

function logout(){
  firebase.auth().signOut();
}
