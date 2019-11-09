const express = require('express')
const { join } = require('path');
const app = express();
module.exports = (gestures, current) => {
    const server = require('http').createServer(app);

    app.use(express.static(join(__dirname, '..', 'public')))
    app.get('/', (req, res) => {
        res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    });

    app.get('/api/gestures', (req, res) => {
        const data = Object.keys(gestures)
        res.json(data)
    })

    app.get('/api/status/:component?', (req, res) => {
        const component = req.params.component
        if(component) {
            return res.json(current[component])
        }

        res.json(current)
    })
    return server;
};
