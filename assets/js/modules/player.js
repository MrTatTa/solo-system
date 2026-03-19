import { save, load } from "../storage.js";
import { defaultPlayer } from "../../../data/defaultData.js";

let player = load("player") || defaultPlayer;

// 🎯 CONFIG
const BASE_EXP = 100;
const GROWTH = 1.5;

// 🔥 INIT STATS (ANTI ERROR)
function initStats() {
    if (!player.stats) {
        player.stats = {};
    }

    const defaultStats = {
        expMultiplier: { level: 1, value: 1 },
        goldMultiplier: { level: 1, value: 1 },
        luck: { level: 1, value: 1 },
        comboMultiplier: { level: 1, value: 1 }
    };

    for (let key in defaultStats) {
        if (!player.stats[key] || typeof player.stats[key] !== "object") {
            player.stats[key] = defaultStats[key];
        }
    }
}

initStats();

// 📦 GET PLAYER
export function getPlayer() {
    sanitizePlayer();
    return player;
}

// 💾 SAVE
export function savePlayer() {
    save("player", player);
}

// 🔥 EXP REQUIRED
export function getExpRequired(level = player.level) {
    return Math.floor(BASE_EXP * Math.pow(GROWTH, level - 1));
}

// ➕ ADD EXP (🔥 pake multiplier)
export function addExp(amount) {
    let leveledUp = false;

    const multiplier = player.stats.expMultiplier?.value || 1;
    const final = Math.floor(amount * multiplier);

    player.exp += final;

    while (player.exp >= getExpRequired()) {
        player.exp -= getExpRequired();
        player.level++;
        leveledUp = true;
    }

    // 🛡️ ANTI NaN
    if (isNaN(player.exp)) player.exp = 0;

    savePlayer();
    return leveledUp;
}

// 💰 ADD GOLD (🔥 pake multiplier)
export function addGold(amount) {
    const multiplier = player.stats.goldMultiplier?.value || 1;
    const final = Math.floor(amount * multiplier);

    player.gold += final;

    // 🛡️ ANTI NaN
    if (isNaN(player.gold)) player.gold = 0;

    savePlayer();
}

function sanitizePlayer() {
    if (isNaN(player.exp)) player.exp = 0;
    if (isNaN(player.gold)) player.gold = 0;
    if (!player.level) player.level = 1;
}

// ⚠️ PENALTY
export function applyPenalty() {
    player.exp -= 20;

    if (player.exp < 0) player.exp = 0;

    player.streak = 0;

    savePlayer();
}

// UPGRADE STAT
export function upgradeStat(stat) {
    const data = player.stats[stat];

    const cost = Math.floor(200 * Math.pow(1.5, data.level));

    if (player.gold < cost) return false;

    player.gold -= cost;
    data.level++;

    switch (stat) {
        case "expMultiplier":
            data.value += 0.1;
            break;

        case "goldMultiplier":
            data.value += 0.1;
            break;

        case "luck":
            data.value += 0.2;
            break;

        case "comboMultiplier":
            data.value += 0.1;
            break;
    }

    savePlayer();
    return true;
}