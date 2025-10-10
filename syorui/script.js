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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 全フォーム要素を「name -> 値」に詰める（チェックボックスは ✓ / 空 にする）
    const payload = {};
    const elements = form.querySelectorAll('input, select, textarea');

    elements.forEach(el => {
      const name = el.name && el.name.trim();
      if (!name) return;

      // A1形式のセル名のみ送る（安全策）
      const isCellName = /^[A-Z]+[0-9]+$/.test(name);

      if (!isCellName) {
        // セル名以外は無視（万一の入力が混ざってもExcel書き込み対象外にする）
        return;
      }

      if (el.type === 'checkbox') {
        payload[name] = el.checked ? '✓' : ''; // Excelで見やすい ✓/空
      } else {
        payload[name] = el.value ?? '';
      }
    });

    // 送信中UI
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '作成中...';

    try {
      const res = await fetch('https://script.google.com/macros/s/AKfycbxhXdmL0fH-wpNZS7GSm_ZwHS7BvjIkUjsd9vyKwDuI6HFX3c0ZKmHs4Jbqy1-QV15gQg/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Server error');

      const result = await res.json();

      if (result && result.success && result.fileUrl) {
        // Excelを自動ダウンロード
        window.location.href = result.fileUrl;
      } else {
        alert('日報作成に失敗しました。しばらくしてから再試行してください。');
      }
    } catch (err) {
      console.error(err);
      alert('通信エラーが発生しました。ネットワークをご確認ください。');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
