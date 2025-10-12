function checkPassword() {
  const input = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');
  const correctPassword = 'tamatama6630';

  if (input === correctPassword) {
    localStorage.setItem('isLoggedIn', 'true'); // ← ログイン状態を保存！
    showCalendar();
  } else {
    errorEl.textContent = 'パスワードが違います';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    showCalendar();
  }
});

function showCalendar() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('calendar').style.display = 'block';
  
  const calendarEl = document.getElementById('calendar');

  showLoading();
  Promise.all([loadSchedule(), loadHolidays()])
    .then(() => {
      renderCalendar(currentDate);
    })
    .finally(() => {
      hideLoading();
    });
}

function showLoading() {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'flex';
}

function hideLoading() {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'none';
}

let scheduleData = {};

async function loadSchedule() {
  try {
    const res = await fetch('/api/schedule');
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

let currentDate = new Date();

function getSchedule(dateStr) {
  const items = scheduleData[dateStr] || [];
  return items.sort((a, b) => a.time.localeCompare(b.time));
}

function renderCalendar(date) {
  console.timeLog("描写開始");
  const calendarEl = document.getElementById('calendar');
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

  const fukaBtn = document.createElement('button');
  fukaBtn.textContent = '【予約不可登録】';
  fukaBtn.onclick = () => {
    window.open('https://tamfuka-form.vercel.app/', '_blank');
  };
  fukaBtn.className = 'fuka-button';

  const todayBtn = document.createElement('button');
  todayBtn.textContent = '店頭予約入力';
  todayBtn.onclick = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;
  const url = new URL("https://tentoyoyakutama.vercel.app/");
  url.searchParams.set("date", dateStr);
  window.location.href = url.toString();
};

  header.appendChild(prevBtn);  
  header.appendChild(title);
  header.insertBefore(todayBtn, title);
  header.appendChild(fukaBtn); // ← タイトルの後に挿入！
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

  // 🔽 作業内容に応じて色クラスを追加
  switch (item.task) {
    case '1ヶ月点検':
      entry.classList.add('task-first');
      break;
    case '6ヶ月点検':
      entry.classList.add('task-6m');
      break;
    case '12ヶ月点検':
      entry.classList.add('task-12m');
      break;
    case 'タイヤ交換':
      entry.classList.add('task-tire');
      break;
    case 'オイル交換':
      entry.classList.add('task-oil');
      break;
    case 'その他修理':
      entry.classList.add('task-other');
      break;
  }

    entry.innerHTML = `
  <div class="entry-top">
    <strong>${item.time} ${item.customer} ${item.car}</strong>
  </div>
  <div class="entry-bottom">
    <span>${item.task} / ${item.phone} / ${item.email} / ${item.note}</span>
  </div>
`;
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

