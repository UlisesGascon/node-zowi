const express = require('express')
const { join } = require('path');
const app = express();
module.exports = (robot) => {
    const server = require('http').createServer(app);

    app.use(express.static(join(__dirname, '..', 'public')))
    app.get('/', (req, res) => {
        res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    });

    app.get('/api/gestures', (req, res) => {
        const data = Object.keys(robot.gestures)
        res.json(data)
    })

    app.get('/api/status/:component?', (req, res) => {
        const component = req.params.component
        if(component) {
            const { status }  = robot.health();
            return res.json(status[component])
        }

        res.json(status)
    })
    return server;
};
