import { getPlayer } from "./player.js";

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

        {
            type: "item",
            value: { name: "Water 💧", effect: "exp", value: 10 }
        },
        {
            type: "item",
            value: { name: "Energy Bar 🍫", effect: "exp", value: 15 }
        },
        {
            type: "item",
            value: { name: "Banana 🍌", effect: "exp", value: 12 }
        },
        {
            type: "item",
            value: { name: "Coffee ☕", effect: "gold", value: 15 }
        }
    ],

    rare: [
        { type: "exp", value: 40 },
        { type: "exp", value: 60 },
        { type: "gold", value: 70 },
        { type: "gold", value: 90 },

        {
            type: "item",
            value: { name: "Protein Shake 🧃", effect: "exp", value: 50 }
        },
        {
            type: "item",
            value: { name: "Energy Drink ⚡", effect: "exp", value: 60 }
        },
        {
            type: "item",
            value: { name: "Electrolyte Drink 💦", effect: "gold", value: 80 }
        }
    ],

    epic: [
        { type: "exp", value: 100 },
        { type: "exp", value: 150 },
        { type: "gold", value: 150 },
        { type: "gold", value: 220 },

        {
            type: "item",
            value: { name: "Pre-Workout 🔥", effect: "exp", value: 120 }
        },
        {
            type: "item",
            value: { name: "Focus Pill 🧠", effect: "exp", value: 150 }
        },
        {
            type: "item",
            value: { name: "Recovery Kit 🧊", effect: "instant_big_exp", value: 200 }
        }
    ],

    legendary: [
        { type: "exp", value: 250 },
        { type: "exp", value: 400 },
        { type: "gold", value: 300 },
        { type: "gold", value: 500 },

        {
            type: "item",
            value: { name: "EXP Potion x2 🧪", effect: "double_exp" }
        },
        {
            type: "item",
            value: { name: "EXP Potion x3 🧪✨", effect: "double_exp" }
        },
        {
            type: "item",
            value: { name: "Golden Ticket 🎟️", effect: "gold", value: 300 }
        },
        {
            type: "item",
            value: { name: "Discipline Core 💎", effect: "instant_big_exp", value: 300 }
        }
    ]
};

// 🎲 PILIH RARITY
function rollRarity() {
    const rand = Math.random() * 100;

    let cumulative = 0;

    for (let key in RARITY) {
        cumulative += RARITY[key].chance;
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