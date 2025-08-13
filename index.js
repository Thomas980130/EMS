// 儲存每個分頁的資料
const formData = {
  basic: {},
  scene: {},
  // 其他分頁...
};

// 分頁切換
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // 儲存目前分頁資料
    saveCurrentPage();

    // 切換 active 樣式
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    // 顯示對應分頁
    const page = this.getAttribute('data-page');
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + page).style.display = '';

    // 還原該分頁資料
    restorePage(page);
  });
});

// 儲存目前分頁輸入
function saveCurrentPage() {
  const activeBtn = document.querySelector('.menu-btn.active');
  if (!activeBtn) return;
  const page = activeBtn.getAttribute('data-page');
  if (page === 'basic') {
    formData.basic.name = document.getElementById('basic-name').value;
    formData.basic.age = document.getElementById('basic-age').value;
    formData.basic.gender = document.getElementById('basic-gender').value;
  } else if (page === 'scene') {
    formData.scene.location = document.getElementById('scene-location').value;
    formData.scene.status = document.getElementById('scene-status').value;
  }
  // 其他分頁依此類推...
}

// 還原分頁資料
function restorePage(page) {
  if (page === 'basic') {
    document.getElementById('basic-name').value = formData.basic.name || '';
    document.getElementById('basic-age').value = formData.basic.age || '';
    document.getElementById('basic-gender').value = formData.basic.gender || '';
  } else if (page === 'scene') {
    document.getElementById('scene-location').value = formData.scene.location || '';
    document.getElementById('scene-status').value = formData.scene.status || '';
  }
  // 其他分頁依此類推...
}

// 頁面載入時還原第一頁
document.addEventListener('DOMContentLoaded', function() {
  restorePage('basic');
});

// 完成返隊按鈕
if (document.getElementById('finish-btn')) {
  document.getElementById('finish-btn').addEventListener('click', function() {
    saveCurrentPage();
    const now = new Date();
    const timeStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');
    document.getElementById('finish-info').textContent = '完成返隊時間：' + timeStr;
    window.print();
  });
}

// 取得現場地點 GPS
if (document.getElementById('scene-location-gps-btn')) {
  document.getElementById('scene-location-gps-btn').addEventListener('click', function() {
    if (!navigator.geolocation) {
      alert('此瀏覽器不支援定位功能');
      return;
    }
    document.getElementById('scene-location-gps-btn').textContent = '定位中...';
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      document.getElementById('scene-location').value = lat + ',' + lng;
      document.getElementById('scene-location-gps-btn').textContent = '定位';
    }, function(err) {
      alert('定位失敗: ' + err.message);
      document.getElementById('scene-location-gps-btn').textContent = '定位';
    });
  });
}

// 時間欄位「現在」按鈕功能
function setNowToInput(inputId) {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  document.getElementById(inputId).value = `${hh}:${mm}`;
}
if (document.getElementById('scene-arrival-now')) {
  document.getElementById('scene-arrival-now').addEventListener('click', function() {
    setNowToInput('scene-arrival');
  });
}
if (document.getElementById('treatment-time-now')) {
  document.getElementById('treatment-time-now').addEventListener('click', function() {
    setNowToInput('treatment-time');
  });
}
if (document.getElementById('vital-time-now')) {
  document.getElementById('vital-time-now').addEventListener('click', function() {
    // 找到同一行的時間輸入框
    const timeInput = document.querySelector('.vital-signs-row input[type="time"]');
    if (timeInput) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      timeInput.value = `${hh}:${mm}`;
    }
  });
}

// --- 手寫簽名板功能 ---
// 簽名modal功能
function setupSignatureModal(smallId, modalId, modalCanvasId, okBtnId, cancelBtnId) {
  const smallCanvas = document.getElementById(smallId);
  const modal = document.getElementById(modalId);
  const modalCanvas = document.getElementById(modalCanvasId);
  const okBtn = document.getElementById(okBtnId);
  const cancelBtn = document.getElementById(cancelBtnId);
  if (!smallCanvas || !modal || !modalCanvas) return;
  // 點小canvas開modal
  smallCanvas.addEventListener('click', function() {
    // 將小canvas內容複製到modal大canvas
    const ctx = modalCanvas.getContext('2d');
    ctx.clearRect(0,0,modalCanvas.width,modalCanvas.height);
    ctx.drawImage(smallCanvas, 0, 0, modalCanvas.width, modalCanvas.height);
    modal.classList.add('active');
  });
  // 完成：複製modal內容到小canvas
  okBtn.addEventListener('click', function() {
    const ctx = smallCanvas.getContext('2d');
    ctx.clearRect(0,0,smallCanvas.width,smallCanvas.height);
    ctx.drawImage(modalCanvas, 0, 0, smallCanvas.width, smallCanvas.height);
    modal.classList.remove('active');
  });
  // 取消：關閉modal
  cancelBtn.addEventListener('click', function() {
    modal.classList.remove('active');
  });
  // 點modal外部也關閉
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('active');
  });
  // 設定modal canvas簽名功能
  setupSignaturePad(modalCanvasId, null);
}
// 初始化兩個簽名板
setupSignaturePad('signature-patient', 'clear-signature-patient');
setupSignaturePad('signature-emt', 'clear-signature-emt');
setupSignatureModal('signature-patient', 'modal-signature-patient', 'modal-canvas-patient', 'modal-signature-patient-ok', 'modal-signature-patient-cancel');
setupSignatureModal('signature-emt', 'modal-signature-emt', 'modal-canvas-emt', 'modal-signature-emt-ok', 'modal-signature-emt-cancel');
setupSignatureModal('signature-emt1', 'modal-signature-emt1', 'modal-canvas-emt1', 'modal-signature-emt1-ok', 'modal-signature-emt1-cancel');
setupSignatureModal('signature-emt2', 'modal-signature-emt2', 'modal-canvas-emt2', 'modal-signature-emt2-ok', 'modal-signature-emt2-cancel');
setupSignatureModal('signature-emt3', 'modal-signature-emt3', 'modal-canvas-emt3', 'modal-signature-emt3-ok', 'modal-signature-emt3-cancel');
setupSignaturePad('signature-emt1', 'clear-signature-emt1');
setupSignaturePad('signature-emt2', 'clear-signature-emt2');
setupSignaturePad('signature-emt3', 'clear-signature-emt3');
setupSignatureModal('signature-refusal', 'modal-signature-refusal', 'modal-canvas-refusal', 'modal-signature-refusal-ok', 'modal-signature-refusal-cancel');
setupSignaturePad('signature-refusal', 'clear-signature-refusal');

// 生命徵象表格動態行
const vitalSignsTable = document.getElementById('vital-signs-table').getElementsByTagName('tbody')[0];
document.getElementById('add-row').addEventListener('click', function() {
  const newRow = vitalSignsTable.insertRow();
  for (let i = 0; i < 9; i++) {
    const newCell = newRow.insertCell();
    const input = document.createElement('input');
    input.type = i === 0 ? 'time' : 'text';
    newCell.appendChild(input);
  }
  const actionCell = newRow.insertCell();
  const removeButton = document.createElement('button');
  removeButton.textContent = '刪除';
  removeButton.className = 'remove-row';
  removeButton.addEventListener('click', function() {
    vitalSignsTable.deleteRow(newRow.rowIndex - 1);
  });
  actionCell.appendChild(removeButton);
});
document.querySelectorAll('.remove-row').forEach(button => {
  button.addEventListener('click', function() {
    const row = button.parentElement.parentElement;
    vitalSignsTable.deleteRow(row.rowIndex - 1);
  });
});