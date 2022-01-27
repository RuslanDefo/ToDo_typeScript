const express = require('express');
const controllers = require('./controllers.js');
const router = express.Router();

router.get('/', controllers.render);
router.post('/', controllers.createTask);
router.delete('/:id', controllers.delete);
router.put('/:id', controllers.edit);

module.exports = router;
