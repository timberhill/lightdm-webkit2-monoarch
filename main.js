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
    "RTFM",
    "no bugs, just tons of features",
    "if you can read this, xorg is still working",
    "makepkg, not war",
    "because you can't open windows in space",
    "the more I work with arch, the less empathy I have"
]

var input = document.getElementById("input");
input.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        authenticate(e.target.value);
    }
});

window.authentication_complete = function() {
    if (lightdm.is_authenticated) {
        console.log("Authenticated!");
        $( 'body' ).fadeOut( 1000, () => {
            lightdm.login(lightdm.authentication_user, null);
        } );
    } else {
        setHeadline();
        input.value = "";
        input.placeholder = "user";
        input.type = "text";
        input.disabled = false;
        input.focus();
        input.select();
    }
}

function setHeadline() {
    index = Math.floor(Math.random() * headlines.length);
    element = document.getElementById("headline")
    element.innerHTML = headlines[index]
}

window.onload = function() {
    setHeadline();
    input.focus();
    input.select();
    input.value = lightdm.select_user_hint;
    if(input.value) {
      authenticate(input.value);
    }
}

function authenticate(input_text) {
    if(!lightdm.in_authentication || !lightdm.authentication_user) {
        lightdm.authenticate(input_text);
        input.value = "";
        input.type = "password";
        input.placeholder = "password";
        input.disabled = false;
    } else {
        input.disabled = true;
        lightdm.respond(input_text);
    }
}
