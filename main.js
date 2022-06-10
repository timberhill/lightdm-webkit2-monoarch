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

var sessionCheckbox = document.getElementById("sessionCheckbox");
var sessionList = document.getElementById("sessionList");
var sessionLabel = document.getElementById("sessionLabel");

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
    showSessions();
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
        var sessionKey = sessionLabel.getAttribute("session-id");
        $( 'body' ).fadeOut( 1000, () => {
            lightdm.login(lightdm.authentication_user, sessionKey);
        } );
    } else {
        console.debug("Authentication failed");
        resetGreeter();
    }
}

window.onload = function() {
    resetGreeter();
}

function showSessions() {
    var sessions = [...lightdm.sessions];
    // filter sessions if they are already listed
    sessions = sessions.filter(function (elem) {
        var isNotInList = true;
        for (var i of sessionList.children) {
            isNotInList = isNotInList && i.children[0].keydm !== elem.key;
        }
        return isNotInList;
    });

    // set default session
    const sessionName = window.localStorage.getItem("sessionName") == null ? "Default" : window.localStorage.getItem("sessionName");
    const key = window.localStorage.getItem("key") == null ? "" : window.localStorage.getItem("key");
    sessionLabel.textContent = sessionName;
    sessionLabel.setAttribute("session-id", key);

    // set available sessions list
    for (var session of sessions) {
        var liElem = document.createElement("li");
        var aElem = document.createElement("a");

        aElem.setAttribute("href", "#");
        aElem.textContent = session.name;
        aElem.keydm = session.key;
        aElem.addEventListener("click", setSession, false);

        liElem.appendChild(aElem);
        sessionList.appendChild(liElem);
    }
}

function setSession(e) {
    if (sessionCheckbox.checked) {
        sessionCheckbox.checked = false;
        const sessionName = e.currentTarget.textContent;
        const key = e.currentTarget.keydm;
        sessionLabel.textContent = sessionName;
        sessionLabel.setAttribute("session-id", key);
        window.localStorage.setItem("sessionName", sessionName);
        window.localStorage.setItem("key", key);
    }
}
