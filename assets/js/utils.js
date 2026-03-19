export function getToday() {
    const now = new Date();

    // kalau sebelum jam 4 pagi, anggap masih hari kemarin
    if (now.getHours() < 4) {
        now.setDate(now.getDate() - 1);
    }

    return now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0');
}