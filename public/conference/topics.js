async function getInfo() {
    data = await fetch("info").then((res) => {
        return res.json();
    });

    return data;
}

async function getTopics() {
    data = await fetch("topics").then((res) => {
        return res.json();
    });

    list = document.getElementById("list");
    console.log(data)

    let i = 0;
    for (x in data) {
        topic = data[x];
        list.innerHTML += `
        "${topic.topic}" by ${topic.name}
        <br>
        About me: ${topic.bio}
        <br>
        votes: ${topic.votes}
        <br>
        <button type="submit" onclick="vote(${i})">Vote</button>
        <br>
        <br>
        `;

        i++
    }
}

async function vote(index) {
    response = await fetch("vote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({idea: index}),
    }).then((res) => {
        return res.json();
    });

     location.reload()
}

window.onload = function() {
    getTopics();
}
