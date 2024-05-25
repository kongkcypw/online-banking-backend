const express = require('express');
const router = express.Router();

const controller = require('../controllers/RegisterController');
const SpvController = require('../controllers/role_supervisor/EmployeeController');
const BmgController = require('../controllers/role_bankmanager/SupervisorController');
const BmgReg = require('../controllers/role_bankmanager/BankManagerController');

// User 
router.post('/password', controller.register_password);
router.post('/pin', controller.register_pin);
router.post('/account', controller.register_account);
router.post('/confirm', controller.register_confirm);

// Supervisor manage
router.post('/employee', SpvController.register_employee);

// Bank manager manage
router.post('/supervisor', BmgController.register_supervisor);

// Bank manager manage
router.post('/bankmanager', BmgReg.register_bankmanager);

module.exports = router;