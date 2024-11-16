<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>ドーナツデータベース</title>
</head>
<body>
<h1>ドーナツデータベース</h1>
<hr>

<?php
$dsn = "mysql:dbname=wp;host=localhost";
$my = new PDO($dsn, "wp", "wp");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete'])) {
    $id = $_POST['商品番号'];
    $sql = "DELETE FROM ドーナツ WHERE 商品番号 = :id";
    $st = $my->prepare($sql);
    $st->execute([':id' => $id]);
}

$sql = "SELECT * FROM ドーナツ;";
$st = $my->prepare($sql);
$st->execute();

$html = "<table border='1'><tr><th>ジャンル</th><th>名前</th><th>値段(持ち帰り)</th><th>値段(店内飲食)</th><th>商品番号</th><th>操作</th></tr>";
while($row = $st->fetch(PDO::FETCH_ASSOC)){
    $html .= "<tr>";
    $f2 = "";
    foreach($row as $k => $item){
        $f2 .= "<input name='{$k}' value='{$item}' type='hidden'>";
        $html .= "<td>{$item}</td>";
    }
    $html .= "<td><form method='post' action=''>{$f2}<input type='submit' name='delete' value='削除'></form></td>";
    $html .= "</tr>";
}
$html .= "</table>";
echo($html);
?>

</body>
</html>
