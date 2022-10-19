/*
 * Original:
 *  Gamepad API Test
 *  
 *  Written in 2013 by Ted Mielczarek <ted@mielczarek.org>
 *
 *  To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 *  You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 *
 * Forked by ShishirPatil from https://github.com/luser/gamepadtest on Aug 12, 2020
 */

var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var requestAnimationFrameX = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame;
  
var controllers = {};

function connecthandler(event) {
  addgamepad(event.gamepad);
}
function addgamepad(gamepad) {
  var i;
  var controllerButton;
  var controllerAxe;
  controllers[gamepad.index] = gamepad;
  
  var controllerDiv = document.createElement("div");
  controllerDiv.setAttribute("id", "controller" + gamepad.index);
  
  var controllerH1 = document.createElement("h1");
  controllerH1.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  

  var ps4_keys = new Array("X", "O", "[]", "/\\", "L1", "R1", "L2", "R2", "Sh", "Op", "L3", "R3", "DU", "DD", "DL", "DR", "PS", "Pad");
  var xbox_keys = new Array("A", "B", "X", "Y", "LB", "RB", "Ba", "St", "L3", "R3", "LT", "RT", "Xbx", 14, 15, 16, 17, 18);
  var keys_list = new Array(ps4_keys, xbox_keys);
  var axes_names = new Array("LX", "LY", "RX", "RY")
  var gamepadType = new Array("Play Station DS", "XBOX One")
  var defaultgamePadType = 0
  var keys = keys_list[defaultgamePadType];
  // Get controller
  controllers[gamepad.index] = gamepad; var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);
  var t = document.createElement("h1");
  t.appendChild(document.createTextNode("Gamepad name: " + gamepad.id));
  d.appendChild(t);
  // Toggle gamepad type
  var button = document.createElement("input");
  button.type = "button";
  button.value = "Toggle GamePad Type";
  button.onclick = toggleGamepadType;
  d.appendChild(button);
  linebreak = document.createElement("br");
  d.appendChild(linebreak);
  // Display type of controller
  var gt = document.createElement("div");
  gt.id = 'toggle';
  gt.innerHTML = '<h2> Type: '+ gamepadType[defaultgamePadType] +' </h2>'
  d.appendChild(gt);
  
  // Update display on toggle
  function toggleGamepadType(){
    defaultgamePadType = 1 - defaultgamePadType;
    document.getElementById("toggle").innerHTML = '<h2> Type: '+ gamepadType[defaultgamePadType] +' </h2>';
    keys = keys_list[defaultgamePadType]
    for (var i=0; i<gamepad.buttons.length; i++) {
        e.id = "b" + i;
        document.getElementById(e.id).innerHTML = keys[i];
      }
  } 
  // Create the layout

  var buttonsContainer = document.createElement("div");
  buttonsContainer.className = "buttons";
  for (i=0; i<gamepad.buttons.length; i++) {
    controllerButton = document.createElement("span");
    controllerButton.className = "button";
    controllerButton.textContent = i;
    buttonsContainer.appendChild(controllerButton);
  }
  
  var axesContainer = document.createElement("div");
  axesContainer.className = "axes";
  for (i=0; i<gamepad.axes.length; i++) {
    controllerAxe = document.createElement("meter");
    controllerAxe.className = "axis";
    controllerAxe.setAttribute("min", "-1");
    controllerAxe.setAttribute("max", "1");
    controllerAxe.setAttribute("value", "0");
    // fallback content
    controllerAxe.textContent = i + ": 0";
    axesContainer.appendChild(controllerAxe);
  }
  
  document.getElementById("start").style.display = "none";
  controllerDiv.appendChild(controllerH1);
  controllerDiv.appendChild(buttonsContainer);
  controllerDiv.appendChild(axesContainer);
  document.body.appendChild(controllerDiv);
  
  requestAnimationFrameX(updateStatus);

  t1.innerHTML = '<p> \r\n By <a href="https://shishirpatil.github.io/">Shishir</a>. Forked from <a href="https://github.com/luser">@luser</a></p>';

}

function disconnecthandler(event) {
  removegamepad(event.gamepad);
}

function removegamepad(gamepad) {
  var controllerDiv = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(controllerDiv);
  delete controllers[gamepad.index];
}

function updateStatus() {
  var key;
  var i;
  var controller;
  var controllerDiv;
  var controllerButtons;
  var controllerButton;
  var value;
  var pressed;
  var percentage;
  var controllerAxes;
  var controllerAxe;
  scangamepads();
  for (key in controllers) {
    controller = controllers[key];
    controllerDiv = document.getElementById("controller" + key);
    controllerButtons = controllerDiv.getElementsByClassName("button");
    for (i=0; i<controller.buttons.length; i++) {
      controllerButton = controllerButtons[i];
      value = controller.buttons[i];
      if (typeof(value) == "object") {
        pressed = value.pressed;
        value = value.value;
      } else {
        pressed = (value == 1.0);
      }
      percentage = Math.round(value * 100) + "%";
      
      controllerButton.style.backgroundSize = percentage + " " + percentage;
      if (pressed) {
        controllerButton.className = "button pressed";
      } else {
        controllerButton.className = "button";
      }
    }

    controllerAxes = controllerDiv.getElementsByClassName("axis");
    for (i=0; i<controller.axes.length; i++) {
      value = controller.axes[i]
      controllerAxe = controllerAxes[i];
      controllerAxe.value = value;
      // fallback content
      controllerAxe.textContent = i + ": " + value.toFixed(4);
    }
  }
  requestAnimationFrameX(updateStatus);
}

function scangamepads() {
  // still required for chrome
  var i;
  var gamepads = navigator.getGamepads ?
                    navigator.getGamepads() :
                    (navigator.webkitGetGamepads ?
                        navigator.webkitGetGamepads() :
                        []);
  for (i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }

    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}
