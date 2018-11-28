firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/'+user.uid).once('value', (snapshot) => {

      var firstname = snapshot.val().firstname;
      var lastname = snapshot.val().lastname;
      document.getElementById("user_name").innerHTML = "Hello, " + firstname + " " + lastname;

      if (snapshot.val().role == "Teacher"){
        asTeacher();
        //alert("Teacher");
      }
      else if (snapshot.val().role == "Student") {
        asStudent(user.uid);
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


function asTeacher(){
  document.getElementById("user_div_teacher").style.display = "block";
  document.getElementById("user_div_student").style.display = "none";
  document.getElementById("nav_div_teacher").style.display = "block";
  document.getElementById("nav_div_teacher1").style.display = "block";

  }


function asStudent(userid)
  {
  document.getElementById("user_div_teacher").style.display = "none";
  document.getElementById("user_div_student").style.display = "block";
  document.getElementById("nav_div_teacher").style.display = "none";
  document.getElementById("nav_div_teacher1").style.display = "none";

        // initTeacher
        
  firebase.database().ref('users/'+userid+'/answer/')
                      .on('value', (snapshot)=>{
                        console.log(snapshot.val());
                                              $('#quizplaystudent').html('Loading...');
                                              var html = '';
                                              snapshot.forEach((user_snapshot)=>
                                                {
                                                console.log(user_snapshot.val());
                                                let useranswer = user_snapshot.val();
                                                firebase.database().ref('quiz/'+ useranswer.quiz).on('value', (quiz_snapshot)=>{
                                                      quiz = quiz_snapshot.val();
                                                      html = '<div class="col-md-5">' +
                                                            '<div class="panel panel-info">' +
                                                              '<div class="panel-heading">' +
                                                              '<h3 class="panel-title">' + 'Quiz name:' + quiz.name + '</h3>' +
                                                              '</div>' +
                                                              '<div class="panel-body">' +
                                                              'Score:' + useranswer.score +'/' + useranswer.answer.length   +
                                                              '<p>Session ID:' + useranswer.session + ' | Play Time:' + datetimeFormat(useranswer.create_time) + '</p><hr>'  +
                                                              '</div>' +
                                                            '</div>' +

                                                          '</div>' + html; // prepend the entry because we need to display it in reverse order
                                                          $('#quizplaystudent').html(html);
                                                      }); 
                                                
                                            });
                                          });
}


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



// For query quiz 
function datetimeFormat(timestamp) {
    var dateObj = new Date(timestamp);
    var en_month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return dateObj.getDate() + ' ' + en_month[dateObj.getMonth()] + ' ' + pad2Digit(dateObj.getFullYear()) + ' ' + pad2Digit(dateObj.getHours()) + ':' + pad2Digit(dateObj.getMinutes());
}
function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}
function excerpt(text, length) {
    text = strip(text);
    text = $.trim(text); //trim whitespace
    if (text.length > length) {
        text = text.substring(0, length - 3) + '...';
    }
    return text;
}
function pad2Digit(num) {
    return ('0' + num.toString()).slice(-2);
}
