import { save, load } from "../storage.js";
import { addItem } from "./inventory.js";
import { getPlayer, savePlayer } from "./player.js";
import { emit } from "./eventBus.js";
import { ITEM_POOL } from "../data/items.js";

let shop = load("shop") || [];
let lastRefresh = load("shopLastRefresh") || 0;
let refreshCount = load("shopRefreshCount") || 0;

// 🎯 RARITY
const RARITY = {
    common: { chance: 60, basePrice: 200 },
    rare: { chance: 25, basePrice: 600 },
    epic: { chance: 10, basePrice: 1500 },
    legendary: { chance: 5, basePrice: 4000 }
};

function getPlayerMultiplier() {
    const player = getPlayer();

    // scaling berdasarkan level / exp (pilih salah satu)
    const level = player.level || 1;

    return 1 + (level * 0.1);
    // contoh:
    // lvl 1 = 1.1
    // lvl 10 = 2x
}

// 🎁 ITEM POOL


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

        const finalItem = {
            id: Date.now() + Math.random(),
            name: baseItem.name,
            effect: baseItem.effect,
            value: baseItem.value || 0,
            rarity: rarity
        };

        const base = RARITY[rarity].basePrice;
        const multiplier = getPlayerMultiplier();
        const randomFactor = 0.85 + Math.random() * 0.3;

        items.push({
            id: Date.now() + i,
            rarity,

            price: Math.floor(base * multiplier * randomFactor),
            item: finalItem
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

    addItem(data.item);

    emit("goldChanged", player.gold); // 🔥 CORE FIX

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

    emit("goldChanged", player.gold); // 🔥 CORE FIX

    return true;
}

// 📈 SCALING HARGA REFRESH
export function getRefreshPrice() {
    return 50 + refreshCount * 75;
}