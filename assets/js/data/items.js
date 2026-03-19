export const ITEM_POOL = {
    common: generateItems("Common", 100, {
        exp: [0.005, 0.01],   // 0.5% - 1%
        gold: [0.005, 0.01]
    }),

    rare: generateItems("Rare", 120, {
        exp: [0.01, 0.03],
        gold: [0.01, 0.025]
    }),

    epic: generateItems("Epic", 150, {
        exp: [0.03, 0.07],
        gold: [0.02, 0.05],
        special: true
    }),

    legendary: generateItems("Legendary", 200, {
        exp: [0.07, 0.15],
        gold: [0.05, 0.12],
        special: true
    })
};

function generateItems(rarityName, count, config) {
    const items = [];

    const names = [
        "Potion", "Elixir", "Core", "Crystal", "Essence",
        "Shard", "Orb", "Fragment", "Scroll", "Capsule"
    ];

    for (let i = 0; i < count; i++) {
        const typeRand = Math.random();

        let effect = "exp";
        let scale = randomRange(config.exp);

        if (typeRand > 0.6) {
            effect = "gold";
            scale = randomRange(config.gold);
        }

        // 🔥 special effect
        if (config.special && typeRand > 0.85) {
            effect = getSpecialEffect();
            scale = null;
        }

        const name =
            `${rarityName} ${names[Math.floor(Math.random() * names.length)]} #${i}`;

        items.push({
            name,
            effect,
            scale, // 🔥 bukan value lagi
            rarity: rarityName.toLowerCase()
        });
    }

    return items;
}

function randomRange([min, max]) {
    return Math.random() * (max - min) + min;
}

function getSpecialEffect() {
    const effects = [
        "double_exp",
        "instant_level",
        "gold_multiplier",
        "exp_boost"
    ];

    return effects[Math.floor(Math.random() * effects.length)];
}