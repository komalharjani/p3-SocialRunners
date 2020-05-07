(function () {

    class User {
        constructor(name, password, email, age) {
            //These fields have to be given when creating an object
            this.name = name;
            this.password = password;
            this.email = email;
            this.age = age;
        }

        // Getters and setters
        get name() { return this._name; }
        set name(newName) {
            if (typeof (newName) === 'string' && newName != "") this._name = newName;
            else throw new Error("Invalid name");
        }

        get password() { return this._password; }
        set password(newPassword) {
            if (typeof (newPassword) === 'string' && newPassword != "") this._password = newPassword;
            else throw new Error("Invalid Password");
        }

        get email() { return this._email; }
        set email(newEmail) {
            var validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (newEmail.match(validEmail)) {
                this._email = newEmail
            }
            else throw new Error("Invalid Email");
        }

        get age() { return this._age; }
        set age(newAge) {
            let num = Number(newAge)
            if (Number.isInteger(num)) this._age = newAge;
            else throw new Error("Invalid Age");
        }

        // convert to json 
        toJSON() {
            let result = {};
            result.name = this.name;
            result.password = this.password;
            result.email = this.email;
            result.age = this.age;
            return result;
        }

        // convert to string
        toJSONString() {
            return JSON.stringify(this.toJSON());
        }

        //build User from json
        static fromJSON(json) {
            if (!json.hasOwnProperty('name')) {
                throw new Error("Missing name");
            }
            if (!json.hasOwnProperty('password')) {
                throw new Error("Missing password");
            }
            if (!json.hasOwnProperty('email')) {
                throw new Error("Missing email");
            }
            if (!json.hasOwnProperty('age')) {
                throw new Error("Missing age");
            }
            return new User(json.name, json.password, json.email, json.age);
        }
    }

    class Run {
        constructor(origin, destination, pace) {
            this.origin = origin;
            this.destination = destination;
            this.pace = pace;
        }

        // Getters and setters
        get origin() { return this._origin; }
        set origin(newOrigin) {
            if (typeof (newOrigin) === 'string' && newOrigin != "") this._origin = newOrigin;
            else throw new Error("Invalid Origin");
        }

        get destination() { return this._destination; }
        set destination(newDestination) {
            if (typeof (newDestination) === 'string' && newDestination != "") this._destination = newDestination;
            else throw new Error("Invalid Destination");
        }

        get pace() { return this._pace; }
        set pace(newPace) {
            let num = Number(newPace)
            if (Number.isInteger(num)) {
                this._pace = newPace;
            }
            else throw new Error("Invalid Pace");
        }

        // convert to json 
        toJSON() {
            let result = {};
            result.origin = this.origin;
            result.destination = this.destination;
            result.pace = this.pace;
            return result;
        }

        // convert to string
        toJSONString() {
            return JSON.stringify(this.toJSON());
        }

        //build Run from json
        static fromJSON(json) {
            if (!json.hasOwnProperty('origin')) {
                throw new Error("Missing origin");
            }
            if (!json.hasOwnProperty('destination')) {
                throw new Error("Missing destination");
            }
            if (!json.hasOwnProperty('pace')) {
                throw new Error("Missing pace");
            }
            return new Run(json.origin, json.destination, json.pace);
        }
    }

    // We could use two different names here, but that would only make things more complicated
    var moduleExports = { User: User };
    var moduleExports = { Run: Run};

    // Check if we are running in a browser. If so, attach the exported closure to the main window.
    // Otherwise, use the node.js module exporting functionality. This way we can use this module both 
    // in the browser and on the server
    if (typeof __dirname == 'undefined')
        window.exports = moduleExports;
    else
        module.exports = moduleExports

}());
