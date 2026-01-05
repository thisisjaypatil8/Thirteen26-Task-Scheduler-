// src/services/geminiService.js

// Using 1.5-Flash as it is more stable for high-volume free tier usage than 2.0
const GEMINI_API_URL_BASE = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=";

const FIXED_EVENTS = `
    - Sleep (10pm - 6am)
    - Breakfast (8:30am - 9am)
    - Lunch (1pm - 1:30pm)
    - Dinner (8pm - 9pm)
    - Shower (8am - 8:30am)
`;

// It now accepts currentTime
export const getAISchedule = async (taskInput, apiKey, currentTime) => {
    
    // Format the current time for the prompt
    const hh = String(currentTime.getHours()).padStart(2, '0');
    const mm = String(currentTime.getMinutes()).padStart(2, '0');
    const timeString = `${hh}:${mm}`;

    const prompt = `
        You are an expert executive assistant. Your job is to create a 24-hour schedule.

        CONTEXT:
        - Today is ${new Date().toLocaleDateString()}.
        - The CURRENT TIME is ${timeString}. You MUST NOT schedule any tasks or events before this time.
        - The user's 'fixed' events are: ${FIXED_EVENTS}
        - The user's sleep time is approximately 10pm (22:00). Do not schedule tasks past this time.

        USER TASK LIST:
        ${taskInput}

        YOUR TASK:
        1.  Analyze the user's task list.
        2.  Schedule all tasks ONLY for the remaining time of the day (between ${timeString} and 22:00).
        3.  Intelligently assign 'startTime', 'endTime', and 'priority' for tasks without them.
        4.  If a task from the list CANNOT be scheduled today, list it in a 'couldNotSchedule' array.
        5.  If all tasks are scheduled and there is time left, you MUST label these blocks 'Free Time'.
        6.  Do NOT add generic 'Focus Work' or 'Admin Tasks' unless the user explicitly requested them.
        7.  You MUST reply with ONLY a valid JSON object. Do not write any other text.

        OUTPUT FORMAT (JSON Object only):
        {
            "schedule": [
                { "task": "Task Name", "startTime": "HH:MM", "endTime": "HH:MM", "priority": "high" },
                { "task": "Free Time", "startTime": "HH:MM", "endTime": "HH:MM", "priority": "low" }
            ],
            "couldNotSchedule": [
                "Task that didn't fit"
            ]
        }
    `;

    try {
        const response = await fetch(GEMINI_API_URL_BASE + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Prevent crash if error isn't JSON
            
            // Handle Rate Limiting (429) explicitly
            if (response.status === 429) {
                throw new Error("You are generating too fast! The free tier has a limit. Please wait 1 minute and try again.");
            }
            
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        let jsonString = data.candidates[0].content.parts[0].text;
        jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();

        // Parse the new object structure
        const responseObject = JSON.parse(jsonString);

        const schedule = responseObject.schedule || [];
        const couldNotSchedule = responseObject.couldNotSchedule || [];

        // Sort schedule by start time and add a unique ID
        schedule.sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        const finalSchedule = schedule.map((item, index) => ({
            ...item,
            id: `${item.startTime}-${item.task}-${index}` // Create a stable unique ID
        }));

        // Return an object with both arrays
        return { finalSchedule, couldNotSchedule };

    } catch (error) {
        // Pass the error up so the UI sees it
        console.error("Schedule Generation Error:", error);
        throw error;
    }
};


// --- NEW AI TIPS FUNCTION ---
// It now accepts the generated SCHEDULE, not the taskInput
export const getAITips = async (schedule, apiKey) => {
    
    // Convert the schedule object array to a simple string for the prompt
    const scheduleString = schedule.map(item => 
        `- ${item.task} (${item.startTime} - ${item.endTime}, Priority: ${item.priority})`
    ).join('\n');

    const prompt = `
        You are a world-class productivity coach. A user has this schedule for the rest of their day:
        ---
        ${scheduleString}
        ---
        Your job is to provide 3-5 short, actionable tips to help them *execute* this schedule effectively.
        -   Do not just repeat the schedule.
        -   Look for high-priority tasks and give advice on focus.
        -   Look for 'DSA' or 'lecture' tasks and give learning tips.
        -   Look for back-to-back blocks and suggest short breaks.
        -   Look for 'Free Time' blocks and suggest how to use them to recharge.
        
        You MUST reply with ONLY a valid JSON array of strings. Do not write any other text.
    `;

    try {
        const response = await fetch(GEMINI_API_URL_BASE + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
             if (response.status === 429) {
                 // Return a friendly tip instead of crashing
                return ["⚠️ You're moving too fast for the AI. Take a deep breath and try again in a minute."];
            }
            throw new Error('Failed to fetch tips');
        }

        const data = await response.json();
        let jsonString = data.candidates[0].content.parts[0].text;
        jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error fetching AI tips:", error);
        // Return an error message as a tip so the UI doesn't break
        return ["Tip: AI service is currently unavailable. Stick to your schedule!"]; 
    }
};
