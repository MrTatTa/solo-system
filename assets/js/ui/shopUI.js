import { getShop, buyItem, refreshShop, getRefreshPrice } from "../modules/shop.js";
import { renderInventory } from "./inventoryUI.js";
import { renderDashboard } from "./dashboardUI.js";
import { getPlayer } from "../modules/player.js";
import { on } from "../modules/eventBus.js";
import { showShopPopup } from "./shopPopup.js"; // ✅ NEW

// 🛒 RENDER SHOP
export function renderShop() {
  const container = document.getElementById("shopList");
  if (!container) return;

  const items = getShop();

  container.innerHTML = items.map(i => {

    const color = {
      common: "border-gray-600",
      rare: "border-blue-500",
      epic: "border-purple-500",
      legendary: "border-yellow-500"
    }[i.rarity];

    return `
      <div class="bg-gray-900/60 ${color} border p-5 rounded-2xl shadow hover:scale-105 transition">

        <div class="text-center">

          <p class="font-semibold mb-1">${i.item.name}</p>

          <p class="text-xs text-gray-400 mb-2 uppercase">
            ${i.rarity}
          </p>

          <p class="text-sm text-gray-400 mb-3">
            ${i.item.effect} 
            ${i.item.value ? "+ " + i.item.value : ""}
          </p>

          <p class="text-yellow-400 font-bold mb-3">
            💰 ${i.price}
          </p>

          <button onclick="buyItemUI(${i.id})"
            class="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-lg text-sm">
            Buy
          </button>

        </div>

      </div>
    `;
  }).join("");
}

// 💰 UPDATE GOLD UI
export function updateGoldUI() {
  const player = getPlayer();
  const goldEl = document.getElementById("goldDisplay");

  if (goldEl) {
    goldEl.innerText = `💰 ${player.gold}`;
  }
}

// 🔥 LISTENER
on("goldChanged", () => {
  updateGoldUI();
});

// 🛒 BUY
window.buyItemUI = function (id) {
  const success = buyItem(id);

  if (success) {
    showShopPopup("Item berhasil dibeli", "success");
  } else {
    showShopPopup("Gold tidak cukup", "error");
  }

  renderShop();
  renderInventory();
};

// 🔄 REFRESH
window.refreshShopUI = function () {
  const price = getRefreshPrice();

  const confirmBuy = confirm(`Refresh shop? Cost: ${price} gold`);
  if (!confirmBuy) return;

  const success = refreshShop();

  if (!success) {
    showShopPopup("Gold tidak cukup untuk refresh!", "error");
    return;
  }

  showShopPopup("Shop berhasil di-refresh!", "success");

  renderShop();
  renderInventory();
};