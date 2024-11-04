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
    '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>地域ICTリーダの紹介/組み込み</title><style>.body4 {background-color: #f0f8ff;color: #333;font-family: Arial, sans-serif;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;min-height: 100vh;}.containerr {background-color: #ffffff;width: 90%;max-width: 800px;border-radius: 8px;padding: 10px;margin: 20px;}.h14 {color: #0077cc;text-align: center;font-size: 2em;margin-bottom: 20px;border-bottom: 2px solid #e0e0e0;padding-bottom: 10px;}.h24 {color: #0056a3;font-size: 1.5em;margin-top: 20px;border-left: 5px solid #0077cc;padding-left: 10px;}.p4 {font-size: 1rem;line-height: 1.6;margin: 15px 0;}</style></head><body class="body4"><div class="containerr"><h1 class=" h14">地域ICTリーダとは？</h1><h2 class="h24">1. 「地域ICTリーダ」とは</h2><p class="p4">ICTとは、Information and Communication Technologyの略で、日本語では「情報通信技術」と訳されます。</p><p class="p4">地域ICTリーダは、地域コミュニティにおいて、ICTを積極的に活用したり、コミュニティ内の他のメンバーにICTに関するアドバイスをしたりなど、地域の情報化の推進役や相談役となる人材のことで、市民の中からその意欲がある方を募り、登録いただいています。</p><p class="p4">技術の進歩や、様々な分野でのデジタル化が急速に進む中、「スマートフォンやパソコンの使い方がわからない」「インターネットをやってみたいけどどうすれば良いのかわからない」といったことで困っている方・悩んでいる方が地域コミュニティには大勢います。地域ICTリーダは、そのようないわゆる「情報弱者」の方々を支援し、地域の情報格差（ICTを使える人と使えない人の間の格差）解消のために活躍いただくことが主な役割です。</p><h2 class="h24">2. 地域ICTリーダになるには</h2><p class="p4">地域ICTリーダになるにあたっては、「ICT関連資格を持っていること」などの、特別な条件はありません。最低限必要な条件は、以下の2つです。</p><li>地域ICTリーダの趣旨について、ご理解・賛同いただき、地域ICTリーダとして活動する意欲があること</li><li>市が開催する「地域ICTリーダ養成講座」または支援サイトを通じ同講座を受講・修了すること</li><h2 class="h24">3. 地域ICTリーダ養成講座</h2><p class="p4">地域ICTリーダになるには、「地域ICTリーダ養成講座」を受講いただく必要があります。養成講座の受講・修了後、最終的な意思確認をさせていただき、ご了承いただけた方を地域ICTリーダとして登録いたします。<br>詳しくは<a href="https://www.city.saitama.lg.jp/001/013/010/p089829.html">こちら</a></p></div></body></html>',
    "<!DOCTYPE html><html lang='ja'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>ログインフォーム</title><!-- BootstrapのCDNを読み込む --><link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css' rel='stylesheet'><style>body {background-color: #f0f8ff; /* 淡い青の背景 */}.login-container {max-width: 400px;margin: 50px auto;padding: 20px;background-color: white; /* 白背景 */border-radius: 10px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}</style></head><body><div class='login-container'><h2>ログインフォーム</h2><form id='loginForm'><div class='mb-3'><label for='username' class='form-label'>ユーザーネーム:</label><input type='text' class='form-control' id='username' required></div><div class='mb-3'><label for='password' class='form-label'>パスワード:</label><input type='password' class='form-control' id='password' required></div><button type='submit' class='btn btn-primary'>ログイン</button><p id='error-message' style='color:red;'></p></form></div><script src='https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js'></script><script>document.getElementById('loginForm').addEventListener('submit', async function(event) {event.preventDefault();// ユーザーネームとパスワードを取得const id = document.getElementById('username').value;const password = document.getElementById('password').value;// IDとパスワードをSHA-256でハッシュ化const hashedId = CryptoJS.SHA256(id).toString();const hashedPassword = CryptoJS.SHA256(password).toString();try {// JSONファイルを取得const response = await fetch('users.json'); // 照合するJSONファイルのパスconst users = await response.json();// ユーザーが存在するかチェックconst user = users.find(u => u.ID === hashedId && u.password === hashedPassword);if (user) {alert('ログイン成功！名前: ' + user.name); // 成功時に名前を表示} else {document.getElementById('error-message').textContent = 'ユーザーネームが不正です';}} catch (error) {console.error('エラーが発生しました:', error);document.getElementById('error-message').textContent = 'ログイン処理中にエラーが発生しました';}});</script></body></html>",
    "<h4>質問フォームの詳細</h4><p>質問フォームへのボタンを置く。他に書くこと思いつかねー</p>",
    "<h4>確認テストの詳細</h4><p>授業動画の内容についてのテスト。理解度をチェックしましょう的なことを書く。</p>",
    "<h4>確認テスト終了後</h4><p>全ての確認テストが終わった後の会場やその他注意点とかを書く。</p>"
];
function showDetail(index) {
    const detailBox = document.getElementById("detail-box");
    detailBox.innerHTML = detailsHTML[index - 1]; 
    detailBox.classList.add("active");
}