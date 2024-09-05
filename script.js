// ハンバーガーメニューの表示・非表示を切り替える
document.getElementById('menu-toggle').addEventListener('click', function() {
    var menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
    } else {
        menu.classList.add('open');
    }
});

// メニューを閉じる
document.getElementById('menu-close').addEventListener('click', function() {
    var menu = document.getElementById('mobile-menu');
    menu.classList.remove('open');
});
