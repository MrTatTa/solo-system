import { getQuests, completeQuest, addDailyQuest } from "../modules/dailyQuest.js";
import { renderDashboard } from "./dashboardUI.js";
import { renderInventory } from "./inventoryUI.js";
import { getTimeUntilReset } from "../modules/dailyQuest.js";

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);

  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return `${h}h ${m}m ${s}s`;
}

export function renderQuests() {
  const container = document.getElementById("questList");
  const summary = document.getElementById("questSummary");
  const form = document.getElementById("questForm");

  const quests = getQuests();

  const total = quests.length;
  const done = quests.filter(q => q.done).length;
  const percent = total === 0 ? 0 : (done / total) * 100;

  // 🔥 FORM INPUT
  form.innerHTML = `
      <div class="bg-gray-900/60 border border-gray-700 p-4 rounded-2xl mb-6 flex gap-2">

        <input id="newQuestTitle" placeholder="Tambah quest..."
          class="flex-1 p-2 rounded text-black"/>

        <button onclick="addQuestUI()"
          class="bg-blue-500 hover:bg-blue-600 px-4 rounded">
          Add
        </button>

      </div>
    `;

  // 🔥 SUMMARY
  const timeLeft = getTimeUntilReset();

  summary.innerHTML = `
  <div class="bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow">

    <div class="flex justify-between text-sm text-gray-400 mb-2">
      <span>Progress</span>
      <span>${done} / ${total}</span>
    </div>

    <div class="w-full bg-gray-800 rounded-full h-3 mb-3">
      <div class="bg-gradient-to-r from-green-400 to-blue-500 h-3"
        style="width:${percent}%"></div>
    </div>

    <p id="questCountdown" class="text-xs text-gray-400">
      🔄 Reset dalam: --
    </p>

  </div>
  `;

  // 🔥 LIST
  container.innerHTML = quests.map(q => `
      <div class="flex justify-between items-center p-5 mb-4 rounded-2xl
        ${q.penalty ? "bg-red-900/40 border-red-500" : "bg-gray-900/60 border-gray-700"}
        border">

        <div>
          <p class="${q.done ? "line-through text-gray-500" : ""}">
            ${q.title}
          </p>

          <p class="text-sm text-gray-400">
            +${q.exp} EXP • +${q.gold} Gold
          </p>
        </div>

        <button onclick="complete(${q.id})"
          class="px-4 py-1 rounded
          ${q.done ? "bg-gray-600" : "bg-green-500"}">

          ${q.done ? "✔" : "Done"}
        </button>
      </div>
    `).join("");
  startCountdown();
}

let countdownInterval = null;

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  function update() {
    const el = document.getElementById("questCountdown");
    if (!el) return;

    const timeLeft = getTimeUntilReset();
    el.innerText = `🔄 Reset dalam: ${formatTime(timeLeft)}`;
  }

  update(); // 🔥 langsung update (ini penting)

  countdownInterval = setInterval(update, 1000);
}

// ➕ ADD UI
window.addQuestUI = function () {
  const input = document.getElementById("newQuestTitle");
  const value = input.value.trim();

  if (!value) return;

  addDailyQuest(value);
  input.value = "";

  renderQuests();
};

// COMPLETE
window.complete = function (id) {
  completeQuest(id);
  renderQuests();
  renderDashboard();
  renderInventory();
};