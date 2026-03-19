export function showRewardPopup(reward) {
    const popup = document.getElementById("rewardPopup");
    const card = document.getElementById("rewardCard");
    const content = document.getElementById("rewardContent");

    // 🎨 WARNA BERDASARKAN RARITY
    let color = "";

    switch (reward.rarity) {
        case "common":
            color = "text-gray-300";
            break;
        case "rare":
            color = "text-blue-400";
            break;
        case "epic":
            color = "text-purple-400";
            break;
        case "legendary":
            color = "text-yellow-400";
            break;
    }

    content.innerHTML = `
    <span class="${color}">
      ${reward.label}
    </span>
  `;

    popup.classList.remove("hidden");

    setTimeout(() => {
        card.classList.remove("scale-75", "opacity-0");
        card.classList.add("scale-100", "opacity-100");
    }, 10);
}

// CLOSE
window.closeRewardPopup = function () {
    const popup = document.getElementById("rewardPopup");
    const card = document.getElementById("rewardCard");

    card.classList.add("scale-75", "opacity-0");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 200);
};