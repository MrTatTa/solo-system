import { getSchedules, addSchedule } from "../modules/schedule.js";

function getTodayName() {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[new Date().getDay()];
}

function getStatus(start, end) {
    const now = new Date();
    const current = now.toTimeString().slice(0, 5);

    if (current >= start && current <= end) return "ongoing";
    if (current < start) return "upcoming";
    return "done";
}

export function renderSchedule() {
    const container = document.getElementById("scheduleList");
    const today = getTodayName();

    const schedules = getSchedules()
        .filter(s => s.day === today)
        .sort((a, b) => a.start.localeCompare(b.start));

    if (schedules.length === 0) {
        container.innerHTML = `
      <p class="text-gray-400 text-center">No schedule today</p>
    `;
        return;
    }

    container.innerHTML = schedules.map(s => {
        const status = getStatus(s.start, s.end);

        let color = "";
        let label = "";

        if (status === "ongoing") {
            color = "border-green-500 bg-green-500/10";
            label = "🟢 Now";
        } else if (status === "upcoming") {
            color = "border-blue-500 bg-blue-500/10";
            label = "🔵 Upcoming";
        } else {
            color = "border-gray-600 bg-gray-800";
            label = "⚫ Done";
        }

        return `
      <div class="border-l-4 ${color} p-4 mb-4 rounded-xl shadow">

        <div class="flex justify-between items-center">
          <div>
            <p class="font-semibold">${s.title}</p>
            <p class="text-sm text-gray-400">
              ${s.start} - ${s.end}
            </p>
          </div>

          <span class="text-xs px-2 py-1 rounded bg-black/30">
            ${label}
          </span>
        </div>

      </div>
    `;
    }).join("");
}

// ➕ ADD
window.addScheduleUI = function () {
    const title = document.getElementById("schTitle").value;
    const day = document.getElementById("schDay").value;
    const start = document.getElementById("schStart").value;
    const end = document.getElementById("schEnd").value;

    if (!title || !start || !end) return;

    addSchedule({ title, day, start, end });

    document.getElementById("schTitle").value = "";

    renderSchedule();
};