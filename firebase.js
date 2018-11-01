var app_fireBase = {};

(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAf5i2ZBAsCTSuJkExkzvvn2Fju6R-xTKg",
        authDomain: "typing-hero-3c2d2.firebaseapp.com",
        databaseURL: "https://typing-hero-3c2d2.firebaseio.com",
        projectId: "typing-hero-3c2d2",
        storageBucket: "typing-hero-3c2d2.appspot.com",
        messagingSenderId: "805210312897"
    };
    
    firebase.initializeApp(config);
    
    
    function fnCreate(path, body, callback) {
        if (!path || !body) return;
        firebase.database().ref(path).set(body, callback);
    }
    
    function fnRead(path, successFunction, errorFunction) {
        //if (!path || !successFunction || !errorFunction) return;
        return firebase.database().ref(path).once('value').then(successFunction);
    }
    
    
    function fnUpdate(path, body, callback) {
        if (!path || !body) return;
        firebase.database().ref(path).update(body, callback);
    }
    
    function fnDelete(path, callback) {
        if (!path) return;
        firebase.database().ref(path).remove(callback);
    }
    
    
    app_fireBase.databaseApi = {
        create: fnCreate,
        read: fnRead,
        update: fnUpdate,
        delete: fnDelete
    }

})()