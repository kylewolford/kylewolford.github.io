

(function() {

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

    }




    document.getElementById("introHeading").innerHTML = "Welcome to Typing Hero, " + "";
})