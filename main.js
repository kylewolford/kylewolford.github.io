
// main.js contains functions that are used by all pages in the app

var mainApp = {};

var curUser = {};

var curLevel = 0;

var xpToNext = 0;

var uid = null;

var levelXp = [0, 830, 1861, 2902, 3980, /* 1-5 */
    5126, 6390, 7787, 9400, 11275, /* 6-10 */
    13605, 16372, 19656, 23546, 28138, /* 11-15 */
    33520, 39809, 47109, 55535, 64802, /* 16-20 */
    77190, 90811, 106221, 123573, 143025, /* 21-25 */
    164742, 188893, 215651, 245196, 277713, /* 26-30 */
    316311, 358547, 404634, 454796, 509259, /* 31-35 */
    568254, 632019, 700797, 774834, 854383, /* 36-40 */
    946227, 1044569, 1149696, 1261903, 1381488, /* 41-45 */
    1508756, 1644015, 1787581, 1939773, 2100917, /* 46-50 */
    2283490, 2476369, 2679907, 2894505, 3120508, /* 51-55 */
    3358307, 3608290, 3870846, 4146374, 4435275, /* 56-60 */
    4758122, 5096111, 5449685, 5819299, 6205407, /* 61-65 */
    6608473, 7028964, 7467354, 7924122, 8399751, /* 66-70 */
    8925664, 9472665, 10041285, 10632061, 11245538, /* 71-75 */
    11882262, 12542789, 13227679, 13937496, 14672812, /* 76-80 */
    15478994, 16313404, 17176661, 18069395, 18992239, /* 81-85 */
    19945833, 20930821, 21947856, 22997593, 24080695, /* 86-90 */
    25259906, 26475754, 27728955, 29020233, 30350318, /* 91-95 */
    31719944, 33129852, 34580790, 36073511, 37608773, /* 96-100 */
    39270442, 40978509, 42733789, 44537107, 46389292, /* 101-105 */
    48291180, 50243611, 52247435, 54303504, 56412678, /* 106-110 */
    58575823, 60793812, 63067521, 65397835, 67785643, /* 111-115 */
    70231841, 72737330, 75303019, 77929820, 80618654, /* 116-120 */
    83370445, 86186124, 89066630, 92012904, 95025896, /* 121-125 */
    98106559, 101255855, 104474750, 107764216, 111125230, /* 126-130 */
    114558777, 118065845, 121647430, 125304532, 129038159, /* 131-135 */
    132849323, 136739041, 140708338, 144758242, 148889790, /* 136-140 */
    153104021, 157401983, 161784728, 166253312, 170808801, /* 141-145 */
    175452262, 180184770, 185007406, 189921255, 194927409, /* 146-150 */
    200000000,]; /* 151 (max xp) */

var numLevels = levelXp.length;    

var curPage = "";

(function() {
    
    //var firebase = app_fireBase;
    //var uid = null;
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
            console.log("user.uid is " + uid);

            initialSetup();


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
            console.log("Database changes successful.");
            
            updateDisplays();
        }
    }
    
    function copyToLocal() {
        // Get username/xp of logged-in user and copy to the local object curUser.
        fnRead();
        
    }
    
    
    function fnCreate() {
        // Create a sample user to the database
        var path = 'users/' + uid;
        var data = {
            username: "tempName",
            xp: 0
        }
        copyToLocal();
        app_fireBase.databaseApi.create(path, data, messageHandler);
    }

    

    function fnRead() {
        
        var path = 'users/' + uid;
        function successFn(snapshot) {
            if (snapshot !== null && snapshot.val() !== null) {
                curUser.username = String(snapshot.child("username").val());
                
                curUser.xp = Number(snapshot.child("xp").val());

                curLevel = getLevel(curUser.xp);
                if (curLevel < 151) {
                    xpToNext = getXpToNext(curUser.xp, curLevel+1);
                } else {
                    xpToNext = 0;
                }

                if (curUser.xp == 0 && curPage != 'tutorial') {
                    window.location.replace("tutorial.html");
                }
                
                updateDisplays();
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
        
    
    function giveXp(amount) {
        // get most current database information for user
        copyToLocal();
        // 200,000,000 xp is the xp limit, so check for that
        if (curUser.xp + amount > 200000000) {
            if (curUser.xp < 200000000) {
                amount = 200000000 - curUser.xp;
            }
            else {
                alert("You have reached the xp cap; you cannot earn any more.");
                return;
            }
        }
        // increment local xp
        curUser.xp += amount;
        // push changes to db
        copyToDatabase();
        
        updateDisplays();
    }

    function changeUsername(newName) { // return -1, error; 0, no error
        // get most current database information for user
        copyToLocal();
        // new name must be between 1 and 20 characters
        if (newName.length <= 0 || newName.length > 20) {
            alert("Invalid username. Please enter a new one between 1 and 20 characters.");
            return -1;
        }
        // change local username
        curUser.username = String(newName);
        console.log("curUser's username is " + curUser.username);
        // push changes to db
        copyToDatabase();
        
        updateDisplays();
        return 0;
    }

    function fnDelete() {
        var path = 'users/' + uid;
        app_fireBase.databaseApi.delete(path, messageHandler);
    }
    
    function seeInfo() {
        console.log("curUser.username is " + curUser.username);
        console.log("curUser.xp is " + curUser.xp);
        console.log("user is level " + curLevel);
    }
    
    function getLevel(xp) {
        let i = 0;
        while (levelXp[i] <= xp && i < numLevels) {
            i++;
        }
        return i;
    }
    
    function getXpToNext(xp, level) {
        return Number(levelXp[level-1] - xp);
    }

    
    mainApp.seeInfo = seeInfo;
    mainApp.logOut = logOut;
    mainApp.fnCreate = fnCreate;
    mainApp.fnRead = fnRead;
    mainApp.fnUpdate = fnUpdate;
    mainApp.fnDelete = fnDelete;
    mainApp.giveXp = giveXp;
    mainApp.copyToLocal = copyToLocal;
    mainApp.changeUsername = changeUsername;
    mainApp.getLevel = getLevel;
    mainApp.getXpToNext = getXpToNext;
})()

// General functions that are called for each page

function initialSetup() {
    switch(curPage) {
        case 'game':
            initialSetupGame();
            break;
        case 'account':
            initialSetupAccount();
            break;
        case 'tutorial':
            initialSetupTutorial();
            break;
        default:
            console.log("curPage is not game, account, or tutorial");
    }
}

function initialSetupGame() {}

function updateDisplays() {
    switch(curPage) {
        case 'game':
            updateDisplaysGame();
            break;
        case 'account':
            updateDisplaysAccount();
            break;
        default:
            console.log("curPage is not game or account");
    }
}
