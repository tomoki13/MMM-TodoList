Module.register("MMM-TodoList", {
  defaults: {
    members: ["Bob", "George", "Tom"]
  },

  start() {
    this.tasks = {};
    this.active = this.config.members[0];
    this.previousUser = this.active;
    this.newTaskPending = false;
    this.pendingEdit = null;
    this.pendingDelete = null;
    this.showCompleted = true;
    this.sendSocketNotification("GET_TASKS", this.active);
  },

  getStyles() {
    return ["MMM-TodoList.css"];
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "todo-module";

    // === HEADER SECTION ===
    const header = document.createElement("div");
    header.className = "todo-header";

    const tabs = document.createElement("div");
    tabs.className = "todo-tabs";
    this.config.members.forEach(name => {
      const btn = document.createElement("button");
      btn.innerText = name;
      btn.className = name === this.active ? "active" : "";
      btn.onclick = () => {
        if (this.active !== name) {
          this.previousUser = this.active;
          this.active = name;
          this.fadeOutList();
          this.sendSocketNotification("GET_TASKS", name);
        }
      };
      tabs.appendChild(btn);
    });

    const toggle = document.createElement("button");
    toggle.className = "todo-toggle-complete";
    toggle.innerText = this.showCompleted ? "Hide Completed" : "Show Completed";
    toggle.onclick = () => {
      this.showCompleted = !this.showCompleted;
      this.sendSocketNotification("GET_TASKS", this.active);
    };

    header.appendChild(tabs);
    header.appendChild(toggle);
    wrapper.appendChild(header);

    // === TASK LIST SECTION ===
    const list = document.createElement("div");
    list.className = "todo-list";

    const sorted = (this.tasks[this.active] || []).slice().sort((a, b) => {
      if (a.done === b.done) return 0;
      return a.done ? 1 : -1;
    });

    sorted.forEach((t, i) => {
      if (!this.showCompleted && t.done) return;

      const item = document.createElement("div");
      item.className = "todo-item";
      setTimeout(() => item.classList.add("visible"), 100 + i * 50);
      if (this.newTaskPending && i === sorted.length - 1) {
        item.classList.add("bounce-in");
      }

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = t.done;
      cb.onchange = () => {
        this.sendSocketNotification("TOGGLE_TASK", {
          member: this.active,
          index: i
        });
      };
      item.appendChild(cb);

      const text = document.createElement("span");
      text.innerText = t.text;
      item.appendChild(text);

      const edit = document.createElement("button");
      edit.className = "todo-edit-btn";
      edit.innerText = "✎";
      edit.onclick = () => {
        this.pendingEdit = { index: i, text: t.text };
        this.showConfirm("Edit this task?", "edit");
      };
      item.appendChild(edit);

      const del = document.createElement("button");
      del.className = "todo-del-btn";
      del.innerText = "🗙";
      del.onclick = () => {
        this.pendingDelete = { index: i };
        this.showConfirm("Delete this task?", "delete");
      };
      item.appendChild(del);

      list.appendChild(item);
    });

    wrapper.appendChild(list);

    // === ADD BUTTON ===
    const add = document.createElement("button");
    add.className = "todo-add";
    add.innerText = "+";
    add.onclick = () => {
      this.sendNotification("KEYBOARD", {
        key: "TODOTASK",
        style: "default",
        data: {}
      });
    };
    wrapper.appendChild(add);

    // === MODAL CONFIRM ===
    if (this.confirmModal) wrapper.appendChild(this.confirmModal);

    return wrapper;
  },

  socketNotificationReceived(n, payload) {
    if (n === "TASKS_DATA") {
      this.tasks[payload.member] = payload.tasks;
      this.newTaskPending = false;
      this.updateDom(300);
    }
  },

  notificationReceived(n, p) {
    if (n === "KEYBOARD_INPUT") {
      if (p.key === "TODOTASK") {
        this.newTaskPending = true;
        this.sendSocketNotification("ADD_TASK", {
          member: this.active,
          text: p.message
        });

        setTimeout(() => {
          this.sendSocketNotification("GET_TASKS", this.active);
        }, 200);
      }

      else if (p.key === "EDITTASK" && this.pendingEdit) {
        this.sendSocketNotification("EDIT_TASK", {
          member: this.active,
          index: this.pendingEdit.index,
          text: p.message
        });
        this.pendingEdit = null;
        this.sendSocketNotification("GET_TASKS", this.active);
      }
    }
  },

  fadeOutList() {
    const list = document.querySelector(".todo-list");
    if (list) {
      list.classList.add("fade-out");
      setTimeout(() => list.classList.remove("fade-out"), 400);
    }
  },

  showConfirm(msgText, type) {
    this.confirmModal = document.createElement("div");
    this.confirmModal.className = "todo-confirm-modal";

    const msg = document.createElement("div");
    msg.className = "todo-confirm-message";
    msg.innerText = msgText;
    this.confirmModal.appendChild(msg);

    const btnWrap = document.createElement("div");
    btnWrap.className = "todo-confirm-buttons";

    const yes = document.createElement("button");
    yes.innerText = "✔️";
    yes.onclick = () => {
      if (type === "edit" && this.pendingEdit) {
        this.sendNotification("KEYBOARD", {
          key: "EDITTASK",
          style: "default",
          data: { text: this.pendingEdit.text }
        });
      }

      if (type === "delete" && this.pendingDelete) {
        this.sendSocketNotification("DELETE_TASK", {
          member: this.active,
          index: this.pendingDelete.index
        });
        this.pendingDelete = null;
        this.sendSocketNotification("GET_TASKS", this.active);
      }

      this.confirmModal = null;
      this.updateDom();
    };
    btnWrap.appendChild(yes);

    const no = document.createElement("button");
    no.innerText = "✖️";
    no.onclick = () => {
      this.confirmModal = null;
      this.pendingEdit = null;
      this.pendingDelete = null;
      this.updateDom();
    };
    btnWrap.appendChild(no);

    this.confirmModal.appendChild(btnWrap);
    this.updateDom();
  }
});

