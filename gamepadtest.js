/*
 * Gamepad API Test
 * Written in 2013 by Ted Mielczarek <ted@mielczarek.org>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
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
