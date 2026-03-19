import { getPlayer } from "../modules/player.js";
import { getExpRequired } from "../modules/player.js";

export function renderDashboard() {
    const player = getPlayer();
    const required = getExpRequired(player.level);
    const percent = (player.exp / required) * 100;

    document.getElementById("dashboard").innerHTML = `

  <div class="grid md:grid-cols-3 gap-6">

    <!-- PLAYER CARD -->
    <div class="bg-gray-900/60 border border-gray-700 p-6 rounded-2xl shadow-xl">

      <div class="flex justify-between items-center mb-4">
        <h2 class="text-gray-400 text-sm">PLAYER</h2>
        <span class="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
          ACTIVE
        </span>
      </div>

      <p class="text-4xl font-bold mb-2">Lv. ${player.level}</p>

      <!-- EXP BAR -->
      <div>
        <div class="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div class="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-3 transition-all duration-500"
               style="width:${percent}%"></div>
        </div>

        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span>EXP</span>
          <span>${player.exp} / ${required} EXP</span>
        </div>
      </div>

    </div>

    <!-- GOLD -->
    <div class="bg-gray-900/60 border border-gray-700 p-6 rounded-2xl shadow-xl">

      <h2 class="text-gray-400 text-sm mb-3">GOLD</h2>

      <p class="text-4xl font-bold text-yellow-400">
        ${player.gold}
      </p>

      <p class="text-xs text-gray-500 mt-1">Currency for rewards</p>

    </div>

    <!-- STREAK -->
    <div class="bg-gray-900/60 border border-gray-700 p-6 rounded-2xl shadow-xl">

      <h2 class="text-gray-400 text-sm mb-3">STREAK</h2>

      <p class="text-4xl font-bold text-red-400">
        ${player.streak}
      </p>

      <p class="text-xs text-gray-500 mt-1">Consistency matters 🔥</p>

    </div>

  </div>

  `;
}