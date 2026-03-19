import { getPlayer } from "./player.js";
import { ITEM_POOL } from "../data/items.js";

// 🎯 RARITY CONFIG
const RARITY = {
    common: { chance: 60 },
    rare: { chance: 25 },
    epic: { chance: 10 },
    legendary: { chance: 5 }
};

// 🎁 REWARD POOL (UPGRADED ITEM STRUCTURE)
const rewardPool = {
    common: [
        { type: "exp", value: 15 },
        { type: "exp", value: 20 },
        { type: "gold", value: 20 },
        { type: "gold", value: 30 },

        ...ITEM_POOL.common.map(item => ({
            type: "item",
            value: item
        }))
    ],

    rare: [
        { type: "exp", value: 40 },
        { type: "exp", value: 60 },
        { type: "gold", value: 70 },
        { type: "gold", value: 90 },

        ...ITEM_POOL.rare.map(item => ({
            type: "item",
            value: item
        }))
    ],

    epic: [
        { type: "exp", value: 100 },
        { type: "exp", value: 150 },
        { type: "gold", value: 150 },
        { type: "gold", value: 220 },

        ...ITEM_POOL.epic.map(item => ({
            type: "item",
            value: item
        }))
    ],

    legendary: [
        { type: "exp", value: 250 },
        { type: "exp", value: 400 },
        { type: "gold", value: 300 },
        { type: "gold", value: 500 },

        ...ITEM_POOL.legendary.map(item => ({
            type: "item",
            value: item
        }))
    ]
};

// 🎲 PILIH RARITY
function rollRarity() {
    const player = getPlayer();
    const luck = player.stats?.luck || 1;

    const rand = Math.random() * 100;

    let cumulative = 0;

    for (let key in RARITY) {
        // 🔥 luck boost rarity tinggi
        let chance = RARITY[key].chance;

        if (key === "rare") chance *= (1 + luck * 0.05);
        if (key === "epic") chance *= (1 + luck * 0.08);
        if (key === "legendary") chance *= (1 + luck * 0.1);

        cumulative += chance;

        if (rand <= cumulative) return key;
    }

    return "common";
}

// 📈 SCALE EXP & GOLD
function scaleReward(reward) {
    const player = getPlayer();
    const level = player.level;

    if (reward.type === "exp" || reward.type === "gold") {
        return {
            ...reward,
            value: Math.floor(reward.value * (1 + level * 0.1))
        };
    }

    return reward;
}

// 🏗️ FORMAT ITEM
function formatItem(itemData, rarity) {
    return {
        id: Date.now() + Math.random(),
        name: itemData.name,
        type: "consumable",
        effect: itemData.effect || "none",
        value: itemData.value || 0,
        rarity
    };
}

// 🎁 MAIN FUNCTION
export function getRandomReward() {
    const rarity = rollRarity();

    const pool = rewardPool[rarity];
    const baseReward = pool[Math.floor(Math.random() * pool.length)];

    const finalReward = scaleReward(baseReward);

    // 🧠 HANDLE ITEM
    if (finalReward.type === "item") {
        const item = formatItem(finalReward.value, rarity);

        return {
            type: "item",
            value: item,
            rarity,
            label: `${rarity.toUpperCase()} • ${item.name}`
        };
    }

    // 🏷️ LABEL NON-ITEM
    let label = "";

    if (finalReward.type === "exp") {
        label = `${rarity.toUpperCase()} • EXP +${finalReward.value}`;
    } else if (finalReward.type === "gold") {
        label = `${rarity.toUpperCase()} • Gold +${finalReward.value}`;
    }

    return {
        ...finalReward,
        rarity,
        label
    };
}