import MonthCalendar from '@/components/MonthCalendar';

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">月表示カレンダー（◎×）</h1>
      <MonthCalendar />
    </main>
  );
}