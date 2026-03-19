export function showShopPopup(message, type = "success") {
    const popup = document.getElementById("shopPopup"); // ✅ sekarang benar
    const card = document.getElementById("rewardCard");
    const content = document.getElementById("rewardContent");

    if (!popup || !card || !content) {
        console.error("Popup element not found!");
        return;
    }

    let color = "";
    let title = "";

    if (type === "success") {
        color = "text-green-400";
        title = "✅ Success";
    } else {
        color = "text-red-400";
        title = "❌ Failed";
    }

    card.querySelector("h2").innerText = title;

    content.innerHTML = `
      <span class="${color}">
        ${message}
      </span>
    `;

    popup.classList.remove("hidden");

    setTimeout(() => {
        card.classList.remove("scale-75", "opacity-0");
        card.classList.add("scale-100", "opacity-100");
    }, 10);
    console.log("POPUP:", document.getElementById("shopPopup"));
}

window.closeShopPopup = function () {
    const popup = document.getElementById("shopPopup");
    const card = document.getElementById("rewardCard");

    card.classList.add("scale-75", "opacity-0");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 200);
};