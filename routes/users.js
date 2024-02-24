var express = require('express');
var router = express.Router();
const models = require('../models')

/* GET users listing. */
router.get('/', async (req, res, next) => {
    try {
        const users = await models.User.findAll()
        res.json(users)
    } catch (err) {
        console.log(err)
        res.json({ err })
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { name, phone } = req.body
        const user = await models.User.create({ name, phone })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.json({ err })
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { name, phone } = req.body
        const user = await models.User.update({ name, phone }, {
            where: {
                id: req.params.id
            },
            returning: true,
            plain: true
        });
        res.json(user[1])
    } catch (err) {
        console.log(err)
        res.json({ err })
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const user = await models.User.findOne({ where: { id: req.params.id } });
        const userDelete = await models.User.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json(user)
    } catch (err) {
        console.log(err)
        res.json({ err })
    }
});

module.exports = router;
