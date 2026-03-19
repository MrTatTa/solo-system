import { save, load } from "../storage.js";
import { defaultPlayer } from "../../../data/defaultData.js";

let player = load("player") || defaultPlayer;

// 🎯 CONFIG
const BASE_EXP = 100;
const GROWTH = 1.5;

// 📦 GET PLAYER
export function getPlayer() {
    return player;
}

// 💾 SAVE
export function savePlayer() {
    save("player", player);
}

// 🔥 EXP YANG DIBUTUHKAN
export function getExpRequired(level = player.level) {
    return Math.floor(BASE_EXP * Math.pow(GROWTH, level - 1));
}

// ➕ ADD EXP
export function addExp(amount) {
    let leveledUp = false;

    player.exp += amount;

    // 🔁 LOOP biar bisa naik lebih dari 1 level
    while (player.exp >= getExpRequired()) {
        player.exp -= getExpRequired();
        player.level++;
        leveledUp = true;
    }

    savePlayer();
    return leveledUp;
}

// 💰 GOLD
export function addGold(amount) {
    player.gold += amount;
    savePlayer();
}

// ⚠️ PENALTY
export function applyPenalty() {
    player.exp -= 20;

    if (player.exp < 0) player.exp = 0;

    player.streak = 0;

    savePlayer();
}