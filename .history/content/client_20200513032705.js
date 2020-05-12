
//set interval only if new information

//Display level
//analytics - round avg pace and proper figure - convert back using algorithm

/**
 * On Load
 * Logged Out - hide dashboard from view
 */
function load() {
	$(document).ready(function () {
		$('#dashboardPage').hide();
	});
}

/**
 * Function to post run to database
 */
function newRun() {
	let idRandom = (Math.random() * (10000 - 1) + 1);
	let id = Math.floor(idRandom);
	//create new object to post
	let runData = new Object();
	runData.title = document.getElementById("titleRun").value;
	runData.origin = document.getElementById("from").innerHTML;
	runData.destination = document.getElementById("to").innerHTML;
	runData.distance = document.getElementById("in_mile").innerHTML;
	runData.pace = document.getElementById("paceSubmit").innerHTML;
	runData.duration = document.getElementById("duration_text").innerHTML;
	runData.date = document.getElementById("date").value;
	runData.startTime = document.getElementById("time").value;
	runData.description = document.getElementById("description").value;
	runData.timeStamp = new Date();
	runData.userEmail = document.getElementById("emailDisplay").innerHTML;
	runData.type = "run";
	runData.name = document.getElementById("hiName").innerHTML;
	//validation of empty fields not generated by first form
	if (runData.title != "" || runData.date != "" || runData.startTime != "") {
		fetch(`/addRun/${id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(runData)
		})
			.then(res => res.text())
			.then(txt => {
				if (txt == `Run Uploaded`) {
					alert(txt);
					document.getElementById("closeModal").onclick();
					getRuns();
					document.getElementById("distance_form").reset();
					showSecond();
					$('#results').empty();
					//reset form here -- prevent submission twice
				}
				else {
					alert(`Not Uploaded. Please try again`);
				}
			});
	}
	else (alert("Fill out required fields: Title, Date, Time"))
}

/**
 * Function to sign up user and post to database
 */
function signUp() {
	let btn = document.getElementById("addNewUserBtn");
	btn.onclick = async function () { 
		let id = document.getElementById("email").value;
		//create new object
		let data = new Object();
		data.name = document.getElementById("name").value;
		data.password = document.getElementById("password").value;
		data.email = document.getElementById("email").value;
		data.age = document.getElementById("age").value;
		fetch(`/addUser/${id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
			.then(res => res.text())
			.then(txt => {
				if (txt == `Sign Up successful`) {
					alert(txt)
					//replace with login screen
					window.location.replace("./index.html");
				}
				else {
					alert(txt)
				}
			});
	}
}

/**
 * Function to login, show dashboard and previous runs
 */
let login = function () {
	let id = document.getElementById("emailLogin").value;
	//new object to hold input details to check against db
	let auth = new Object();
	auth.email = document.getElementById("emailLogin").value;
	auth.password = document.getElementById("passwordLogin").value;
	fetch(`/userLogin/${id}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(auth)
	}).then(res => res.text())
		.then(txt => {
			if (txt == `User Added`) {
				//call function to display user profile
				display(auth.email);
				//fetch all updated runs to display on page
				getRuns();
				$('#LoginPage').hide();
				$('#dashboardPage').show();
			}
			else {
				alert('Oops! Your details do not match any on record.');
			}
		})
}

/**
 * function to logout
 * redirect user to another page and refresh (auto-logout)
 */
function logout() {
	window.location.replace("./index.html");
}

//Display profile - redirected after successful login
async function display(id) {
	const response = await fetch(`/getUsers/${id}`);
	const getPost = await response.json();
	$('#hiName').text(getPost.name);
	$('#ageDisplay').text(getPost.age);
	$('#emailDisplay').text(getPost.email);
	clientId = getPost.name;
}

/**
 * Function to get get runs, joiners, and comments
 * Called at an interval to ensure page is updated
 */
async function getRuns() {
	let runs = [];
	let joiners = [];
	let comments = [];
	//fetch runs
	let response = await fetch(`/getRuns/`);
	let getRuns = await response.json();
	for (let i = 0; i < getRuns.length; i++) {
		runs.push(getRuns[i].value);
	}
	//sort by date of run
	runs.sort((a, b) => (a.date > b.date) ? -1 : 1)

	//fetch joiners
	let responseJ = await fetch(`/getJoins/`);
	let getJoins = await responseJ.json();
	for (let i = 0; i < getJoins.length; i++) {
		joiners.push(getJoins[i].value);
	}
	//fetch comments
	let responseC = await fetch(`/getComments/`);
	let getComms = await responseC.json();
	for (let i = 0; i < getComms.length; i++) {
		comments.push(getComms[i].value);
	}

	for (let x = 0; x < runs.length; x++) {
	var d = new Date(),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2)
				month = '0' + month;
			if (day.length < 2)
				day = '0' + day;
			let finalDate = [year, month, day].join('-');

			if (finalDate > runs[x].date) {
				runs[x].status = "Completed";
			}
			if (finalDate < runs[x].date) {
				runs[x].status = "Upcoming";
			}

			if (runs[x].pace > 0 && runs[x].pace < 5) {
				runs[x].level = "Beginner";
			}
			else if (runs[x].pace >= 5 && runs[x].pace < 8) {
				runs[x].level = "Intermediate";
			}
			else if (runs[x].pace > 8) {
				runs[x].level = "Advanced";
			}
		}
			console.log(runs);
	//functions to display runs on page and profile analytics
	displayAnalytics(runs, joiners);
	displayRuns(runs, joiners, comments);
}

setInterval(getRuns, 5000);


//Set Interval to reload div
//set interval if information is not same

//if new information -- empty arrays and run


/**
 * Function to display user analytics
 * @param {*} runs 
 * @param {*} joiners 
 */
function displayAnalytics(runs, joiners) {
	let countRuns = 0;
	let totalMiles = 0;
	let avgPace = 0;
	let thisClient = document.getElementById("emailDisplay").innerHTML;
	
	//for all runs and joiners
	for (let x = 0; x < runs.length; x++) {
		for (let j = 0; j < joiners.length; j++) {
			//if the run's id and joiners' runId are identical
			if (joiners[j].idRun == runs[x]._id) {
				// and if the joiner is this client
				if (joiners[j].email == thisClient) {
					//and if the run is in the past
					if (runs[x].status == "Completed") {
						//increment numberOfRuns for this client
						countRuns++;
						//Display on profile
						document.getElementById("noRunsJoin").innerHTML = "Number of Runs Completed:" + countRuns;

						//Find out total miles run
						totalMiles = JSON.parse(runs[x].distance) + totalMiles;
						document.getElementById("totalMiles").innerHTML = "Number of Miles Run: " + totalMiles;

						//Display Level

						//Display Avg Pace
						avgPace = JSON.parse(runs[x].pace) / countRuns;
						document.getElementById("level").innerHTML = "Avg Pace:" + avgPace;

						//Display Fun Fact
						const scotland = 7330;
						let distanceLeft = scotland - totalMiles;
						document.getElementById("fact").innerHTML = "Did you know you have " + distanceLeft + " miles left until you've run the perimeter of scotland!"
					}
				}
			}
		}
	}
}

	let runPost;

	/**
	 * DRAWS POSTS, RUNS AND COMMENTS FROM DATA
	 * @param {*} runs 
	 * @param {*} joiners 
	 * @param {*} comments 
	 */

	function displayRuns(runs, joiners, commentsData) {
		//clear div so it is not appending but redrawing page content
		$('#left').empty();
		if (runs.length > 0) {
			//build each run as a dynamic post
			for (let i = 0; i < runs.length; i++) {
				
				//Create a Div with class
				runPost = document.createElement("div");
				runPost.className = "runPostsStyle";

				//Status - Completed or Upcoming
				let status = document.createElement("p");
				status.style.fontWeight = "bold";
				status.style.color = "#63b7af";
				status.innerHTML = runs[i].status;
				runPost.append(status);

				//Level of Run - Beginner, Intermediate, Advanced
				let level = document.createElement("p");
				level.innerHTML = "Level: " + runs[i].level + " (" + runs[i].distance + " miles)";
				runPost.append(level);

				//Title of Run
				let title = document.createElement("h1")
				title.innerHTML = runs[i].title;
				title.className = "postTitle";
				runPost.append(title);

				//Creator
				let user = document.createElement("p");
				user.innerHTML = "Uploaded by : " + runs[i].name;

				//Date of Run
				let date = document.createElement("p")
				date.innerHTML = runs[i].date;
				date.className = "dateDisplay";
				runPost.append(date);
				runPost.append(user);

				//Starting Point
				let origin = document.createElement("p");
				origin.innerHTML = "From: " + runs[i].origin;
				origin.className = "toFrom";
				runPost.append(origin);

				//Ending Point
				let destination = document.createElement("p");
				destination.innerHTML = "To: " + runs[i].destination;
				destination.className = "toFrom";
				runPost.append(destination);

				//Duration and Pace from Google API
				let time = document.createElement("p");
				time.innerHTML = "Duration: At pace " + runs[i].pace + " it would take approximately " + runs[i].duration;
				runPost.append(time);

				//Description - only if provided
				let description = document.createElement("p");
				description.innerHTML = "Description: " + runs[i].description;
				if (runs[i].description != "") {
					runPost.append(description);
				}

				//Users joined
				let runJoiners = document.createElement("p");
				let label = document.createElement("p");
				label.innerHTML = "Users joined: "
				label.style.fontWeight = "bold";
				runPost.append(label);

				let usersJoined = document.createElement("p");
				runPost.append(usersJoined);

				let joinsPerRunCount = 0;
				let names = [];
				let clientEmail = document.getElementById("emailDisplay").innerText;

				//Display how many users have joined and who they are
				let runID = runs[i]._id;
				if (joiners.length > 0) {
					for (let z = 0; z < joiners.length; z++) {
						if (joiners[z].idRun == runs[i]._id) { //if they haven't already joined
							joinsPerRunCount++;
							runJoiners.innerHTML = "Number of users joined:" + joinsPerRunCount;
							names.push(joiners[z].name);
						}

					}
				}
				//Display users who have joined on screen
				names.sort();
				usersJoined.innerHTML = names.join(", ");
				runPost.append(runJoiners);

				//Create dynamic button to join run
				let joinRun = document.createElement("button");
				joinRun.innerText = "Join Run";

				//On click send data about user and this run to post to database
				joinRun.onclick = function () {
					let clientName = document.getElementById("hiName").innerText;
					//check if this client has already joined this run
					if (joiners.some(item => item.email === clientEmail && item.idRun === runs[i]._id)) {
						alert("You have already joined this run.");
					}
					//if not - post data to the database with an associated ID
					else {
						let id = (Math.random() * (20000 - 10000) + 1);
						let joinRun = new Object();
						joinRun.email = clientEmail;
						joinRun.idRun = runs[i]._id;
						joinRun.name = clientName;
						joinRun.type = "joins"
						fetch(`/addJoin/${id}`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(joinRun)
						})
							.then(res => res.text())
							.then(txt => alert(txt))
					}
				}
				runPost.append(joinRun);

				//Display Comments in a modal below as there is no space on screen
				let modal = document.createElement("div");
				modal.className = "modal";
				runPost.append(modal);

				//Close Modal Button
				let close = document.createElement("button");
				close.innerText = "Close"
				close.onclick = function () {
					modal.style.display = "none";
				}
				modal.append(close);

				//View Comments Button
				let viewComments = document.createElement('button');
				viewComments.className = "readMore";
				viewComments.innerText = "View Comments";
				runPost.append(viewComments);
				viewComments.onclick = function () {
					modal.style.display = "block";
					modal.style.width = "500px";
					modal.style.opacity = "0.99"
					modal.style.height = "500px";

				}

				//Create a div for each comment with the title displayed
				let commentPost = document.createElement("div");
				let titleDisplay = document.createElement("p");
				titleDisplay.innerText = runs[i].title;
				titleDisplay.className = "title";
				commentPost.className = "commentPost";
				modal.append(commentPost);
				commentPost.append(titleDisplay);

				//If there are comments - display them in their own div with timestamp
				if (commentsData.length > 0) {
					for (let k = 0; k < commentsData.length; k++) {
						if (commentsData[k].runId == runID) {
							let commentSingle = document.createElement("div");
							commentSingle.style.backgroundColor = "white";
							commentSingle.style.padding = "5px";
							let commentDisplay = document.createElement("p");
							commentDisplay.innerHTML = "Comment: " + commentsData[k].comment + " - Posted by User: " + commentsData[k].name;
							let comDate = document.createElement("p");
							comDate.innerHTML = commentsData[k].time;
							commentSingle.appendChild(comDate);
							commentPost.appendChild(commentSingle);
							commentSingle.append(commentDisplay);
						}
					}
				}

				//Write new comments and submit
				let comments = document.createElement('input')
				comments.setAttribute('type', 'text');
				comments.style.backgroundColor = "whitesmoke";
				comments.style.borderRadius = "5px";
				comments.style.height = "80px";
				comments.placeholder = "Write a Comment...";
				comments.className = ("infoclass");
				let com = comments.value = $('#comments'.toString()).text();
				runPost.append(comments);

				//Submit comments and post to database
				let submit = document.createElement('button');
				submit.className = "submitComment";
				submit.innerText = "Submit";
				//On click - submit an object with a random id to the server to post to db
				submit.onclick = async function () {
					let clientName = document.getElementById("hiName").innerText;
					let com = comments.value;
					let id = (Math.random() * (40000 - 30000) + 1);
					let addComment = new Object();
					addComment.email = clientEmail;
					addComment.runId = runs[i]._id;
					addComment.name = clientName;
					addComment.comment = com;
					addComment.time = new Date();
					addComment.type = "comments";
					//if the comments are not empty
					if (com != "" || com == "undefined") {
						fetch(`/addComment/${id}`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(addComment)
						})
							.then(res => res.text())
							.then(txt => alert(txt))
					}
					else {
						alert("You cannot post an empty comment.");
					}
				}
				runPost.append(comments);
				runPost.append(submit);

				var divContainer = document.getElementById("left");
				divContainer.appendChild(runPost);
			}
		}
	}

