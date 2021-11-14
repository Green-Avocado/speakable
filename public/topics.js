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

    return data;
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

    return response;
}
