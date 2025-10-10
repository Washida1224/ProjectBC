document.addEventListener('DOMContentLoaded', function () {
  // ====== ★ ここにあなたの WebアプリURL（/exec）を貼る ★ ======
  // 例: const GAS_URL = 'https://script.google.com/macros/s/XXXXXXXXXXXX/exec';
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbw5WGUs-aiiK23nEUS9qroNinplG6Aj_7-eG9nsYVIYHvOVb9a-Av32g3JxfMrj15H1ZA/exec';

  // ====== 既存：運行記録の追加ロジック（レイアウトはそのまま） ======
  const addTripButton = document.getElementById('add-trip-button');
  const tripLogContainer = document.getElementById('trip-log-container');
  let tripCount = 0;
  const MAX_TRIPS = 8;

  // 初期行を1つ追加
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

    if (tripCount >= MAX_TRIPS) {
      addTripButton.style.display = 'none';
    }
  }

  // ====== 送信処理：GASへPOST→ExcelのDLリンクを受け取る ======
  const form = document.querySelector('form');
  const submitBtn = form.querySelector('.submit-button');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1) ペイロード作成：A1形式のセル名のみ送る（例: E4, P3）
    const payload = collectPayloadFromForm(form);

    // 2) UIロック
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '作成中...';

    try {
      // 3) GASへ送信（プリフライト回避のため text/plain で送る）
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      // 4) レスポンスを安全に解釈
      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        result = { success: false, error: 'サーバーからJSONで返ってきませんでした', raw: text };
      }

      console.log('GAS result:', result);

      // 5) 成功判定
      if (res.ok && result && result.success && result.fileUrl) {
        // Excel自動ダウンロード
        window.location.href = result.fileUrl;
      } else {
        const msg = (result && (result.error || result.message || result.raw)) || `HTTP ${res.status}`;
        alert('日報作成に失敗しました：\n' + msg);
      }
    } catch (err) {
      console.error(err);
      alert('通信エラーが発生しました：\n' + String(err));
    } finally {
      // 6) UI解除
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // ====== ユーティリティ：フォームからA1形式のセル名だけを抽出 ======
  function collectPayloadFromForm(formEl) {
    const data = {};
    const elements = formEl.querySelectorAll('input, select, textarea');

    elements.forEach((el) => {
      const name = el.name && el.name.trim();
      if (!name) return;

      // A1形式（列はA-Z+、行は1- のみ許可）
      if (!/^[A-Z]+[0-9]+$/.test(name)) return;

      if (el.type === 'checkbox') {
        data[name] = el.checked ? '✓' : '';
      } else {
        data[name] = el.value ?? '';
      }
    });

    return data;
  }
});




