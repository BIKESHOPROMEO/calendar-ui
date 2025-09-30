import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    '2025-09-15': [
      {
        time: '10:00',
        customer: '田中商会',
        car: 'プリウス',
        task: '車検'
      }
    ],
    '2025-09-23': [
      {
        time: '14:00',
        customer: '山田工業',
        car: 'ハイエース',
        task: 'オイル交換'
      }
    ]
  };

  return NextResponse.json(data);
}