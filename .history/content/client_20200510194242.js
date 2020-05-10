
//HIDE DASHBOARD FROM VIEW WHEN NOT LOGGED IN

let clientId;
var userEmail;

$('dashboardPage').hide();

let loggedIn = false;
function load() {
	//get LoggedIn array from server
	if (loggedIn.state = false);
	$(document).ready(function () {
		$('#dashboardPage').hide();
	});
}

$('#planRun').submit(function (e) {
	newRun();
});

//$('#planRun').submit = newRun();
/**
 *  FUNCTION TO SUBMIT NEW RUN TO DB
 */
function newRun() {
	let idRandom = (Math.random() * (100 - 1) + 1);
	let id = Math.floor(idRandom);
	let runData = new Object();
	runData.title = document.getElementById("titleRun").innerHTML;
	runData.origin = document.getElementById("from").innerHTML;
	runData.destination = document.getElementById("to").innerHTML;
	runData.distance = document.getElementById("in_mile").innerHTML;
	runData.pace = document.getElementById("paceSubmit").innerHTML;
	runData.duration = document.getElementById("duration_text").innerHTML;
	runData.date = document.getElementById("date").value;
	runData.startTime = document.getElementById("time").value;
	runData.description = document.getElementById("description").value;
	runData.meetingPointOne = document.getElementById("meetingPointOne").value;
	runData.meetingPointTwo = document.getElementById("meetingPointTwo").value;
	runData.comments = '';
	runData.userEmail = document.getElementById("emailDisplay").innerHTML;
	runData.type = "run";
	console.log(runData);
	fetch(`/addRun/${id}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(runData)
	})
		.then(res => res.text())
		.then(txt => alert(txt))
		document.getElementById("closeModal").onclick();
		getRunPosts();
		
	//Refresh Form SomeHoW
}

/**
 * FUNCTION TO SIGN UP
 */
function signUp() {
	let btn = document.getElementById("addNewUserBtn");
	btn.onclick = async function () { //onclick function
		let id = document.getElementById("email").value;
		let data = new Object();
		data.name = document.getElementById("name").value;
		data.password = document.getElementById("password").value;
		data.email = document.getElementById("email").value;
		data.age = document.getElementById("age").value;
		let response = fetch(`/addUser/${id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
			.then(res => res.text())
			.then(txt => alert(txt))
	}
	getRunPosts();
}

/**
 * FUNCTION TO LOG IN AND CALL DASHBOARD
 */
let login = function () {//onclick function

	let id = document.getElementById("emailLogin").value;
	let auth = new Object();
	auth.email = document.getElementById("emailLogin").value;
	console.log(auth.email);
	auth.password = document.getElementById("passwordLogin").value;
	fetch(`/userLogin/${id}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(auth)
	}).then(res => res.text())
		.then(txt => {
			if (txt == `User Added`) {
				display(auth.email);
				getRunPosts();
				$('#LoginPage').hide();
				$('#dashboardPage').show();
			}
			else {
				alert('Oops! Your details do not match any on record.');
			}
		})
}


/**
 * FUNCTION TO LOG OUT
 */
function logout() {
	loggedIn = false;
	window.location.replace("./index.html");
}

async function display(id) {

	let response = await fetch(`/getUsers/${id}`);
	let getPost = await response.json();
	console.log(getPost);
	$('#hiName').text(getPost.name);
	$('#ageDisplay').text(getPost.age);
	$('#emailDisplay').text(getPost.email);
	clientId = getPost.name;
}

/**
 * Get Run Posts, Comments and Joins
 */
async function getRunPosts() {
	let response = await fetch(`/getRuns/`);
	let getData = await response.json();
	let getRuns = getData.runs;
	let joiners = getData.joiners;
	let comments = getData.comments;
	console.log(comments)
	console.log(joiners);
	let final = [];
	for (let i = 0; i < getRuns.length; i++) {
		final.push(getRuns[i].value);
	}
	console.log(final);
	generateSquares(final, joiners, comments);
}

/**
 * Function to Generate Run Posts
 * @param {*} runs 
 * @param {*} joiners 
 * @param {*} comments 
 */
function generateSquares(runs, joiners, comments) {
	let arrayLength = runs.length;
	if (arrayLength > 0) {
		for (let i = 0; i < arrayLength; i++) {
			let table = document.createElement("div");
			// let map = document.createElement("div");
			table.className = "runPostsStyle";
			// map.className = "mapStyle";
			//Sort by date run

			let title = document.createElement("h1")
			title.innerHTML = runs[i].title;
			title.className = "postTitle";
			table.append(title);

			let origin = document.createElement("p");
			origin.innerHTML = "Origin: " + runs[i].origin;
			table.append(origin);

			let destination = document.createElement("p");
			destination.innerHTML = "Destination: " + runs[i].destination;
			table.append(destination);

			let distance = document.createElement("p");
			distance.innerHTML = "Distance: " + runs[i].distance + "miles";
			table.append(distance);

			let pace = document.createElement("p");
			pace.innerHTML = "Pace: " + runs[i].pace + " miles/hour";
			table.append(pace);

			let time = document.createElement("p");
			time.innerHTML = "Time: " + runs[i].duration;
			table.append(time);

			let description = document.createElement("p");
			description.innerHTML = "Description: " + runs[i].description;
			table.append(description);

			let count = 0;
			let runJoiners = document.createElement("p");
			table.append(runJoiners);

			//RENDERING USERS WHO HAVE JOINED
			let runID = runs[i]._id;
			if (joiners.length > 0) {
				for (let j = 0; j < joiners.length; j++) {
					if (joiners[j].id == runID) { //if they haven't already joined
						count++;
						runJoiners.innerHTML = "Number of users Joined: " + count;
						}
					}
				}

			let joinRun = document.createElement("button");
			joinRun.innerText = "Join Run";
			let runOwnerEmail = runs[i].userEmail;
			joinRun.onclick = function () {
				//request email
				let clientEmail = document.getElementById("emailDisplay").innerText;
				let clientName = document.getElementById("hiName").innerText;
				if (clientEmail == runOwnerEmail) {
					alert("You cannot join your own run");
				}
				else {
					let joinRun = new Object();
					joinRun.email = clientEmail;
					joinRun._id = runs[i]._id;
					joinRun._rev = runs[i]._rev;
					joinRun.name = clientName;
					fetch(`/addParticipant/`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(joinRun)
					})
					.then(res => res.text())
					.then(txt => alert(txt))
					//reload div
				}
			}
			table.append(joinRun);
			let comments = document.createElement('input')
			comments.setAttribute('type', 'text');
			comments.style.backgroundColor = "white";
			comments.style.height = "100px";
			comments.placeholder = "Write a Comment...";
			comments.className = ("infoclass");
			let com = comments.value = $('#comments'.toString()).text();
			table.append(comments);

			let submit = document.createElement('button');
			submit.className = "readMore";
			submit.innerText = "Submit";
			submit.onclick = async function() {
				let clientEmail = document.getElementById("emailDisplay").innerText;
				let clientName = document.getElementById("hiName").innerText;
				let com = comments.value; //CHANGE TO PROPER COMMENT
				let addComment = new Object();
				addComment.email = clientEmail;
				addComment._id = runs[i]._id;
				addComment._rev = runs[i]._rev;
				addComment.name = clientName;
				addComment.comment = com;
				if(com != "" || com == "undefined") {
				let response = await fetch(`/addComment/`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(addComment)
					})
					let getComments = await response.json();
					console.log(getComments);
					display(clientEmail);
					//getRunPosts();
					$('#dashboardPage').show();
				}
				else {
					alert("You cannot post an empty comment.");
				}
			}

			table.append(comments);
			table.append(submit);

			//MODAL BELOW
			let modal = document.createElement("div");
			modal.className = "modal";
			table.append(modal);

			let close = document.createElement("button");
			close.innerText = "Close"
			close.onclick = function () {
				modal.style.display="none";
			}
			modal.append(close);
			
			let viewComments = document.createElement('button');
			viewComments.className = "readMore";
			viewComments.innerText = "View Comments";
			table.append(viewComments);
			viewComments.onclick = function () {
				modal.style.display="block";
				modal.style.width = "width: auto";
				
			}

			let commentPost = document.createElement("div");
			commentPost.className = "runPostsStyle";
			modal.append(commentPost);
			modal.append(title);
			let commentDisplay = document.createElement("p");

			if (comments.length > 0) {
				for (let k=0; k < comments.length; k++) {
					if(comments[k].id == runID) {
						commentDisplay.innerHTML = "Comment:" + comments[k].comment + " - Posted by User: " + comments[k].name;
					}
				}
			}

			//show comments here and append to modal.

			//INSERT MAP OR WEATHER API

			var divContainer = document.getElementById("left");
			divContainer.appendChild(table);
		}
	}
}

async function display(id) {
	let response = await fetch(`/getUsers/${id}`);
	let getPost = await response.json();
	$('#hiName').text(getPost.name);
	$('#ageDisplay').text(getPost.age);
	$('#emailDisplay').text(getPost.email);
	clientId = getPost.name;
}
