var accountFunctions = {};

(function() {
    
    //var firebase = app_fireBase;
    //var uid = null;
    
    /*firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
            console.log("user.uid is " + uid);

            accountFunctions.initialSetup();

        } else {
            // Redirect to login page
            uid = null;
            window.location.replace("login.html");
        }
    });*/

    function initialSetup() {
        if (uid !== null) {
            document.getElementById("accountSettings").style.visibility = "visible";
            document.getElementById("accountSettingsLoader").style.display = "none";
            mainApp.fnRead();
            accountFunctions.updateDisplays();
        }

    }
    
    function updateUsername() {
        var newName = document.getElementById('newUnameInput').value;
        mainApp.changeUsername(newName);
        document.getElementById('newUnameInput').value = '';
        accountFunctions.updateDisplays();
    }

    function updateDisplays() {
        document.getElementById("xpCounter").innerHTML = curUser.xp;
        document.getElementById("introHeading").innerHTML = "Welcome to the account management system, " + curUser.username + ".";
        document.getElementById("unameChangePrompt").innerHTML = "Your username is currently " + curUser.username + ". You may change it using the text box below.";
    }

    accountFunctions.updateDisplays = updateDisplays;
    accountFunctions.initialSetup = initialSetup;
    accountFunctions.updateUsername = updateUsername;
})()

