
var mainApp = {};

(function() {
    
    //var firebase = app_fireBase;
    var uid = null;
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
            copyToLocal();
        } else {
            // Redirect to login page
            uid = null;
            window.location.replace("login.html");
        }
    });
    
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
        //curUser.username = retrieveUsername();
        //curUser.xp = retrieveXp();
        updateDisplays();
    }
    
    function retrieveUsername() {
        var inUsername = fnRead(); // fnRead returns snapshot.val()
        console.log("inUsername is ");
        console.log(inUsername);
        var theUsername = (inUsername && inUsername.username) || "anonymous";
        console.log("in retrieveUsername, got " + theUsername);
        return theUsername;
    }
    
    function retrieveXp() {
        var inXp = fnRead(); // fnRead returns snapshot.val()
        console.log("inXp is " + inXp);
        var theXp = (inXp && inXp.xp) || 12;
        console.log("in retrieveXp, got " + theXp);
        return theXp;
    }
    
    function fnCreate() {
        // Create a sample user to the database
        var path = 'users/' + uid;
        var data = {
            username: "Kyle",
            xp: 0
        }
        
        app_fireBase.databaseApi.create(path, data, messageHandler);
    }

    function fnRead() {
        
        var path = 'users/' + uid;
        function successFn(snapshot) {
            if (snapshot) {
                curSnap = snapshot.val();
                curUser.username = curSnap.username;
                curUser.xp = curSnap.xp;
                //return curSnap;
            } else {
                //fnCreate();
                //fnRead(field);
                console.log("in else part of successFn");
            }
        }
        return app_fireBase.databaseApi.read(path, successFn, messageHandler);
    }
    
    
    /*function fnMonitor(field) {
        var path = 'users/' + uid;
        if (field != "")
            path += '/' + field;
        
        app_fireBase.databaseApi.monitor(path, retrieveXp, successFn, messageHandler);
    }
    */
    
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
})()


var curUser = {};

var curSnap = {};