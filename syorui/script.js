document.addEventListener('DOMContentLoaded', function() {
  // 既存の運行記録追加ロジックはそのまま
  const addTripButton = document.getElementById('add-trip-button');
  const tripLogContainer = document.getElementById('trip-log-container');
  let tripCount = 0;
  const MAX_TRIPS = 8;

  addTrip();
  addTripButton.addEventListener('click', addTrip);

  function addTrip() {
    if (tripCount >= MAX_TRIPS) return;
    tripCount++;

    const tripItem = document.createElement('div');
    tripItem.classList.add('trip-log-item');

    tripItem.innerHTML = `
      <div class="grid-cell input-cell" style="grid-column: 1 / span 5;"><input type="text" name="B${22 + tripCount}" placeholder="便名"></div>
      <div class="grid-cell input-cell" style="grid-column: 6 / span 6;"><input type="text" name="F${22 + tripCount}" placeholder="例: 09:00"></div>
      <div class="grid-cell input-cell" style="grid-column: 12 / span 6;"><input type="text" name="I${22 + tripCount}" placeholder="例: 12:30"></div>
      <div class="grid-cell input-cell" style="grid-column: 18 / span 9;"><input type="number" name="L${22 + tripCount}" placeholder="人数"></div>
    `;

    tripLogContainer.appendChild(tripItem);
    if (tripCount >= MAX_TRIPS) addTripButton.style.display = 'none';
  }

  // ===== ここからが追加：GASへ送信してExcelをダウンロード =====
  const form = document.querySelector('form');
  const submitBtn = form.querySelector('.submit-button');

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzXu8tIuCQluAZ6UpMclfEWzi9Ojf0gl32IakQTYkEjN9tU4Ek37kzpgkDqCRbk4lb4yg/exec';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {};
  form.querySelectorAll('input, select, textarea').forEach(el => {
    const name = el.name && el.name.trim();
    if (!name) return;
    if (!/^[A-Z]+[0-9]+$/.test(name)) return;       // A1形式のみ
    payload[name] = (el.type === 'checkbox') ? (el.checked ? '✓' : '') : (el.value ?? '');
  });

  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '作成中...';

  try {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // ←プリフライト回避
      body: JSON.stringify(payload),
    });

    // ネットワークに成功しても、サーバーがエラーを返すことがある
    const text = await res.text();
    let result;
    try { result = JSON.parse(text); } catch (e) { result = { success:false, error:'JSONで返ってきませんでした', raw:text }; }

    console.log('GAS result:', result); // ←開発中は必ず確認

    if (res.ok && result && result.success && result.fileUrl) {
      window.location.href = result.fileUrl; // 自動ダウンロード
    } else {
      const msg = (result && (result.error || result.message || result.raw)) || `HTTP ${res.status}`;
      alert('日報作成に失敗しました：\n' + msg);
    }
  } catch (err) {
    console.error(err);
    alert('通信エラーが発生しました：' + String(err));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
