class MonthDisplay {
    constructor(year, month) {
        this.year = year;
        this.month = month;
        this.dayStart = new Date(`${month} 1, ${year}`).getDay();
        this.daysInMonth = new Date(year, new Date(`${month} 1, ${year}`).getMonth() + 1, 0).getDate();
        this.prevMonth = new Date(year, new Date(`${month} 1, ${year}`).getMonth(), 0).getDate();   
    }
}

let currentViewedDate = null;
const monthDisplays = [
    new MonthDisplay(2025, "October"),
    new MonthDisplay(2025, "November"),
    new MonthDisplay(2025, "December")
];
let index = 1;
let events = [];

const prevBtn = document.querySelector('.fa-caret-left');
const nextBtn = document.querySelector('.fa-caret-right');
prevBtn.addEventListener('click', () => {
    if (index > 0) {
        index--;
        updateCalendar();
        document.querySelector('#calendar-list').classList.add("hidden");
        currentViewedDate = null;
    }   
});
nextBtn.addEventListener('click', () => {
    if (index < monthDisplays.length - 1) {
        index++;
        updateCalendar();
        document.querySelector('#calendar-list').classList.add("hidden");
        currentViewedDate = null;
    }   
});

async function updateCalendar() {
    await createCalendar(monthDisplays[index]);
    await displayEvents(monthDisplays[index]);
    await updateCalendarList();
}

async function createCalendar(monthDisplay) {    
    const displayMonth = document.querySelector('.display-month');
    displayMonth.textContent = `${monthDisplay.month} ${monthDisplay.year}`;
    if (index === 0) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }

    if (index === monthDisplays.length - 1) {
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.classList.remove('disabled');
    }

    const calendarBody = document.getElementById('calendar-content');
    calendarBody.innerHTML = '';

    let totalCells = 0;
    totalCells += (monthDisplay.dayStart + monthDisplay.daysInMonth);
    totalCells += (7 - (totalCells % 7)) % 7;       
    
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        const day = document.createElement('p');
        cell.classList.add('calendar-cell');       
        cell.appendChild(day);

        if (i < monthDisplay.dayStart) {
            const prevMonthDate = monthDisplay.prevMonth - (monthDisplay.dayStart - 1) + i;
            cell.classList.add('empty-cell');
            day.textContent = prevMonthDate;
            cell.classList.add('disabled'); 
        } else if (i >= monthDisplay.dayStart && i < monthDisplay.dayStart + monthDisplay.daysInMonth) {
            const currentDate = i - monthDisplay.dayStart + 1;
            day.textContent = currentDate;
            day.addEventListener("click", () => {
                const dayItem = cell.querySelector('p');
                const dayAnchor = document.getElementById(`day-anchor-point-${currentDate}`);
                if (dayItem) {
                    if (currentViewedDate) {
                        if (currentViewedDate === dayItem) {
                            document.querySelector('#calendar-list').classList.toggle("hidden");
                        } else {
                            document.querySelector('#calendar-list').classList.remove("hidden");
                        }
                        currentViewedDate.classList.remove("viewed-date");
                    } else {
                        document.querySelector('#calendar-list').classList.remove("hidden");
                    }
                    currentViewedDate = dayItem;
                    dayItem.classList.add("viewed-date");   
                }
                if (dayAnchor) {
                    dayAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } 
            })
        } else {              
            const nextMonthDate = i - (monthDisplay.dayStart + monthDisplay.daysInMonth) + 1;
            cell.classList.add('empty-cell');
            day.textContent = nextMonthDate; 
            cell.classList.add('disabled'); 
        }

        if (new Date().getDay() === (i - monthDisplay.dayStart + 1) &&
            new Date().getMonth() === new Date(`${monthDisplay.month} 1, ${monthDisplay.year}`).getMonth() &&
            new Date().getFullYear() === monthDisplay.year) {
            cell.id = 'current-day';
        }

        calendarBody.appendChild(cell);
    }
}

async function displayEvents(monthDisplay ) {
    const orgs = await loadOrgs()
    const events = await loadEvents();
    let monthEvents = events.map(event => ({ ...event, parsedDate: parseEventDate(event.when) }));
    monthEvents = monthEvents.filter(event => {
        if (!event.parsedDate) return false;
        return event.parsedDate.month === monthDisplay.month &&
               event.parsedDate.year === monthDisplay.year;
    });

    const calendarCells = document.querySelectorAll('.calendar-cell');
    for (const event of monthEvents) {
        const start = event.parsedDate.startDay;
        const end = event.parsedDate.endDay;

        if (start === end) {
            const index = monthDisplay.dayStart + start - 1;
            const cell = calendarCells[index];
            let list = cell.querySelector('.event-list');   
            if (!list) {           
                list = document.createElement('div');
                list.classList.add('event-list');
                cell.appendChild(list);
            }
            const img = document.createElement('img');
            img.classList.add('event-item');
            img.src = "./." + orgs.filter(e => (e.id === event.source_org))[0].img;
            img.width = "30";
            img.height = "30";
            list.appendChild(img)
        } else {
            let startIndex = monthDisplay.dayStart + start - 1;
            let startCell = calendarCells[startIndex];
            if (startCell) {
                let list = startCell.querySelector('.event-list');
                if (!list) {
                    list = document.createElement('div');
                    list.classList.add('event-list');
                    startCell.appendChild(list);
                }
                const img = document.createElement('img');
                img.classList.add('event-item');
                img.src = "./." + orgs.filter(e => (e.id === event.source_org))[0].img;
                img.width = "30";
                img.height = "30";
                list.appendChild(img)
            }

            let endIndex = monthDisplay.dayStart + end - 1;
            let endCell = calendarCells[endIndex];
            if (endCell) {
                let list = endCell.querySelector('.event-list');
                if (!list) {
                    list = document.createElement('div');
                    list.classList.add('event-list');
                    endCell.appendChild(list);
                }
                const img = document.createElement('img');
                img.classList.add('event-item');
                img.src = "./." + orgs.filter(e => (e.id === event.source_org))[0].img;
                img.width = "30";
                img.height = "30";
                list.appendChild(img)
            }
        }
    }
}

