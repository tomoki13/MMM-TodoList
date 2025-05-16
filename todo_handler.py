#!/usr/bin/env python3
import sys, json, os

F = os.path.join(os.path.dirname(__file__), "tasks.json")

def load():
    if not os.path.exists(F):
        return {}
    with open(F) as f:
        return json.load(f)

def save(d):
    with open(F, "w") as f:
        json.dump(d, f, indent=2)

data = load()
cmd = sys.argv[1]

if cmd == "get":
    member = sys.argv[2]
    print(json.dumps(data.get(member, [])))

elif cmd == "add":
    member, text = sys.argv[2], sys.argv[3]
    data.setdefault(member, []).append({"text": text, "done": False})
    save(data)

elif cmd == "toggle":
    member, idx = sys.argv[2], int(sys.argv[3])
    t = data.get(member, [])
    if 0 <= idx < len(t):
        t[idx]["done"] = not t[idx]["done"]
        save(data)

elif cmd == "edit":
    member, idx, newtext = sys.argv[2], int(sys.argv[3]), sys.argv[4]
    t = data.get(member, [])
    if 0 <= idx < len(t):
        t[idx]["text"] = newtext
        save(data)

elif cmd == "delete":
    member, idx = sys.argv[2], int(sys.argv[3])
    t = data.get(member, [])
    if 0 <= idx < len(t):
        t.pop(idx)
        save(data)
