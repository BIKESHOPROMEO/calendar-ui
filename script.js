let scheduleData = {};

async function loadSchedule() {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbwvqxdEp4sWhAACzZRlPe9LzNdNxg2lY5XvIh_uRcfWJHMTnKlFaetKAdwSPdiGzTtwDg/exec?action=schedule');
    if (!res.ok) throw new Error('予定データの読み込みに失敗しました');
    scheduleData = await res.json();
  } catch (err) {
    console.error('予定データ取得エラー:', err);
    scheduleData = {};
  }
}

let holidayData = {};

async function loadHolidays() {
  try {
    const res = await fetch('/api/holiday'); // ← Vercel Functions経由
    if (!res.ok) throw new Error('祝日データの読み込みに失敗しました');
    holidayData = await res.json();
  } catch (err) {
    console.error('祝日データ取得エラー:', err);
    holidayData = {};
  }
}

const calendarEl = document.getElementById('calendar');
let currentDate = new Date();

function getSchedule(dateStr) {
  return scheduleData[dateStr] || [];
}

function renderCalendar(date) {
  calendarEl.innerHTML = ''; // 初期化

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // ヘッダー（前月・タイトル・翌月）
  const header = document.createElement('div');
  header.className = 'calendar-header';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '← 前月';
  prevBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '翌月 →';
  nextBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  };

  const title = document.createElement('div');
  title.textContent = `${year}年${month + 1}月`;
  title.className = 'calendar-title';

  header.appendChild(prevBtn);
  header.appendChild(title);
  header.appendChild(nextBtn);
  calendarEl.appendChild(header);

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekdayRow = document.createElement('div');
  weekdayRow.className = 'calendar-weekdays';

  weekdays.forEach((day, i) => {
  const label = document.createElement('div');
  label.textContent = day;
  label.className = 'weekday-label';
  if (i === 0) label.classList.add('sunday');
  if (i === 6) label.classList.add('saturday');
  weekdayRow.appendChild(label);
 });

 calendarEl.appendChild(weekdayRow);

  // カレンダー本体
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  const startWeekday = firstDay.getDay(); // 0 = Sunday
for (let i = 0; i < startWeekday; i++) {
  const emptyCell = document.createElement('div');
  emptyCell.className = 'calendar-cell empty';
  grid.appendChild(emptyCell);
}

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
const isHoliday = holidayData.holidays?.includes(key);

console.log('key:', key);
  console.log('isHoliday:', isHoliday);


const cell = document.createElement('div');
const dayOfWeek = cellDate.getDay();
cell.className = 'calendar-cell';
if (dayOfWeek === 0) cell.classList.add('sunday');
if (dayOfWeek === 6) cell.classList.add('saturday');
if (isHoliday) {
  cell.classList.add('holiday');
}


const dayLabel = document.createElement('div');
dayLabel.className = 'calendar-day';
dayLabel.textContent = `${day}日`;

const items = getSchedule(key);
const content = document.createElement('div');
content.className = 'calendar-content';

if (items.length > 0) {
  items.forEach(item => {
    const entry = document.createElement('div');
    entry.className = 'calendar-entry';
    entry.innerHTML = `<strong>${item.time} ${item.customer}</strong><br><span>${item.car} / ${item.task}</span>`;
    content.appendChild(entry);
  });
} else {
  content.textContent = '予定なし';
  content.classList.add('no-schedule');
}

    cell.appendChild(dayLabel);
    cell.appendChild(content);
    grid.appendChild(cell);
  }

  

  calendarEl.appendChild(grid);
}

// 初期化処理
Promise.all([loadSchedule(), loadHolidays()]).then(() => {
  renderCalendar(currentDate);
});