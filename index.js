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

// --- 手寫簽名板功能 ---
function setupSignaturePad(canvasId, clearBtnId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;

  function getPos(e) {
    if (e.touches) {
      return {
        x: e.touches[0].clientX - canvas.getBoundingClientRect().left,
        y: e.touches[0].clientY - canvas.getBoundingClientRect().top
      };
    } else {
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }

  canvas.addEventListener('mousedown', e => {
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });
  canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  });
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mouseleave', () => drawing = false);

  // 支援觸控
  canvas.addEventListener('touchstart', e => {
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });
  canvas.addEventListener('touchmove', e => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  });
  canvas.addEventListener('touchend', () => drawing = false);

  // 清除簽名
  document.getElementById(clearBtnId).addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

// 初始化兩個簽名板
setupSignaturePad('signature-patient', 'clear-signature-patient');
setupSignaturePad('signature-emt', 'clear-signature-emt');