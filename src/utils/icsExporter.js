export const exportToICS = (schedule) => {
    if (!schedule || schedule.length === 0) {
        alert('First, generate a schedule to export.');
        return;
    }

    let icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//GeminiScheduler//EN",
    ];

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');

    schedule.forEach(item => {
        const [startH, startM] = item.startTime.split(':');
        const [endH, endM] = item.endTime.split(':');
        const dtstart = `${y}${m}${d}T${startH}${startM}00`;
        const dtend = `${y}${m}${d}T${endH}${endM}00`;
        const uid = `${dtstart}-${Math.random().toString(36).substr(2, 9)}@geminischeduler`;

        icsContent.push(
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${dtstart}`,
            `DTSTART:${dtstart}`,
            `DTEND:${dtend}`,
            `SUMMARY:${item.task}`,
            `DESCRIPTION:Priority: ${item.priority}`,
            "END:VEVENT"
        );
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'my-schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};