var express = require('express');
var router = express.Router();
const { Op } = require('sequelize')
const models = require('../models')
const path = require('path')

/* GET users listing. */
router.get('/', async (req, res, next) => {
    const { page = 1, limit = 10, keyword = '', sort = 'ASC' } = req.query
    try {
        const { count, rows } = await models.User.findAndCountAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${keyword}%` } },
                    { phone: { [Op.like]: `%${keyword}%` } },
                ]
            },
            order: [['name', sort]],
            limit,
            offset: (page - 1) * limit
        });
        const pages = Math.ceil(count / limit)
        res.json({ phonebooks: rows, page: Number(page), limit: Number(limit), pages, total: count })
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

router.put('/:id/avatar', (req, res) => {
    try {
      let avatar;
      let uploadPath;
    
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
      avatar = req.files.avatar;
      let fileName = Date.now() + avatar.name
      uploadPath = path.join(__dirname, '..', 'public', 'images', fileName)
    
      avatar.mv(uploadPath, async function (err) {
        if (err)
          return res.status(500).send(err);
    
        const user = await models.User.update({ avatar: fileName }, {
          where: {
            id: req.params.id
          },
          returning: true,
          plain: true
        });
        res.status(201).json(user[1]);
      });
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
