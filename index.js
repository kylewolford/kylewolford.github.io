
var mainApp = {};

var curUser = {};

var curSnap = {};

var numRefreshes = 0;

(function() {
    
    //var firebase = app_fireBase;
    var uid = null;
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
            initialSetup();
        } else {
            // Redirect to login page
            uid = null;
            window.location.replace("login.html");
        }
    });
    
    function initialSetup() {
        //for (i=0; i<2; i++)
            copyToLocal();
        //if (retrieveXp() == 0) {
            // go to tutorial
        //    window.location.replace("tutorial.html");
        //}

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
        updateDisplays();
    }
    
    function retrieveUsername() {
        copyToLocal();
        var curUsername = curUser.username;
        console.log("current username is ");
        console.log(curUsername);
        console.log("in retrieveUsername, got " + curUsername);
        return curUsername;
    }
    
    function retrieveXp() {
        copyToLocal();
        var curXp = curUser.xp;
        console.log("inXp is " + curXp);
        console.log("in retrieveXp, got " + curXp);
        return curXp;
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
            if (snapshot != null && snapshot.val() != null) {
                curSnap = snapshot.val();
                curUser.username = curSnap.username;
                curUser.xp = curSnap.xp;
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
        document.getElementById("unameChangePrompt").innerHTML = "Your username is currently " + curUser.username + ". You may change it using the text box below.";
    }
        
    
    function giveXp(amount) {
        // get most current database information for user
        copyToLocal();
        // increment local xp
        curUser.xp += amount;
        console.log("curUser's xp is " + curUser.xp);
        // push changes to db
        copyToDatabase();
        
        updateDisplays();
    }

    function changeUsername(newName) {
        // get most current database information for user
        copyToLocal();
        // increment local xp
        curUser.username = newName
        console.log("curUser's username is " + curUser.username);
        // push changes to db
        copyToDatabase();
        
        updateDisplays();
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
    mainApp.retrieveUsername = retrieveUsername;
    mainApp.retrieveXp = retrieveXp;
    mainApp.giveXp = giveXp;
    mainApp.copyToLocal = copyToLocal;
    mainApp.updateDisplays = updateDisplays;
    mainApp.initialSetup = initialSetup;
    mainApp.changeUsername = changeUsername;
})()

