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
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  var ps4_keys = new Array("X", "O", "[]", "/\\", "L1", "R1", "L2", "R2", "Sh", "Op", "L3", "R3", "DU", "DD", "DL", "DR", "PS", "Pad");
  var xbox_keys = new Array("A", "B", "X", "Y", "LB", "RB", "Ba", "St", "L3", "R3", "LT", "RT", "X", 14, 15, 16, 17, 18);
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
  var b = document.createElement("div");
  b.className = "buttons";
  for (var i=0; i<gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    e.id = "b" + i;
    e.innerHTML = keys[i];
    b.appendChild(e);
  }
  d.appendChild(b);
  var a = document.createElement("div");
  a.className = "axes";
  for (i=0; i<gamepad.axes.length; i++) {
    e = document.createElement("meter");
    e.className = "axis";
    e.id = "a" + i;
    e.setAttribute("min", "-1");
    e.setAttribute("max", "1");
    e.setAttribute("value", "0");
    e.innerHTML = axes_names[i];
    a.appendChild(e);
  }
  d.appendChild(a);
  
  // Credits
  var cred = document.createElement("div");
  var t1 = document.createElement("p");
  t1.innerHTML = '<p> \r\n By Shishir. Forked from <a href="https://github.com/luser">@luser</a></p>';
  cred.append(t1);
  d.appendChild(cred)

  // Ending stuff
  document.getElementById("start").style.display = "none";
  document.body.appendChild(d);
  rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    var buttons = d.getElementsByClassName("button");
    for (var i=0; i<controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      var touched = false;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        if ('touched' in val) {
          touched = val.touched;
        }
        val = val.value;
      }
      var pct = Math.round(val * 100) + "%";
      b.style.backgroundSize = pct + " " + pct;
      b.className = "button";
      if (pressed) {
        b.className += " pressed";
      }
      if (touched) {
        b.className += " touched";
      }
    }

    var axes = d.getElementsByClassName("axis");
    for (var i=0; i<controller.axes.length; i++) {
      var a = axes[i];
      a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
      a.setAttribute("value", controller.axes[i]);
    }
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i].index in controllers)) {
      controllers[gamepads[i].index] = gamepads[i];
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
