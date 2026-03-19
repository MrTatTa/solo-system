export const defaultPlayer = {
    level: 1,
    exp: 0,
    gold: 0,
    streak: 0,
    lastLogin: null,
    stats: {
        expMultiplier: 1,
        goldMultiplier: 1,
        luck: 1,
        comboBoost: 1,
        streakGuard: 0 // % chance
    }
};

export const defaultDailyQuests = [
    {
        id: 1,
        title: "Push Up 20x",
        exp: 20,
        gold: 10,
        done: false
    },
    {
        id: 2,
        title: "Plank 1 menit",
        exp: 25,
        gold: 15,
        done: false
    }
];