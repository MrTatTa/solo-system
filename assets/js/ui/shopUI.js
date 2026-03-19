import { getShop, buyItem, refreshShop, getRefreshPrice } from "../modules/shop.js";
import { renderInventory } from "./inventoryUI.js";
import { renderDashboard } from "./dashboardUI.js";

export function renderShop() {
    const container = document.getElementById("shopList");
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

// 🛒 BUY
window.buyItemUI = function (id) {
    const success = buyItem(id);

    if (success) {
        alert("Item dibeli!");
    } else {
        alert("Gold tidak cukup!");
    }

    renderShop();
    renderInventory();
    renderDashboard();
};

// 🔄 REFRESH
window.refreshShopUI = function () {
    const price = getRefreshPrice();

    const confirmBuy = confirm(`Refresh shop? Cost: ${price} gold`);

    if (!confirmBuy) return;

    const success = refreshShop();

    if (!success) {
        alert("Gold tidak cukup!");
        return;
    }

    renderShop();
};