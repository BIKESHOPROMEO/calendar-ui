let scheduleData = {};
const calendarEl = document.getElementById('calendar');
let currentDate = new Date();

async function loadSchedule() {
  try {
    const res = await fetch('./api/calendar.json');
    if (!res.ok) throw new Error('予定データの読み込みに失敗しました');
    scheduleData = await res.json();
  } catch (err) {
    console.error('予定データ取得エラー:', err);
    scheduleData = {};
  }
}

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

  // カレンダー本体
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const key = cellDate.toISOString().split('T')[0];

    const cell = document.createElement('div');
    cell.className = 'calendar-cell';

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
        entry.innerHTML = `<strong>${item.customer}</strong><br><span>${item.car} / ${item.task}</span>`;
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
loadSchedule().then(() => {
  renderCalendar(currentDate);
});