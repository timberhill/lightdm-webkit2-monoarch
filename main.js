headlines = [
    "if it ain't broke, break it",
    "wow, it boots",
    "did you tell someone you're running arch today?",
    "the choice of GNU generation",
    "because rebooting is for adding new hardware",
    "install once, use forever",
    "install once, fix forever",
    "the least worst linux distribution",
    "have you pacman -Syu today?",
    "if it ain't broke, it ain't much fun either",
    "--force now, think later",
    "may the --force be with you",
    "welcome /home",
    "there is no place like 127.0.0.1",
    "there is no place like ~",
    "RTFM",
    "no bugs, just tons of features",
    "if you can read this, xorg is still working",
    "makepkg, not war",
    "because you can't open windows in space",
    "the more I work with arch, the less empathy I have",
    "BTW",
    "yea I use windows 8",
    "some assembly required",
    "yea, btw I use it"
]

defaultUser = null; // set this to your username to only enter a password at login

var usernameElement = document.getElementById("username");
var input = document.getElementById("input");
input.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        authenticate(e.target.value);
    }
});

const InputType = {
    username: "username",
    password: "password"
}


function userIsValid(username) {
    for (var i = 0; i < lightdm.users.length; i++) {
        if (username === lightdm.users[i]["username"]) {
            return true;
        }
    }
    console.warn("User " + defaultUser + " is not found. Available users are below");
    console.warn(lightdm.users);
    return false;
}

function setInputType (inputType) {
    input.value = "";
    input.placeholder = inputType;
    input.disabled = false;

    console.debug("Setting input type to " + inputType)

    if (inputType == InputType.username) {
        input.type = "text";
    } else if (inputType == InputType.password) {
        input.type = "password";
    } else {
        console.error("Wrong input type: " + inputType);
    }

    input.focus();
    input.select();
}

function authenticate(inputValue) {
    if(!lightdm.in_authentication || !lightdm.authentication_user) {
        sendUsername(inputValue);
    } else {
        sendPassword(inputValue);
    }
}

function sendUsername (username) {
    console.debug("Sending username to lightdm: " + username);
    lightdm.authenticate(username);
    setInputType(InputType.password)
}

function sendPassword (password) {
    console.debug("Sending password to lightdm");
    lightdm.respond(password);
}

function showUsername(username) {
    if (username) {
        usernameElement.innerText = username + " /"
    } else {
        usernameElement.innerText = ""
    }
}

function setHeadline() {
    index = Math.floor(Math.random() * headlines.length);
    element = document.getElementById("headline")
    element.innerHTML = headlines[index]
}

function resetGreeter() {
    console.debug("Resetting the greeter");
    setHeadline();
    if (defaultUser && userIsValid(defaultUser)) {
        console.debug("using default user: " + defaultUser);
        showUsername(defaultUser);
        sendUsername(defaultUser);
        setInputType(InputType.password)
    } else {
        showUsername(null);
        setInputType(InputType.username)
    }
}

window.authentication_complete = function() {
    if (lightdm.is_authenticated) {
        console.debug("Authentication successful");
        $( 'body' ).fadeOut( 1000, () => {
            lightdm.login(lightdm.authentication_user, null);
        } );
    } else {
        console.debug("Authentication failed");
        resetGreeter();
    }
}

window.onload = function() {
    resetGreeter();
}
