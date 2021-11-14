async function getSubmissions() {
    data = await fetch("/submissions").then((res) => {
        return res.json();
    });

    return data;
}

async function vote(index) {
    response = await fetch("/vote", {
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
