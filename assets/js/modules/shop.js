import { save, load } from "../storage.js";
import { addItem } from "./inventory.js";
import { getPlayer, savePlayer } from "./player.js";

let shop = load("shop") || [];
let lastRefresh = load("shopLastRefresh") || 0;
let refreshCount = load("shopRefreshCount") || 0;

// 🎯 RARITY
const RARITY = {
    common: { chance: 60, price: 50 },
    rare: { chance: 25, price: 100 },
    epic: { chance: 10, price: 200 },
    legendary: { chance: 5, price: 400 }
};

// 🎁 ITEM POOL
const ITEM_POOL = {
    common: [
        { name: "Water 💧", effect: "exp", value: 10 },
        { name: "Energy Bar 🍫", effect: "exp", value: 15 },
        { name: "Banana 🍌", effect: "exp", value: 12 },
        { name: "Coffee ☕", effect: "gold", value: 15 }
    ],

    rare: [
        { name: "Protein Shake 🧃", effect: "exp", value: 50 },
        { name: "Energy Drink ⚡", effect: "exp", value: 60 },
        { name: "Electrolyte Drink 💦", effect: "gold", value: 80 }
    ],

    epic: [
        { name: "Pre-Workout 🔥", effect: "exp", value: 120 },
        { name: "Focus Pill 🧠", effect: "exp", value: 150 },
        { name: "Recovery Kit 🧊", effect: "instant_big_exp", value: 200 }
    ],

    legendary: [
        { name: "EXP Potion x2 🧪", effect: "double_exp" },
        { name: "EXP Potion x3 🧪✨", effect: "double_exp" },
        { name: "Golden Ticket 🎟️", effect: "gold", value: 300 },
        { name: "Discipline Core 💎", effect: "instant_big_exp", value: 300 }
    ]
};

// 🎲 ROLL RARITY
function rollRarity() {
    const rand = Math.random() * 100;
    let cumulative = 0;

    for (let key in RARITY) {
        cumulative += RARITY[key].chance;
        if (rand <= cumulative) return key;
    }

    return "common";
}

// 🎁 GENERATE SHOP
function generateShop(count = 10) {
    const items = [];

    for (let i = 0; i < count; i++) {
        const rarity = rollRarity();
        const pool = ITEM_POOL[rarity];

        const baseItem = pool[Math.floor(Math.random() * pool.length)];

        // 🔥 IMPORTANT: bentuk object inventory-ready
        const finalItem = {
            id: Date.now() + Math.random(), // biar unik
            name: baseItem.name,
            effect: baseItem.effect,
            value: baseItem.value || 0,
            rarity: rarity
        };

        items.push({
            id: Date.now() + i,
            rarity,
            price: Math.floor(RARITY[rarity].price * (0.8 + Math.random() * 0.4)),
            item: finalItem // ✅ sudah clean
        });
    }

    return items;
}

// 🔄 AUTO REFRESH (12 jam)
export function initShop() {
    const now = Date.now();
    const twelveHours = 1000 * 60 * 60 * 12;

    if (now - lastRefresh > twelveHours) {
        shop = generateShop();
        lastRefresh = now;
        refreshCount = 0;

        save("shop", shop);
        save("shopLastRefresh", lastRefresh);
        save("shopRefreshCount", refreshCount);
    }
}

export function getShop() {
    return shop;
}

// 🛒 BUY ITEM
export function buyItem(id) {
    const player = getPlayer();
    const data = shop.find(i => i.id === id);

    if (!data) return false;
    if (player.gold < data.price) return false;

    player.gold -= data.price;
    savePlayer();

    // 🔥 FIX: kirim object lengkap
    addItem(data.item);

    return true;
}

// 🔄 REFRESH SHOP
export function refreshShop() {
    const player = getPlayer();
    const price = getRefreshPrice();

    if (player.gold < price) return false;

    player.gold -= price;
    savePlayer();

    shop = generateShop();
    refreshCount++;

    save("shop", shop);
    save("shopRefreshCount", refreshCount);

    return true;
}

// 📈 SCALING HARGA REFRESH
export function getRefreshPrice() {
    return 50 + refreshCount * 75;
}