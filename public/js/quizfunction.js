

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

function myFunction() {
    var node = document.createElement("LI");
    var textnode = document.createTextNode("Water");
    node.appendChild(textnode);
    document.getElementById("myList").appendChild(node);
}


function viewquiz(){
  console.log("Test");
  var uid = firebase.auth().currentUser.uid
  const quizlistUI = document.getElementById("quizName");
  //alert (uid);
  firebase.database().ref('quiz')
                      .orderByChild('create_by')
                      .equalTo(uid)
                      .on('value', (snapshot)=>{
                                                snapshot.forEach((quiz_snapshot)=>
                                                  {
                                                  console.log(quiz_snapshot.val());
                                                  let quiz = quiz_snapshot.val();
                                                  let $li = document.createElement("m1");
                                                  let $li2 = document.createElement("p");
                                                  $li.innerHTML = "Quiz name: " + quiz.name;
                                                  $li2.innerHTML = "Description: " + quiz.description;
                                                  quizlistUI.append($li);
                                                  quizlistUI.append($li2);
                                                  })
  });



   
   
  // function get key 
  // firebase.database().ref('quiz').orderByChild('create_by').on('value', (snapshot)=>{
  //                 snapshot.forEach((quiz_snapshot)=>{
  //                 //console.log(quiz_snapshot.key)
  //                 firebase.database().ref('/quiz/'+ quiz_snapshot.key ).equalTo(uid).once('value', (snapshot) => {
  //                 //alert (snapshot.val().create_by);
  //                 if ( snapshot.val().create_by === uid )
  //                   {
  //                     console.log(snapshot.val().name);
  //                     console.log(snapshot.val().description);
  //                     console.log(snapshot.val().create_by);
                      
  //                   }
  //                 }, (error) => {
  //                   if(error) {
  //                   alert ("error");
  //                   }
  //                 });


  //                 })
  // });
}