async function loadEvents() {
    try {
        const response = await fetch('../json/EventContainer.json');
        events = await response.json();
        return events;
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function parseEventDate(whenString) {
    const parts = whenString.split(';')[0].trim();
    const match = parts.match(/(\w+)\s+([\d-]+),\s+(\d{4})/);
    if (match) {
        const month = match[1];
        const dayRange = match[2];
        const year = parseInt(match[3]);
        const [startDay, endDay] = dayRange.includes('-') 
            ? dayRange.split('-').map(d => parseInt(d.trim()))
            : [parseInt(dayRange), parseInt(dayRange)];
        return { month, startDay, endDay, year };
    }
    return null;
}

async function updateCalendarList() {
    createCalendarList(monthDisplays[index]);
}
async function createCalendarList(monthDisplay) {    
    const calendarList = document.getElementById('calendar-list');
    calendarList.innerHTML = '';

    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const events = await loadEvents();
    const orgs = await loadOrgs();
    
    // Create a map of org IDs to org names
    const orgMap = {};
    orgs.forEach(org => {
        orgMap[org.id] = org.name;
    });

    let cells = [...document.querySelectorAll('.calendar-cell')]
        .filter(cell => !cell.classList.contains('disabled'));

    for (let i = 0; i < cells.length; i++) {  
        const cell = cells[i];
        const dayItem = document.createElement('div');
        dayItem.classList.add('day-item');
        
        const day = parseInt(cell.querySelector('p').textContent);
        const cellIndex = monthDisplay.dayStart + i;
        const cellDayOfWeek = dayNames[cellIndex % 7];
        calendarList.appendChild(dayItem);
        
        const dayHeader = document.createElement('h3');
        dayHeader.textContent = `${cellDayOfWeek} ${day}`;
        dayHeader.id = "day-anchor-point-" + day;
        dayItem.id = "day-" + day;
        dayItem.appendChild(dayHeader);

        // Filter events for this day
        const dayEvents = events.filter(event => {
            const parsed = parseEventDate(event.when);
            if (!parsed) return false;
            return parsed.month === monthDisplay.month &&
                   parsed.year === monthDisplay.year &&
                   parsed.startDay <= day && day <= parsed.endDay;
        });
        
        if (dayEvents.length === 0) {
            dayItem.classList.add("hidden")
            const noEventsMsg = document.createElement('p');
            noEventsMsg.classList.add("no-events");
            noEventsMsg.textContent = 'No Events on this Day';
            dayItem.appendChild(noEventsMsg);
        } else {
            for (const event of dayEvents) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add("event-div");
                
                // Icon/Image
                const iconDiv = document.createElement('div');
                iconDiv.classList.add("icon-div");
                
                const icon = document.createElement('img');

                icon.src = '../images/push-pin.png';
                iconDiv.appendChild(icon);
                eventDiv.appendChild(iconDiv);

                iconDiv.addEventListener("click", () => {
                    iconDiv.classList.toggle("followed")
                })
                
                // Text content
                const textDiv = document.createElement('div');
                textDiv.classList.add("text-div");
                
                const eventName = document.createElement('p');
                eventName.classList.add("event-name");
                eventName.textContent = event.what;
                textDiv.appendChild(eventName);
                
                const eventDetails = document.createElement('p');
                eventDetails.classList.add("event-details");
                const orgName = orgMap[event.source_org] || 'Unknown Organization';
                eventDetails.textContent = orgName;
                textDiv.appendChild(eventDetails);
                
                if (event.when.includes(';')) {
                    const timeDetails = document.createElement('p');
                    timeDetails.classList.add("event-time");
                    const timeString = event.when.split(';')[1].trim();
                    timeDetails.textContent = timeString;
                    textDiv.appendChild(timeDetails);
                }
                
                eventDiv.appendChild(textDiv);
                dayItem.appendChild(eventDiv);
            }
        }
    }
}

async function loadOrgs() {
    try {
        const response = await fetch('../json/OrgsList.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading organizations:', error);
        return [];
    }
}







updateCalendar()
