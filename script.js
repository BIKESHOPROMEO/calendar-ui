async function submitUnavailable() {
  const date = document.getElementById('date').value;
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const reason = document.getElementById('reason').value;
  const resultEl = document.getElementById('result');

  if (!date || !start || !end) {
    resultEl.textContent = '日付と時間を選択してください';
    resultEl.style.color = 'red';
    return;
  }

  if (start > end) {
    resultEl.textContent = '開始時間は終了時間より前にしてください';
    resultEl.style.color = 'red';
    return;
  }

  const payload = {
    action: "unavailable", // ← これがGASの分岐キー！
    date,
    start,
    end,
    reason
  };

  try {
    const res = await fetch('/api/fuka', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('登録に失敗しました');
    const msg = await res.json();
    resultEl.textContent = msg.message || '予約不可を登録しました';
    resultEl.style.color = 'green';
    document.getElementById('date').value = '';
    document.getElementById('start').value = '10:00';
    document.getElementById('end').value = '10:00';
    document.getElementById('reason').value = '';
  } catch (err) {
    console.error('登録エラー:', err);
    resultEl.textContent = '登録に失敗しました';
    resultEl.style.color = 'red';
  }
}