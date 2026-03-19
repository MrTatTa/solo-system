import { save, load } from "../storage.js";
import { defaultDailyQuests } from "../../../data/defaultData.js";
import { getToday } from "../utils.js";

import { addExp, addGold, applyPenalty, getPlayer } from "./player.js";
import { getRandomReward } from "./reward.js";
import { addItem } from "./inventory.js";
import { showRewardPopup } from "./rewardPopup.js";

// 📦 INIT
let quests = load("dailyQuests") || [...defaultDailyQuests];
let lastDate = load("lastQuestDate");
let dayCount = load("questDayCount") || 0;
const RESET_INTERVAL = 1000 * 60 * 60 * 24; // 24 jam

export function getTimeUntilReset() {
    const now = new Date();

    const nextReset = new Date();
    nextReset.setHours(4, 0, 0, 0); // jam 04:00

    // kalau sekarang sudah lewat jam 4 → ambil besok
    if (now >= nextReset) {
        nextReset.setDate(nextReset.getDate() + 1);
    }

    return nextReset.getTime() - now.getTime();
}

// 📈 SCALING FUNCTION
function scaleReward(base) {
    const player = getPlayer();
    const level = player.level;

    // scaling gabungan (hari + level)
    const multiplier = 1 + (dayCount * 0.05) + (level * 0.05);

    return Math.floor(base * multiplier);
}

// 🚀 INIT SYSTEM
export function initDailyQuest() {
    const now = new Date();

    const last = lastDate ? new Date(lastDate) : null;

    const todayReset = new Date();
    todayReset.setHours(4, 0, 0, 0);

    // kalau sekarang sebelum jam 4 → pakai reset kemarin
    if (now < todayReset) {
        todayReset.setDate(todayReset.getDate() - 1);
    }

    // kalau belum pernah reset atau sudah lewat reset berikutnya
    if (!last || last < todayReset) {

        // 🔥 CEK QUEST KEMARIN
        if (last) {
            const unfinished = quests.some(q => !q.done && !q.penalty);

            if (unfinished) {
                // ❌ streak putus
                dayCount = 0;

                applyPenalty();

                quests = quests.filter(q => !q.penalty);

                quests.push({
                    id: Date.now(),
                    title: "💀 Penalty: Push Up 50x",
                    exp: 50,
                    gold: 0,
                    done: false,
                    penalty: true
                });

            } else {
                // ✅ streak naik
                dayCount += 1;
            }
        } else {
            // ✅ pertama kali pakai → mulai dari 1
            dayCount = 1;
        }

        // 🔄 RESET QUEST
        quests = quests.map(q => ({
            ...q,
            done: false
        }));

        lastDate = now.toISOString();

        save("dailyQuests", quests);
        save("lastQuestDate", lastDate);
        save("questDayCount", dayCount);
    }
}

// 📥 GET
export function getQuests() {
    return quests || [];
}

export function getStreak() {
    return dayCount || 0;
}

// ➕ TAMBAH QUEST CUSTOM
export function addDailyQuest(title, exp = 20, gold = 10) {
    const newQuest = {
        id: Date.now(),
        title,
        exp,
        gold,
        done: false,
        penalty: false
    };

    quests.push(newQuest);
    save("dailyQuests", quests);
}

// ❌ DELETE QUEST (optional)
export function deleteDailyQuest(id) {
    quests = quests.filter(q => q.id !== id);
    save("dailyQuests", quests);
}

// ✅ COMPLETE
export function completeQuest(id) {
    const quest = quests.find(q => q.id === id);

    if (!quest || quest.done) return;

    quest.done = true;

    // 📈 SCALE REWARD
    const finalExp = scaleReward(quest.exp);
    const finalGold = scaleReward(quest.gold);

    addExp(finalExp);
    addGold(finalGold);

    // 🎁 RANDOM REWARD
    const reward = getRandomReward();

    if (reward.type === "exp") {
        addExp(reward.value);
    } else if (reward.type === "gold") {
        addGold(reward.value);
    } else if (reward.type === "item") {
        addItem(reward.value);
    }

    showRewardPopup({
        ...reward,
        label: `${reward.label} + Bonus (${finalExp} EXP / ${finalGold} Gold)`
    });

    save("dailyQuests", quests);
}