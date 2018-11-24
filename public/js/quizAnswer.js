// var currentLocation = window.location;
// var c = currentLocation.searchParams.get('id');
// console.log(c);




firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/'+user.uid).once('value', (snapshot) => {

      var firstname = snapshot.val().firstname;
      var lastname = snapshot.val().lastname;
      document.getElementById("user_name").innerHTML = "Hello, " + firstname + " " + lastname;

      if (snapshot.val().role == "Teacher"){
        alert("Access Denied!!");
        window.location = "index.html";
        //alert("Teacher");
      }
      else if (snapshot.val().role == "Student") {
        answerquestion(user.uid);
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

function answerquestion(userid){
var urlParams = new URLSearchParams(window.location.search);
var sessionID = urlParams.get('id')
firebase.database().ref('sessions/'+ sessionID).on('value', (sessionsnapshot)=>{
                            quizkey = sessionsnapshot.val().session_quiz;
                            firebase.database().ref('quiz/'+quizkey).on('value', (snapshot)=>{
                            if (snapshot.val() == null){
                              alert("Session not found");
                              window.location= 'index.html';
                            }
                            else{
                              var questions = snapshot.val().questions;
                              quizPage(questions,quizkey,userid) ; 
                            }
                          });
});
}



// เก็บไว้เป็นน reference
// firebase.database().ref('quiz')
//                           .orderByChild('session/pin')
//                           .equalTo(urlParams.get('id'))
//                           .on('value', (snapshot)=>{
//                             if (snapshot.val() == null){
//                               alert("Session not found");
//                               window.location= 'index.html';
                              
//                             }
//                             else{
//                               var key = Object.keys(snapshot.val())[0]; // Get key
//                               //console.log(key);
//                               snapshot.forEach((quiz_snapshot)=>
//                                   {
//                                   console.log(quiz_snapshot.val());
//                                   var questions = quiz_snapshot.val().questions;
//                                   quizPage(questions,key,userid) ; 
//                                   });
//                             }
//                           });

function quizPage(questions,key,userid){
 //console.log("userID:"+userid+ " Quizkey:"+ key);
  (function() {
                                    var questionCounter = 0; //Tracks question number
                                    var selections = []; //Array containing user choices
                                    var quiz = $('#quiz'); //Quiz div object
                                    
                                    // Display initial question
                                    displayNext();
                                    
                                    // Click handler for the 'next' button
                                    $('#next').on('click', function (e) {
                                      e.preventDefault();
                                      
                                      // Suspend click listener during fade animation
                                      if(quiz.is(':animated')) {        
                                        return false;
                                      }
                                      choose();
                                      
                                      // If no user selection, progress is stopped
                                      if (isNaN(selections[questionCounter])) {
                                        alert('Please make a selection!');
                                      } else {
                                        questionCounter++;
                                        displayNext();
                                      }
                                    });
                                    
                                    // Click handler for the 'prev' button
                                    $('#prev').on('click', function (e) {
                                      e.preventDefault();
                                      
                                      if(quiz.is(':animated')) {
                                        return false;
                                      }
                                      choose();
                                      questionCounter--;
                                      displayNext();
                                    });
                                    
                                    // Click handler for the 'Start Over' button
                                    $('#start').on('click', function (e) {
                                      e.preventDefault();
                                      
                                      if(quiz.is(':animated')) {
                                        return false;
                                      }
                                      questionCounter = 0;
                                      selections = [];
                                      displayNext();
                                      $('#start').hide();
                                    });
                                    
                                    // Animates buttons on hover
                                    $('.button').on('mouseenter', function () {
                                      $(this).addClass('active');
                                    });
                                    $('.button').on('mouseleave', function () {
                                      $(this).removeClass('active');
                                    });
                                    
                                    // Creates and returns the div that contains the questions and 
                                    // the answer selections
                                    function createQuestionElement(index) {
                                      var qElement = $('<div>', {
                                        id: 'question'
                                      });
                                      
                                      var header = $('<h2>Question ' + (index + 1) + ':</h2>');
                                      qElement.append(header);
                                      
                                      var question = $('<p>').append(questions[index].question);
                                      qElement.append(question);
                                      
                                      var radioButtons = createRadios(index);
                                      qElement.append(radioButtons);
                                      
                                      return qElement;
                                    }
                                    
                                    // Creates a list of the answer choices as radio inputs
                                    function createRadios(index) {
                                      var radioList = $('<ul>');
                                      var item;
                                      var input = '';
                                      for (var i = 0; i < questions[index].choices.length; i++) {
                                        item = $('<li>');
                                        input = '<input type="radio" name="answer" value=' + i + ' />';
                                        input += questions[index].choices[i];
                                        item.append(input);
                                        radioList.append(item);
                                      }
                                      return radioList;
                                    }
                                    
                                    // Reads the user selection and pushes the value to an array
                                    function choose() {
                                      selections[questionCounter] = +$('input[name="answer"]:checked').val();
                                    }
                                    
                                    // Displays next requested element
                                    function displayNext() {
                                      quiz.fadeOut(function() {
                                        $('#question').remove();
                                        
                                        if(questionCounter < questions.length){
                                          var nextQuestion = createQuestionElement(questionCounter);
                                          quiz.append(nextQuestion).fadeIn();
                                          if (!(isNaN(selections[questionCounter]))) {
                                            $('input[value='+selections[questionCounter]+']').prop('checked', true);
                                          }
                                          
                                          // Controls display of 'prev' button
                                          if(questionCounter === 1){
                                            $('#prev').show();
                                          } else if(questionCounter === 0){
                                            
                                            $('#prev').hide();
                                            $('#next').show();
                                          }
                                        }else {
                                          var scoreElem = displayScore();
                                          quiz.append(scoreElem).fadeIn();
                                          $('#next').hide();
                                          $('#prev').hide();
                                          $('#start').show();
                                        }
                                      });
                                    }
                                    
                                    // Computes score and returns a paragraph element to be displayed
                                    function displayScore() {
                                      var score = $('<p>',{id: 'question'});
                                      
                                      var numCorrect = 0;
                                      for (var i = 0; i < selections.length; i++) {
                                        if (selections[i] === questions[i].correctAnswer) {
                                          numCorrect++;
                                        }
                                      }
                                      saveScore(numCorrect,selections,questions.length);
                                      return score;
                                    }

                                  function saveScore(score,selections,totalquestion) {
                                        var urlParams = new URLSearchParams(window.location.search);
                                        var sessionID = urlParams.get('id');

                                        firebase.database().ref('sessions/'+sessionID+'/sub_session').push({
                                            score : score,
                                            answer : selections,
                                            answer_by : userid,
                                            create_time : Date.now()
                                            }, function(error) {
                                              if (error) {
                                                alert("Error quiz not score."+error+" Please try again");
                                                window.location = "quizanswer.html?id="+sessionID;
                                              } 
                                              else {
                                               firebase.database().ref('users/'+userid+'/answer').push({
                                                  quiz : key,
                                                  session : sessionID,
                                                  score : score,
                                                  answer : selections,
                                                  create_time : Date.now()
                                                  }, function(error) {
                                                    if (error) {
                                                      alert("Data could not be save."+error);
                                                    } 
                                                    else {
                                                      alert('You got ' + score + ' questions out of ' + totalquestion + ' right!!!');
                                                      window.location = "index.html"
                                                    }
                                              });
                                                  
                                              }
                                        });
                                       
                                  }
                                  })();


}

function logout(){
  firebase.auth().signOut();
  window.location = "login.html";
}


