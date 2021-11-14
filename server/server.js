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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}

const conferences = {};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/create', function(req, res) {
    conference = {
        name: req.body.name,
        themes: req.body.themes,
        rooms: req.body.rooms,
        time: req.body.time,
        submissions: [],
    };

    for (let field in conference) {
        if (conference[field] === null) {
            const res_code = 400;
            serverlog(req, res_code);
            res.status(res_code);
            res.json({error: "bad form data"});
            return;
        }
    }

    let id;
    do {
        id = makeid(8);
    } while (conferences[id] != null);

    conferences[id] = conference;

    const res_code = 302;
    serverlog(req, res_code);
    res.redirect('/conference/' + id);
});

app.get('join', function(req, res) {
    id = req.body.id;

    if (conferences[id] === null) {
        const res_code = 400;
        serverlog(req, res_code);
        res.status(res_code);
        res.json({error: "conference does not exist"});
        return;
    }

    const res_code = 302;
    serverlog(req, res_code);
    res.redirect('/conference/' + id);
});

app.post('/conference/:conference/topic', function(req, res) {
    id = req.params.conference;

    if (conferences[id] === null) {
        const res_code = 400;
        serverlog(req, res_code);
        res.status(res_code);
        res.json({error: "conference does not exist"});
        return;
    }

    topics = conferences[id].topics;

    topic = {
        topic: req.body.topic,
        votes: 0,
    };

    for (let field in topic) {
        if (topic[field] === null) {
            const res_code = 400;
            serverlog(req, res_code);
            res.status(res_code);
            res.json({error: "bad form data"});
            return;
        }
    }

    topics.push(topic);

    const res_code = 302;
    serverlog(req, res_code);
    res.redirect('/conference/' + id);
});

app.post('/conference/:conference/vote', function(req, res) {
    id = req.params.conference;
    idea = req.body.idea;

    if (conferences[conference] === null) {
        const res_code = 400;
        serverlog(req, res_code);
        res.status(res_code);
        res.json({error: "conference does not exist"});
        return;
    }

    topics = conferences[id].topics;

    if (idea === null) {
        const res_code = 400;
        serverlog(req, res_code);
        res.status(res_code);
        res.json({error: "missing idea"});
        return;
    }

    if (topics[idea]) {
        topics[idea].votes += 1;
    } else {
        const res_code = 400;
        serverlog(req, res_code);
        res.status(res_code);
        res.json({error: "idea does not exist"});
        return;
    }

    const res_code = 200;
    serverlog(req, res_code);
    res.status(res_code);
    res.json({message: "ok"});
});

app.get('/conference/:conference', function(req, res) {
    id = req.params.conference;

    if (conferences[id] === null) {
        next();
    }

    topics = conferences[id].topics;

    const res_code = 200;
    serverlog(req, res_code);
    res.status(res_code);
    res.json(topics);
});

app.get('/conference/:conference/info', function(req, res) {
    id = req.params.conference;

    if (conferences[id] === null) {
        const res_code = 400;
        serverlog(req, res_code);
        res.status(res_code);
        res.json({error: "conference does not exist"});
        return;
    }

    const res_code = 200;
    serverlog(req, res_code);
    res.status(res_code);
    res.json(conferences[id]);
});

app.get('/conference/:conference/topics', function(req, res) {
    id = req.body.conference;

    if (conferences[id] === null) {
        const res_code = 400;
        serverlog(req, res_code);
        res.status(res_code);
        res.json({error: "conference does not exist"});
        return;
    }

    topics = conferences[id].topics;

    const res_code = 200;
    serverlog(req, res_code);
    res.status(res_code);
    res.json(topics);
});

app.use(express.static('../public'));

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
