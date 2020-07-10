// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const remote = require('electron').remote;

const win = remote.getCurrentWindow(); /* Note this is different to the
html global `window` variable */

var priorBounds; // Used by 'restore' button

// When document has loaded, initialise
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
        priorBounds = win.getBounds();
    }
};

window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}

function handleWindowControls() {

    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
    });

    // using 'win.maximise' causes window content to scale incorrectly. 'win.setBounds' doesn't,
    // So I've used it instead.

    document.getElementById('max-button').addEventListener("click", event => {
        priorBounds = win.getBounds();
        win.setBounds({ x: 0, y: 0, width: screen.availWidth, height: screen.availHeight }, true)
        document.body.classList.add('maximized');
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        win.setBounds(priorBounds, true);
        document.body.classList.remove('maximized');
    });

    document.getElementById('close-button').addEventListener("click", event => {
        win.close();
    });
}