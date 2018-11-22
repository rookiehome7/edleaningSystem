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
        //alert("Teacher");
      }
      else if (snapshot.val().role == "Student") {
        alert("Access Denied!!");
        window.location = "index.html";
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

function logout(){
  firebase.auth().signOut();
  window.location = "login.html";
}
