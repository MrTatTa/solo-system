import { save, load } from "../storage.js";
import { addExp, addGold } from "./player.js";

let inventory = load("inventory") || [];

// 📦 GET
export function getInventory() {
    return inventory;
}

// ➕ ADD ITEM (FIXED)
export function addItem(item) {
    // 🔥 HANDLE LEGACY STRING
    if (typeof item === "string") {
        item = {
            name: item,
            effect: "none",
            value: 0,
            rarity: "common"
        };
    }

    // 🔥 FIX: pastikan semua field ada
    const newItem = {
        id: Date.now() + Math.random(), // biar pasti unik
        name: item.name || "Unknown Item",
        effect: item.effect || "none",
        value: item.value || 0,
        rarity: item.rarity || "common"
    };

    inventory.push(newItem);
    save("inventory", inventory);
}

// ❌ REMOVE ITEM (AMAN)
export function removeItem(id) {
    inventory = inventory.filter(i => i.id !== id);
    save("inventory", inventory);
}

// ⚡ USE ITEM (FIXED)
export function useItem(id) {
    const index = inventory.findIndex(i => i.id === id);
    if (index === -1) return;

    const item = inventory[index];

    // 🔥 EFFECT SYSTEM
    switch (item.effect) {

        case "exp":
            addExp(item.value || 50);
            break;

        case "gold":
            addGold(item.value || 50);
            break;

        case "double_exp":
            alert("🔥 EXP Boost aktif (belum full system)");
            break;

        case "instant_big_exp":
            addExp(item.value || 200);
            break;

        default:
            alert("Item tidak punya efek");
    }

    // 🔥 FIX: hapus 1 item saja (bukan semua)
    inventory.splice(index, 1);

    save("inventory", inventory);
}