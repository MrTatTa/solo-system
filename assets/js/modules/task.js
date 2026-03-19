import { save, load } from "../storage.js";

let tasks = load("tasks") || [];

// ⏱️ CONFIG
const AUTO_DELETE_TIME = 1000 * 60 * 60 * 12; // 12 jam

// 🧹 CLEANUP TASK LAMA
function cleanupTasks() {
    const now = Date.now();

    const filtered = tasks.filter(t => {
        if (!t.completed) return true;

        // kalau belum ada timestamp (legacy)
        if (!t.completedAt) return true;

        return (now - t.completedAt) < AUTO_DELETE_TIME;
    });

    // kalau ada perubahan → save ulang
    if (filtered.length !== tasks.length) {
        tasks = filtered;
        save("tasks", tasks);
    }
}

// 📦 GET
export function getTasks() {
    cleanupTasks(); // 🔥 auto bersihin tiap ambil data
    return tasks;
}

// ➕ ADD
export function addTask(title) {
    const newTask = {
        id: Date.now(),
        title: title,
        completed: false,
        completedAt: null // 🔥 init
    };

    tasks.push(newTask);
    save("tasks", tasks);
}

// ✅ COMPLETE
export function completeTask(id) {
    const task = tasks.find(t => t.id === id);

    if (task && !task.completed) {
        task.completed = true;
        task.completedAt = Date.now(); // 🔥 simpan waktu selesai

        save("tasks", tasks);
    }
}