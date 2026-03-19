import { getTasks, addTask, completeTask } from "../modules/task.js";
import { getRandomReward } from "../modules/reward.js";
import { addExp, addGold } from "../modules/player.js";
import { addItem } from "../modules/inventory.js";
import { renderDashboard } from "./dashboardUI.js";
import { renderInventory } from "./inventoryUI.js";
import { showRewardPopup } from "../modules/rewardPopup.js";

let countdownInterval = null;

// ⏱️ CONFIG
const AUTO_DELETE_TIME = 1000 * 60 * 60 * 12; // 12 jam

export function renderTasks() {
    const container = document.getElementById("taskList");
    const summary = document.getElementById("taskSummary");

    const tasks = getTasks();

    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : (done / total) * 100;

    // 🔥 SUMMARY
    summary.innerHTML = `
    <div class="bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow">

      <div class="flex justify-between text-sm text-gray-400 mb-2">
        <span>Progress</span>
        <span>${done} / ${total} completed</span>
      </div>

      <div class="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-400 to-purple-500 h-3 transition-all duration-500"
             style="width:${percent}%"></div>
      </div>

    </div>
  `;

    // 🔥 TASK LIST
    container.innerHTML = tasks.map(t => {

        // ⏳ COUNTDOWN
        let countdownHTML = "";

        if (t.completed && t.completedAt) {
            const remaining = AUTO_DELETE_TIME - (Date.now() - t.completedAt);

            if (remaining > 0) {
                countdownHTML = `
                <p class="text-xs text-gray-500 mt-1">
                  ⏳ Hilang dalam ${formatTime(remaining)}
                </p>
                `;
            }
        }

        return `
        <div class="flex justify-between items-center p-5 mb-4 rounded-2xl
          bg-gray-900/60 border border-gray-700 hover:bg-gray-800 transition shadow">

          <!-- LEFT -->
          <div>
            <div class="flex items-center gap-2 mb-1">
              <p class="font-semibold ${t.completed ? "line-through text-gray-500" : ""}">
                ${t.title}
              </p>

              <span class="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                Task
              </span>
            </div>

            <p class="text-sm text-gray-400">
              🎁 Random Reward
            </p>

            ${countdownHTML}
          </div>

          <!-- RIGHT -->
          <button onclick="completeTaskUI(${t.id})"
            class="px-4 py-1.5 rounded-lg text-sm font-semibold transition
            ${t.completed
                ? "bg-gray-700 text-gray-400"
                : "bg-green-500 hover:bg-green-600"}">

            ${t.completed ? "✔ Completed" : "Complete"}

          </button>

        </div>
      `;
    }).join("");

    startCountdown();
}

// ⏱️ FORMAT WAKTU
function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);

    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    if (h > 0) return `${h}j ${m}m`;
    if (m > 0) return `${m}m ${s}d`;
    return `${s}d`;
}

// 🔁 UPDATE REALTIME
function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        renderTasks();
    }, 1000);
}

// ➕ ADD TASK
window.addTaskUI = function () {
    const input = document.getElementById("taskInput");
    const value = input.value.trim();

    if (!value) return;

    addTask(value);
    input.value = "";

    renderTasks();
};

// ✅ COMPLETE TASK + REWARD
window.completeTaskUI = function (id) {
    completeTask(id);

    const reward = getRandomReward();

    if (reward.type === "exp") {
        addExp(reward.value);
    } else if (reward.type === "gold") {
        addGold(reward.value);
    } else if (reward.type === "item") {
        addItem(reward.value);
    }

    showRewardPopup(reward);

    renderTasks();
    renderDashboard();
    renderInventory();
};