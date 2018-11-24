


function gotoquiz(){
  window.location= 'quiz.html';
}

function gotocreatequiz(){
  window.location= 'quizcreate.html';
}


function joinQuizSession(){
	var sessionid = document.getElementById("sessionid_field").value;

	if ( sessionid.length == 6 )
		{
		console.log(sessionid);
 		window.location= 'quizanswer.html?id='+sessionid;
		}
	else 
		{
		alert("Invalid session pin. Please enter 6 digit.");
		} 


}