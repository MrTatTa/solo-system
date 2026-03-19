import { getPlayer, upgradeStat } from "../modules/player.js";
import { getExpRequired } from "../modules/player.js";
import { getStreak } from "../modules/dailyQuest.js";

export function renderDashboard() {
  const player = getPlayer();
  const required = getExpRequired(player.level);
  const percent = (player.exp / required) * 100;

  const stats = player.stats;

  function statBar(value, max = 5) {
    const percent = Math.min((value / max) * 100, 100);
    return `
      <div class="w-full bg-gray-800 h-2 rounded">
        <div class="bg-purple-500 h-2 rounded transition-all"
             style="width:${percent}%"></div>
      </div>
    `;
  }

  function statRow(label, key, color) {
    const data = stats[key] || { level: 1, value: 1 };
    const value = data.value;
    const level = data.level;

    const cost = Math.floor(200 * Math.pow(1.5, level));

    return `
    <div class="bg-gray-800/60 p-4 rounded-xl border border-gray-700">

      <div class="flex justify-between items-center mb-2">
        <span>${label}</span>
        <span class="text-sm text-gray-400">
          Lv.${level} • x${value.toFixed(2)}
        </span>
      </div>

      ${statBar(value)}

      <div class="flex justify-between items-center mt-3">
        <span class="text-xs text-gray-400">
          Cost: 💰 ${cost}
        </span>

        <button onclick="upgradeStatUI('${key}')"
          class="${color} px-3 py-1 rounded text-sm hover:opacity-80">
          Upgrade
        </button>
      </div>

    </div>
  `;
  }

  document.getElementById("dashboard").innerHTML = `

  <div class="grid md:grid-cols-3 gap-6 mb-6">

    <!-- PLAYER -->
    <div class="bg-gray-900/60 border border-gray-700 p-6 rounded-2xl shadow-xl">
      <h2 class="text-gray-400 text-sm mb-3">PLAYER</h2>

      <p class="text-4xl font-bold mb-2">Lv. ${player.level}</p>

      <div class="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div class="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-3"
             style="width:${percent}%"></div>
      </div>

      <div class="flex justify-between text-xs text-gray-400 mt-1">
        <span>EXP</span>
        <span>${player.exp} / ${required}</span>
      </div>
    </div>

    <!-- GOLD -->
    <div class="bg-gray-900/60 border border-gray-700 p-6 rounded-2xl shadow-xl">
      <h2 class="text-gray-400 text-sm mb-3">GOLD</h2>
      <p class="text-4xl font-bold text-yellow-400">${player.gold}</p>
      <p class="text-xs text-gray-500 mt-1">Currency for rewards</p>
    </div>

    <!-- STREAK -->
    <div class="bg-gray-900/60 border border-gray-700 p-6 rounded-2xl shadow-xl">
      <h2 class="text-gray-400 text-sm mb-3">STREAK</h2>
      <p class="text-4xl font-bold text-red-400">${getStreak()}</p>
      <p class="text-xs text-gray-500 mt-1">Consistency matters 🔥</p>
    </div>

  </div>

  <!-- 🔥 STATS UPGRADE -->
  <div class="bg-gray-900/60 border border-gray-700 p-6 rounded-2xl shadow-xl">

    <h2 class="text-gray-300 text-lg mb-4">⚡ Upgrade Stats</h2>

    <div class="grid md:grid-cols-2 gap-4">

      ${statRow("💥 EXP Multiplier", "expMultiplier", "bg-green-500")}
      ${statRow("💰 Gold Multiplier", "goldMultiplier", "bg-yellow-500")}
      ${statRow("🎯 Luck", "luck", "bg-blue-500")}
      ${statRow("⚡ Combo", "comboMultiplier", "bg-purple-500")}

    </div>

  </div>

  `;
}

// 🔥 GLOBAL FUNCTION
window.upgradeStatUI = function (stat) {
  const success = upgradeStat(stat);

  if (!success) {
    alert("Gold tidak cukup!");
  }

  renderDashboard();
};