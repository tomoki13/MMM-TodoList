const NodeHelper = require("node_helper");
const { spawn } = require("child_process");
const path = require("path");

module.exports = NodeHelper.create({
  start() {
    console.log("MMM-TodoList helper started");
  },

  socketNotificationReceived(notification, payload) {
    const script = path.join(__dirname, "todo_handler.py");

    if (notification === "GET_TASKS") {
      let py = spawn("python3", [script, "get", payload]);
      let out = "";
      py.stdout.on("data", d => out += d);
      py.on("close", () => {
        this.sendSocketNotification("TASKS_DATA", {
          member: payload,
          tasks: JSON.parse(out || "[]")
        });
      });

    } else if (notification === "ADD_TASK") {
      let { member, text } = payload;
      let py = spawn("python3", [script, "add", member, text]);
      py.on("close", () => {
        this.sendSocketNotification("TASKS_UPDATED", member);
      });

    } else if (notification === "TOGGLE_TASK") {
      let { member, index } = payload;
      let py = spawn("python3", [script, "toggle", member, index]);
      py.on("close", () => {
        // No reload needed on checkbox toggle anymore
      });

    } else if (notification === "EDIT_TASK") {
      let { member, index, text } = payload;
      let py = spawn("python3", [script, "edit", member, index, text]);
      py.on("close", () => {
        this.sendSocketNotification("TASKS_UPDATED", member);
      });

    } else if (notification === "DELETE_TASK") {
      let { member, index } = payload;
      let py = spawn("python3", [script, "delete", member, index]);
      py.on("close", () => {
        this.sendSocketNotification("TASKS_UPDATED", member);
      });
    }
  }
});

