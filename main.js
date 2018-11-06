
// main.js contains functions that are used by all pages in the app

var mainApp = {};

var curUser = {};

var numRefreshes = 0;

var uid = null;

(function() {
    
    //var firebase = app_fireBase;
    //var uid = null;
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
            console.log("user.uid is " + uid);

            initialSetupSwitcher();

        } else {
            // Redirect to login page
            uid = null;
            window.location.replace("login.html");
        }
    });

    
    function initialSetup() {
        if (uid !== null) {
            if (currentPage == "index.html") {
                makeSentence();
            }
            copyToLocal();
            if (curUser.xp == 0) {
                // go to tutorial
                window.location.replace("tutorial.html");
            }
            document.getElementById("theGame").style.visibility = "visible";
            document.getElementById("theGameLoader").style.display = "none";

        }

    }

    function logOut() {
        firebase.auth().signOut();
    }
    
    function messageHandler(err) {
        
        if(err) {
            console.log(err);
        } else {
            console.log("It worked!");
        }
    }
    
    function copyToLocal() {
        // Get username/xp of logged-in user and copy to the local object curUser.
        fnRead();
        //updateDisplaysSwitcher();
    }
    
    
    function fnCreate() {
        if (numRefreshes >= 2) {
            // Create a sample user to the database
            var path = 'users/' + uid;
            var data = {
                username: "uname",
                xp: 0
            }
            
            app_fireBase.databaseApi.create(path, data, messageHandler);
            numRefreshes++;
        }
        fnRead();
    }

    function fnRead() {
        
        var path = 'users/' + uid;
        function successFn(snapshot) {
            if (snapshot !== null && snapshot.val() !== null) {
                curUser.username = String(snapshot.child("username").val());
                
                curUser.xp = Number(snapshot.child("xp").val());

                updateDisplaysSwitcher();
            } else {
                fnCreate();
                console.log("in else part of successFn");
            }
        }
        
        app_fireBase.databaseApi.read(path, successFn, messageHandler);
    }

      
    
    
    function copyToDatabase() {
        var path = '/users' + uid;
        var data = {
            username: curUser.username,
            xp: curUser.xp
        }
        fnUpdate(path, data);
    }

    function fnUpdate(path, infoObj) {
        var path = 'users/' + uid;
        
        app_fireBase.databaseApi.update(path, infoObj, messageHandler);
    }
    

    function updateDisplays() {
        document.getElementById("xpCounter").innerHTML = curUser.xp;
        document.getElementById("introHeading").innerHTML = "Hello, " + curUser.username + "!";
        
    }
        
    
    function giveXp(amount) {
        // get most current database information for user
        copyToLocal();
        // increment local xp
        curUser.xp += amount;
        console.log("curUser's xp is " + curUser.xp);
        // push changes to db
        copyToDatabase();
        
        updateDisplaysSwitcher();
    }

    function changeUsername(newName) {
        // get most current database information for user
        copyToLocal();
        // increment local xp
        curUser.username = newName
        console.log("curUser's username is " + curUser.username);
        // push changes to db
        copyToDatabase();
        
        updateDisplaysSwitcher();
    }

    function fnDelete() {
        var path = 'users/' + uid;
        app_fireBase.databaseApi.delete(path, messageHandler);
    }
    
    function seeInfo() {
        console.log("curUser.username is " + curUser.username);
        console.log("curUser.xp is " + curUser.xp);
    }
    
    
    mainApp.seeInfo = seeInfo;
    mainApp.logOut = logOut;
    mainApp.fnCreate = fnCreate;
    mainApp.fnRead = fnRead;
    mainApp.fnUpdate = fnUpdate;
    mainApp.fnDelete = fnDelete;
    mainApp.giveXp = giveXp;
    mainApp.copyToLocal = copyToLocal;
    mainApp.updateDisplays = updateDisplays;
    mainApp.initialSetup = initialSetup;
    mainApp.changeUsername = changeUsername;
})()

function initialSetupSwitcher() {
    if (currentPage == "index.html") {
        mainApp.initialSetup();
        console.log("did mainApp.initialSetup");
    }
    else if (currentPage == "account.html") {
        accountFunctions.initialSetup();
        console.log("did accountFunctions.initialSetup");
    }
    else {
        console.log("currentPage is " + currentPage);
    }
}

function updateDisplaysSwitcher() {
    if (currentPage == "index.html") {
        mainApp.updateDisplays();
        console.log("did mainApp.updateDisplays");
    }
    else if (currentPage == "account.html") {
        accountFunctions.updateDisplays();
        console.log("did accountFunctions.updateDisplays");
    }
    else {
        console.log("currentPage is " + currentPage);
    }
}