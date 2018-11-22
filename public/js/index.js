firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/'+user.uid).once('value', (snapshot) => {

      var firstname = snapshot.val().firstname;
      var lastname = snapshot.val().lastname;
      document.getElementById("user_name").innerHTML = "Hello, " + firstname + " " + lastname;

      if (snapshot.val().role == "Teacher"){
        document.getElementById("user_div_teacher").style.display = "block";
        document.getElementById("user_div_student").style.display = "none";

        document.getElementById("nav_div_teacher").style.display = "block";
        document.getElementById("nav_div_teacher1").style.display = "block";
        document.getElementById("nav_div_teacher2").style.display = "block";
        document.getElementById("nav_div_student").style.display = "none";
        //alert("Teacher");
      }
      else if (snapshot.val().role == "Student") {
        document.getElementById("user_div_teacher").style.display = "none";
        document.getElementById("user_div_student").style.display = "block";

        document.getElementById("nav_div_teacher").style.display = "none";
        document.getElementById("nav_div_teacher1").style.display = "none";
        document.getElementById("nav_div_teacher2").style.display = "none";
        document.getElementById("nav_div_student").style.display = "block";
        //alert("Student");
      }
      else {
        alert(snapshot.exists() ? snapshot.val().role : "no user role");
      }
    }, (error) => {
      if(error) {
      }
    });
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
  window.location = "login.html";
}
