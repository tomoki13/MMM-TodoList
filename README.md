# MMM-TodoList 


![image](https://github.com/user-attachments/assets/844d6547-8a6d-4746-90db-ed4c3b124cbf)



A sleek, touch-friendly to-do list module for [MagicMirror²](https://magicmirror.builders/), with multi-user support, animated task handling, and persistent storage. Designed for collaborative or personal setups using a touchscreen MagicMirror.

---

## ✨ Features

- ✅ Multiple user to-do lists
- ✅ Add, complete, edit, and delete tasks
- ✅ Animated task transitions (bounce, fade)
- ✅ Touchscreen-friendly with on-screen keyboard support
- ✅ Persistent task storage per user
- ✅ Toggle for hiding completed tasks
- ✅ Clean dark interface that blends with default MM styling

---

## 📦 Requirements

- MagicMirror² (latest version)
- TouchScreen Display
- [`MMM-Keyboard`](https://github.com/thobach/MMM-Keyboard) — used for on-screen text input
- [`MMM-SmartTouch`](https://github.com/EbenKouao/MMM-SmartTouch) — used for TouchScreen input

---

## 🔧 Installation

1. Clone the module into your MagicMirror `modules` directory:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/YOUR_USERNAME/MMM-TodoList.git
```

2. Install and configure both [`MMM-Keyboard`](https://github.com/lavolp3/MMM-Keyboard) if not already present.
                              [`MMM-SmartTouch`](https://github.com/EbenKouao/MMM-SmartTouch)
---

## 🧩 Configuration

Add the following to your `config.js`:

```js
{
  module: "MMM-TodoList",
  position: "bottom_right",
  config: {
    members: ["Bob", "George", "Tom"]
  }
}
```

---

## 💾 Data Storage

Task data is stored locally inside:

```
~/MagicMirror/modules/MMM-TodoList/data/tasks.json
```

Each user has their own persistent section in that file.

---

## 📄 License

MIT
