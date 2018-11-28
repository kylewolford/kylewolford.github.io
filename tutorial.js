

function initialSetupTutorial() {
    if (uid !== null) {
        mainApp.copyToLocal();
    }
}

function giveUsername(name) {
    mainApp.changeUsername(name);
    window.location.replace("index.html");
}

function updateDisplaysTutorial() {

}
