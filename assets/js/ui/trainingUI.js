import { addExp, addGold, getPlayer } from "../modules/player.js";
import { renderDashboard } from "./dashboardUI.js";

let combo = 0;
let lastClickTime = 0;
let comboTimeout = null;

// ⚙️ CONFIG
const COMBO_RESET_TIME = 3000; // 3 detik
const CRIT_CHANCE = 0.2; // 20%
const CRIT_MULTIPLIER = 2;

export function renderTraining() {
    const btn = document.getElementById("trainBtn");
    const stats = document.getElementById("trainingStats");

    updateStats();

    btn.onclick = () => {
        const now = Date.now();

        // 🔥 RESET kalau terlalu lama
        if (now - lastClickTime > COMBO_RESET_TIME) {
            resetCombo();
        }

        combo++;
        lastClickTime = now;

        // 🔥 BASE
        let baseExp = 5;
        let baseGold = 2;

        // ⚡ MULTIPLIER
        const comboMultiplier = 1 + combo * 0.1;

        let exp = Math.floor(baseExp * comboMultiplier);
        let gold = Math.floor(baseGold * comboMultiplier);

        // 💥 CRIT
        let isCrit = Math.random() < CRIT_CHANCE;

        if (isCrit) {
            exp *= CRIT_MULTIPLIER;
            gold *= CRIT_MULTIPLIER;
        }

        // 💰 APPLY
        addExp(exp);
        addGold(gold);

        showFeedback(exp, gold, isCrit);
        updateStats();
        renderDashboard();

        // ⏱️ RESET TIMER
        clearTimeout(comboTimeout);
        comboTimeout = setTimeout(() => {
            resetCombo();
        }, COMBO_RESET_TIME);
    };

    // 🔥 FIX UTAMA ADA DI SINI
    function resetCombo() {
        combo = 0;
        lastClickTime = 0;

        updateStats();

        // kasih feedback biar terasa
        const log = document.getElementById("trainingLog");
        log.innerHTML = `
          <p class="text-gray-500 italic">Combo reset...</p>
        `;
    }

    function updateStats() {
        const player = getPlayer();

        const multiplier = combo === 0 ? 1 : (1 + combo * 0.1);

        stats.innerHTML = `
        <div class="bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow">

          <p class="text-gray-400 text-sm mb-2">Training Stats</p>

          <div class="flex justify-between items-center">

            <div>
              <p class="text-lg">🔥 Combo:</p>
              <p class="text-2xl font-bold text-green-400">${combo}</p>
            </div>

            <div>
              <p class="text-sm text-gray-400">Multiplier</p>
              <p class="text-xl font-bold text-blue-400">
                x${multiplier.toFixed(1)}
              </p>
            </div>

          </div>

          <p class="text-xs text-gray-500 mt-3">
            Combo reset jika idle ${COMBO_RESET_TIME / 1000}s
          </p>

        </div>
      `;
    }

    function showFeedback(exp, gold, isCrit) {
        const log = document.getElementById("trainingLog");

        log.innerHTML = `
        <div class="space-y-1">

          <p class="text-green-400 font-semibold">
            +${exp} EXP • +${gold} Gold
          </p>

          ${isCrit
                ? `<p class="text-yellow-400 font-bold animate-pulse">
                 💥 CRITICAL HIT!
               </p>`
                : ""
            }

        </div>
      `;
    }
}