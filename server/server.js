#!/usr/bin/env node

const express = require('express');

const PORT = 5000;

const app = express();

function serverlog(req, code) {
    console.log(
        new Date,
        'Request: ' + req.protocol + '://' + req.get('host') + req.originalUrl,
        'Response: (' + code + ')'
    );
}

const submissions = [];

app.use(express.json());

app.post('/submit', function(req, res) {
    form = {
        themes: req.body.themes,
        rooms: req.body.rooms,
        time: req.body.time,
        votes: 0,
    }

    for (let field in form) {
        if (form[field] == null) {
            const res_code = 400;
            serverlog(req, res_code);
            res.status(res_code);
            res.json({status: "bad form data"});
            return;
        }
    }

    submissions.push(form);

    const res_code = 200;
    serverlog(req, res_code);
    res.status(res_code);
    res.json({status: "ok"});
});

app.post('/vote', function(req, res) {
    idea = req.body.idea;

    if (idea) {
        if (submissions[idea]) {
            submissions[idea].votes += 1;
        } else {
            const res_code = 400;
            serverlog(req, res_code);
            res.status(res_code);
            res.json({status: "idea does not exist"});
            return;
        }
    } else {
        const res_code = 400;
        serverlog(req, res_code);
        res.status(res_code);
        res.json({status: "missing idea"});
        return;
    }

    const res_code = 200;
    serverlog(req, res_code);
    res.status(res_code);
    res.json({status: "ok"});
});

app.get('/submissions', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code);
    res.status(res_code);
    res.json(submissions);
});

app.get('/', express.static(__dirname + '/../public'));

app.use('*', function(req, res) {
    const res_code = 404;
    serverlog(req, res_code);

    const res_msg = 'Not found';
    res.status(res_code);

    if(req.accepts('html')) {
        res.sendFile('404.html', { root: __dirname + '/../public/'});
        return;
    }

    if(req.accepts('json')) {
        res.json({ error: res_msg });
        return;
    }

    res.type('txt').send(res_msg);
    return;
});

app.listen(PORT);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});

process.on('SIGTERM', () => {
    console.info('\nGracefully shutting down from SIGTERM\n');
    process.exit();
});

process.on('uncaughtException', function (err) {
    console.log('Uncaught exception: ', err);
});
