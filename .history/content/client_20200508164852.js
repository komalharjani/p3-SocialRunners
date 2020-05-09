
//HIDE DASHBOARD FROM VIEW WHEN NOT LOGGED IN

let clientId;
var userEmail;

/**
 *  FUNCTION TO SUBMIT NEW RUN TO DB
 */
function newRun() {
	let idRandom = (Math.random() * (10 - 1) + 1);
	let id = Math.floor(idRandom);
	//let email = clientId;
	//CHANGE TO DYNAMIC LOGGED IN USER 
	//let id = "komaalharjani@gmail.com";
	let runData = new Object();
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
	runData.maxPeople = document.getElementById("maxPeople").value;
	runData.comments = '';
	//runData.userEmail = email;
	runData.type = "run";
	console.log(runData);
	fetch(`/addRun/${id}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(runData)
	})
		.then(res => res.text())
		.then(txt => alert(txt))
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
		let response = fetch(`/addUser/:${id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
			.then(res => res.text())
			.then(txt => alert(txt))
	}
}

/**
 * FUNCTION TO LOG IN AND CALL DASHBOARD
 */
let login = function () {
	let btnLogIn = document.getElementById("loginInBtn");
	btnLogIn.onclick = function () { //onclick function
		let id = document.getElementById("emailLogin").value;
		let auth = new Object();
		auth.email = document.getElementById("emailLogin").value;
		auth.password = document.getElementById("passwordLogin").value;
		fetch(`/userLogin/${id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(auth)
		})
			.then(response => response.json())
			.then(data => console.log(data));
		// .then((res) => {
		// 	if (res.status == 200) {
		// 		console.log("hello");
		// 		console.log(res.status);
		// 		console.log(res.body);
		// 		console.log(res.name);
		// 		clientId = id;
		// 		//window.location.replace("./dashboard.html");
		// 		return clientId;
		// 	}
		// 	else {
		// 		alert("Failed to Login.");
		// 	}
		// })
	}
}

/**
 * FUNCTION TO LOG OUT
 */
function logout() {
	loggedIn = false;
	window.location.replace("./index.html");
}

/**
 * FUNCTION TO CONSOLE USER WITH ASSOCIATED ID
 * @param {*} id 
 */



async function getData() {
	let id = "5";
	fetch(`/getRuns/${id}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(auth)
	})
		.then(response => response.json())
		.then(data => console.log(data));
	// console.log(getUser);
	// userEmail = getUser.email;
	//document.getElementById("hi").append(getUser.name);
	//call();
}
getData();

// // /**
// //  * FUNCTION TO CONSOLE RUNS BASED ON EMAIL
// //  * @param {} id 
// //  */
// let getUser;
// async function displayRuns() {
// 	let id = "komaalharjani@gmail.com";
// 	let response = await fetch(`/getUsers/${id}`);
// 	getUser = await response.json();
// 	console.log(getUser.status);
// }
// displayRuns();

// let user;
// async function runsDis() {
// 	id = 9;
// 	fetch(`/getRuns/${id}`)
// 	.then(response => response.json())
// 	.then(data => console.log(data));
// 	user = data;
// 	// console.log(response);
// 	// return await response.json();
// }
// runsDis();
// //promise functions

// function getData() {
// 	let id = "5";
// 	return new Promise((resolve, reject) => {
// 	  fetch(`/getRuns/${id}`)
// 	   .then(response => {
// 		 return response.json();
// 		}).then(dt => {
// 		   let data = dt.results;
// 		   resolve(data);
// 		   console.log(data);
// 	 })
//   })    
//   }

// let movies = '';
// getData().then(data => {
// movies = data
// console.log(data);
// });


let runs = [{
	"id": '9',
	"origin": 'Covent Garden, London, UK',
	"destination": 'Royal Leamington Spa, UK',
	"distance": '88.34',
	"pace": '4',
	"time": '22 hour(s) and 5 minute(s).',
	"date": '',
	"startTime": '',
	"description": '',
	"meetingPointOne": '',
	"meetingPointTwo": '',
	"maxPeople": '',
	"type": 'run'
}, {
	"id": '9',
	"origin": 'Covent Garden, London, UK',
	"destination": 'Royal Leamington Spa, UK',
	"distance": '88.34',
	"pace": '4',
	"time": '22 hour(s) and 5 minute(s).',
	"date": '',
	"startTime": '',
	"description": '',
	"meetingPointOne": '',
	"meetingPointTwo": '',
	"maxPeople": '',
	"type": 'run'
}, {
	"id": '9',
	"origin": 'Covent Garden, London, UK',
	"destination": 'Royal Leamington Spa, UK',
	"distance": '88.34',
	"pace": '4',
	"time": '22 hour(s) and 5 minute(s).',
	"date": '',
	"startTime": '',
	"description": '',
	"meetingPointOne": '',
	"meetingPointTwo": '',
	"maxPeople": '',
	"type": 'run'
}];

function generateSquares() {
	let arrayLength = runs.length;
	if (arrayLength > 0) {
		for (let i = 0; i < arrayLength; i++) {
			let table = document.createElement("div");
			// let map = document.createElement("div");

			table.className = "runPostsStyle";
			// map.className = "mapStyle";

			//Add Date Posted
			//Title

			let title = document.createElement("h1")
			title.innerHTML = "Social Runs + ADD DATE";
			title.className = "postTitle";
			table.append(title);

			let origin = document.createElement("p");
			origin.innerHTML = "Origin: " + runs[i].origin;
			table.append(origin);

			let destination = document.createElement("p");
			destination.innerHTML = "Destination: " + runs[i].destination;
			table.append(destination);

			let distance = document.createElement("p");
			distance.innerHTML = "Distance: " + runs[i].distance;
			table.append(distance);

			let pace = document.createElement("p");
			pace.innerHTML = "Pace: " + runs[i].pace + " miles/hour";
			table.append(pace);

			let time = document.createElement("p");
			time.innerHTML = "Start Time: " + runs[i].time;
			table.append(time);

			let description = document.createElement("p");
			description.innerHTML = "Description: " + runs[i].description;
			table.append(description);

			let max = document.createElement("p");
			max.innerHTML = "Max: " + runs[i].maxPeople;
			table.append(max);

			let comments = document.createElement("input");
			comments.style.backgroundColor = "white";
			comments.placeholder = "Add A Comment";
			comments.style.height = "100px";
			table.append(comments);

			//INSERT MAP OR WEATHER API

			let submitComment = document.createElement("button");
			submitComment.className = "readMore";
			table.append(submitComment);
			submitComment.innerText = "Post"; //hide from view or delete from db - not ethical

			// var divContainerMap = document.getElementById("left");
			// table.appendChild(map);

			var divContainer = document.getElementById("right");
			divContainer.appendChild(table);
		}
	}
}
//generateSquares();
