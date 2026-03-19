import { save, load } from "../storage.js";
import { addExp, addGold, getPlayer } from "./player.js";

let inventory = load("inventory") || [];

// 📦 GET
export function getInventory() {
    return inventory;
}

// ➕ ADD ITEM
export function addItem(item) {
    if (typeof item === "string") {
        item = {
            name: item,
            effect: "none",
            rarity: "common"
        };
    }

    const newItem = {
        id: Date.now() + Math.random(),
        name: item.name || "Unknown Item",
        effect: item.effect || "none",

        // 🔥 support 2 system
        value: item.value || null,
        scale: item.scale || null,

        rarity: item.rarity || "common"
    };

    inventory.push(newItem);
    save("inventory", inventory);
}

// ❌ REMOVE
export function removeItem(id) {
    inventory = inventory.filter(i => i.id !== id);
    save("inventory", inventory);
}

// ⚡ USE ITEM (UPGRADED)
export function useItem(id) {
    const index = inventory.findIndex(i => i.id === id);
    if (index === -1) return;

    const item = inventory[index];
    const player = getPlayer();

    let message = "";

    switch (item.effect) {

        // 🔥 EXP (support value + scale)
        case "exp": {
            let gain = 0;

            if (item.scale) {
                gain = Math.floor(player.expToNextLevel * item.scale);
            } else {
                gain = item.value || 50;
            }

            addExp(gain);
            message = `+${gain} EXP`;
            break;
        }

        // 💰 GOLD
        case "gold": {
            let gain = 0;

            if (item.scale) {
                gain = Math.floor(player.gold * item.scale + 50);
            } else {
                gain = item.value || 50;
            }

            addGold(gain);
            message = `+${gain} Gold`;
            break;
        }

        // 🔥 BIG EXP
        case "instant_big_exp": {
            const gain = item.value
                ? item.value
                : Math.floor(player.expToNextLevel * 0.25);

            addExp(gain);
            message = `🔥 Big EXP +${gain}`;
            break;
        }

        // ⚡ DOUBLE EXP (placeholder system)
        case "double_exp":
            message = "🔥 Double EXP aktif (belum full system)";
            break;

        // 🧠 LEVEL UP LANGSUNG
        case "instant_level":
            addExp(player.expToNextLevel);
            message = "🚀 Level Up!";
            break;

        // 💎 GOLD MULTIPLIER (simple version)
        case "gold_multiplier":
            addGold(500);
            message = "💰 Bonus Gold!";
            break;

        default:
            message = "Item tidak punya efek";
    }

    // ❌ remove item
    inventory.splice(index, 1);
    save("inventory", inventory);

    // 🔥 DEBUG / FEEDBACK
    console.log(`[ITEM USED] ${item.name} → ${message}`);
}