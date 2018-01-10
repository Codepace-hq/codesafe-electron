import "./stylesheets/main.css";

// Small helpers you might want to keep
import "./helpers/context_menu.js";
import "./helpers/external_links.js";

// ----------------------------------------------------------------------------
// Everything below is just to show you how it works. You can delete all of it.
// ----------------------------------------------------------------------------

//import { remote } from "electron";
const remote = require('electron').remote
const dialog = remote.dialog;

import jetpack from "fs-jetpack";
import { greet } from "./hello_world/hello_world";
import env from "env";
import path from "path";

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

const { exec } = require('child_process');
const powershell = require('node-powershell');
const firstRun = require('first-run');
const sudo = require('sudo-prompt');

var connected = false;

/*
  This gets the host OS and sets up the appropriate VPN profile.
  For now, there is only one location (US East), so there's only one cert per os
  per region. Eventually this will accomodate more regions
*/
function setupVPNConfigurations(regions){
  // the regions param is for later, but is unused now
  var overlayDiv = document.getElementById("main-div-overlay")
  overlayDiv.style.backgroundColor = "#1ECD97"

  var text = document.getElementById("main-status-overlay")
  text.innerHTML = "Setting up VPN configurations..."

  switch (process.platform) {

    case "darwin":
      // TODO
      break;

    case "win32":

      var executionPolicy; // Powershell execution policy

      let ps = new powershell({
        noProfile: true,
        executionPolicy: 'Bypass'
      })
      ps.addCommand('certutil -f -importpfx ..\\resources\\vpn_configs\\carter.p12')

      break;
    default:
      dialog.showMessageBox({
        type: 'error',
        buttons: ['OK'],
        title: "Error: Unsupported platform: " + process.platform
      })

  }
  overlayDiv.parentNode.removeChild(overlayDiv)
}

function connect(){ return true }

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

// Quietly set up VPN configs (admin may be required)
//if (firstRun() && env.name == "production") {
  setupVPNConfigurations(null);
//}

//***************
//SUBMIT
//***************
(function () {
	$(document).on('click', '.btn-submit', function() {
		if(!$(this).hasClass('loading')){
			$(this).addClass('loading');
			let self = this;

      // Connect to the vpn and get the success status
      var connected = connect()

      if(connected){
        console.log("HELLO")
  			setTimeout(function() {
  				$(self).removeClass('loading');
  				$(self).addClass('checked');
  			},1500);
      } else {
      // If the connection failed

      }

		}
	});
})();

// Load particles from json file
particlesJS.load('particles-js', '../particles.json', function() {
  console.log('callback - particles.js config loaded');
});
