

function initialSetupAccount() {
    if (uid !== null) {
        mainApp.copyToLocal();
        document.getElementById("accountSettings").style.visibility = "visible";
        document.getElementById("accountSettingsLoader").style.display = "none";
        
    }
}

function updateDisplaysAccount() {
    document.getElementById("xpCounter").innerHTML = curUser.xp;
    document.getElementById("introHeading").innerHTML = "Welcome to the account management system, " + curUser.username + ".";
    document.getElementById("unameChangePrompt").innerHTML = "Your username is currently " + curUser.username + ". You may change it using the text box below.";
    document.getElementById("levelCounter").innerHTML = curLevel;
    document.getElementById("xpToNextCounter").innerHTML = xpToNext;
}

