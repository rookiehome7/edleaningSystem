firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/'+user.uid).once('value', (snapshot) => {

      var firstname = snapshot.val().firstname;
      var lastname = snapshot.val().lastname;
      document.getElementById("user_name").innerHTML = "Hello, " + firstname + " " + lastname;

      if (snapshot.val().role == "Teacher"){
        console.log("Test");
        document.getElementById("user_div_teacher").style.display = "block";
        
        const quizlistUI = document.getElementById("quizName");
        // initTeacher
        
        firebase.database().ref('quiz')
                            .orderByChild('create_by')
                            .equalTo(user.uid)
                            .on('value', (snapshot)=>{
                              console.log(snapshot.val());
                              
                                                      $('#entries').html('Loading...');
                                                      var html = '';
                                                      snapshot.forEach((quiz_snapshot)=>
                                                        {
                                                        console.log(quiz_snapshot.val());
                                                        let quiz = quiz_snapshot.val();
                                                        html = '<div class="col-md-4">' +
                                                            '<a href="quiz.html?id=' + quiz.name + '" style="text-decoration:none!important;">' +
                                                              '<div class="panel panel-info">' +
                                                                '<div class="panel-heading">' +
                                                                '<h3 class="panel-title">' + excerpt(quiz.name, 140) + '</h3>' +
                                                                '</div>' +
                                                                '<div class="panel-body">' +
                                                                '<small>By ' + firstname + ' ' + lastname +  ' | ' + datetimeFormat(quiz.create_time) +'</small>' +
                                                                '<hr><p>' + quiz.description + '</p>' +
                                                                '</div>' +
                                                              '</div>' +
                                                            '</a>' +
                                                            '</div>' + html; // prepend the entry because we need to display it in reverse order
                                                        }); $('#entries').html(html);
                                                    });
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
function datetimeFormat(timestamp) {
    var dateObj = new Date(timestamp);
    var en_month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return dateObj.getDate() + ' ' + en_month[dateObj.getMonth()] + ' ' + pad2Digit(dateObj.getFullYear()) + ' ' + pad2Digit(dateObj.getHours()) + ':' + pad2Digit(dateObj.getMinutes());
}



function logout(){
  firebase.auth().signOut();
  window.location = "login.html";
}


function savequiz(){

  var uid = firebase.auth().currentUser.uid
  var quizname = document.getElementById("quiztitle_field").value;
  var quizdescription = document.getElementById("description_field").value;
  var now = Date.now();

  firebase.database().ref('quiz').push({
    name : quizname,
    description : quizdescription,
    create_time : now,
    create_by : uid
    }, function(error) {
      if (error) {
        alert("Data could not be save."+error);
      } 
      else {
        alert("Create quiz Successfully.");
        //setTimeout("location.href = 'login.html';",2000);
      }
    });
}