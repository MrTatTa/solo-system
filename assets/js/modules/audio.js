const audio = document.getElementById("bgm");

if (audio) {

    // 🔥 restore posisi
    const savedTime = localStorage.getItem("bgmTime");
    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    // 🔥 cek apakah user sudah pernah interact
    const hasInteracted = localStorage.getItem("bgmAllowed");

    if (hasInteracted) {
        audio.play().catch(() => { });
    }

    // 🔥 simpan posisi
    setInterval(() => {
        localStorage.setItem("bgmTime", audio.currentTime);
    }, 1000);

    // 🔥 volume
    audio.volume = 0.3;

    // 🔥 DETECT INTERACTION SEKALI
    function unlockAudio() {
        localStorage.setItem("bgmAllowed", "true");

        audio.play().catch(() => { });

        document.removeEventListener("click", unlockAudio);
    }

    document.addEventListener("click", unlockAudio);
}