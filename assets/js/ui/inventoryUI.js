import { getInventory, useItem } from "../modules/inventory.js";
import { renderDashboard } from "./dashboardUI.js";

export function renderInventory() {
    const items = getInventory();
    const container = document.getElementById("inventoryList");

    if (items.length === 0) {
        container.innerHTML = `
      <div class="col-span-full text-center text-gray-400">
        <p class="text-lg">🎒 Inventory kosong</p>
        <p class="text-sm">Selesaikan task atau quest untuk dapat item</p>
      </div>
    `;
        return;
    }

    container.innerHTML = items.map(i => `
    <div class="bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow">

      <div class="flex flex-col items-center text-center">

        <div class="text-3xl mb-2">🎁</div>

        <p class="font-semibold">${i.name}</p>

        <span class="text-xs mt-2 px-2 py-0.5 rounded
          ${getRarityColor(i.rarity)}">
          ${i.rarity}
        </span>

        <button onclick="useItemUI(${i.id})"
          class="mt-3 bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm">
          Use
        </button>

      </div>

    </div>
  `).join("");
}

// 🎨 WARNA RARITY
function getRarityColor(rarity) {
    switch (rarity) {
        case "common": return "bg-gray-500/20 text-gray-300";
        case "rare": return "bg-blue-500/20 text-blue-400";
        case "epic": return "bg-purple-500/20 text-purple-400";
        case "legendary": return "bg-yellow-500/20 text-yellow-400";
    }
}

// 🖱️ USE BUTTON
window.useItemUI = function (id) {
    useItem(id);
    renderInventory();
    renderDashboard();
};