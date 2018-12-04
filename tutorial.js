

function initialSetupTutorial() {
    if (uid !== null) {
        mainApp.copyToLocal();
    }
}

function giveUsername(name) {
    result = mainApp.changeUsername(name);
    if (result != -1) {
        mainApp.giveXp(30);
        window.location.replace("index.html");
    }
}
