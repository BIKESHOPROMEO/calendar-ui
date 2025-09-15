'use client';

import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
} from 'date-fns';

type ScheduleItem = {
  customer: string;
  car: string;
  task: string;
};

const schedule: Record<string, ScheduleItem[]> = {
  '2025-09-15': [
    { customer: '山田太郎', car: 'プリウス', task: 'オイル交換' },
    { customer: '佐藤花子', car: 'N-BOX', task: 'タイヤ交換' },
  ],
  '2025-09-16': [
    { customer: '田中一郎', car: 'ハイエース', task: '車検' },
  ],
};

export default function MonthCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <>
      {/* 月切り替えボタン */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← 前月
        </button>
        <div className="text-xl font-bold">
          {format(currentMonth, 'yyyy年MM月')}
        </div>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          翌月 →
        </button>
      </div>

      {/* カレンダー本体 */}
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((date) => {
          const key = format(date, 'yyyy-MM-dd');
          const items = schedule[key] || [];

          return (
            <div key={key} className="border p-2 rounded shadow-sm text-sm">
              <div className="font-bold text-base mb-1">
                {format(date, 'd')}日
              </div>
              {items.length > 0 ? (
                <ul className="space-y-1">
                  {items.map((item, idx) => (
                    <li key={idx} className="bg-gray-100 p-1 rounded">
                      <div className="font-semibold">{item.customer}</div>
                      <div className="text-xs text-gray-600">
                        {item.car} / {item.task}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">予定なし</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}