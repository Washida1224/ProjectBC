const userId = localStorage.getItem("userID");

if (!userId) {
    console.error("ユーザーIDがlocalStorageに保存されていません。");
} else {
    Promise.all([
        fetch("https://script.google.com/macros/s/AKfycby2rANr67SVDqzK3aIKoKc7U8srTmCWemzPfn0Zy06M6rzEDTcm7ONO6-LW4BNf8AwDXA/exec").then(response => response.json()),
        fetch("https://washida1224.github.io/ProjectBC/3.0/Goverment-office.json").then(response => response.json()),
        fetch("https://washida1224.github.io/ProjectBC/3.0/sisetu.json").then(response => response.json())
    ])
    .then(([usersData, officesData, locationsData]) => {
        const user = usersData.find(user => user.ID === userId);
        if (!user) {
            throw new Error("指定されたユーザーが見つかりません。");
        }

        const office = officesData.find(office => office.live === user.live);
        if (!office) {
            throw new Error("指定された役所情報が見つかりません。" + user.live);
        }
        document.getElementById('live').textContent = `貴方の居住している区は「${user.live}」でなので会場は以下の場所です`;
        const map = L.map("map").setView([office.latitude, office.longitude], 15);

        L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([office.latitude, office.longitude])
            .addTo(map)
            .bindPopup(`<b>${user.live}の会場</b><br>(${office.latitude}, ${office.longitude})`)
            .openPopup();

        const markerColors = {
            "小学校": "blue",
            "中学校": "green",
            "高等学校": "red",
            "施設": "orange"
        };

        locationsData.forEach(location => {
            const color = markerColors[location.type] || "gray";

            const circleMarker = L.circleMarker([location.latitude, location.longitude], {
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                radius: 5
            });

            circleMarker.addTo(map).bindPopup(
                `<b>${location.name}</b><br>${location.address}`
            );
        });
    })
    .catch(error => {
        console.error("エラーが発生しました:", error);
    });
}
