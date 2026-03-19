import { save, load } from "../storage.js";

let schedules = load("schedules") || [];

export function getSchedules() {
    return schedules;
}

export function addSchedule(data) {
    const newSchedule = {
        id: Date.now(),
        title: data.title,
        day: data.day, // Senin, Selasa, dll
        start: data.start,
        end: data.end
    };

    schedules.push(newSchedule);
    save("schedules", schedules);
}