module.exports = {
    getAll: function (req, res) {
        const out = { title: 'helloWorld!', age: 12};
        res.status(200);
        res.contentType('json');
        return res.json(out);
    },

    getOne: function (req, res) {
        let id = req.params.id || '';
        res.send('Hello World: ' + id);
    },
};
