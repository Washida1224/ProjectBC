const userID = localStorage.getItem('userID');

if (!userID) {
    window.location.href = 'index.html';
} else {
    fetch('https://washida1224.github.io/ProjectBC/3.0/users.json')
        .then(response => response.json())
        .then(data => {
            const userData = data.find(user => user.ID === userID);
            if (userData) {
                document.getElementById('user-name').textContent = `${userData.name}でログイン中`;
            } else {
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('エラーが発生しました:', error);
        });
}
document.getElementById('logout-button').addEventListener('click', function(event) {
    event.preventDefault();
    localStorage.removeItem('userID');
    window.location.href = 'index.html';
});
const detailsHTML = [
    '<iframe src="https://washida1224.github.io/ProjectBC/3.0/組み込み4.html" width="100%" height="900" frameborder="0" marginheight="0" marginwidth="0"></iframe>',
    '<iframe src="https://washida1224.github.io/ProjectBC/3.0/組み込み2.html" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0"></iframe>',
    "<h4>質問フォームの詳細</h4><p>質問フォームへのボタンを置く。他に書くこと思いつかねー</p>",
    "<h4>確認テストの詳細</h4><p>授業動画の内容についてのテスト。理解度をチェックしましょう的なことを書く。</p>",
    '<iframe src="https://washida1224.github.io/ProjectBC/3.0/testend.html" width="100%" height="900" frameborder="0" marginheight="0" marginwidth="0"></iframe>'
];
function showDetail(index) {
    const detailBox = document.getElementById("detail-box");
    detailBox.innerHTML = detailsHTML[index - 1]; 
    detailBox.classList.add("active");
}
