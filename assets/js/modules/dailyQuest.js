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
let dayCount = load("questDayCount") || 1;

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
    const today = getToday();

    if (lastDate !== today) {

        // 🔥 CEK KEMARIN
        if (lastDate) {
            const unfinished = quests.some(q => !q.done && !q.penalty);

            if (unfinished) {
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
                // ✅ kalau semua selesai → naik streak hari
                dayCount++;
            }
        }

        // 🔄 RESET QUEST
        quests = quests.map(q => ({
            ...q,
            done: false
        }));

        lastDate = today;

        save("dailyQuests", quests);
        save("lastQuestDate", today);
        save("questDayCount", dayCount);
    }
}

// 📥 GET
export function getQuests() {
    return quests || [];
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