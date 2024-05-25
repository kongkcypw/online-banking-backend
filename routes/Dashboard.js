const express = require('express');
const router = express.Router();

const EmpController = require('../controllers/role_employee/UserAccountController');
const BmgController = require('../controllers/role_bankmanager/BankManagerController');

router.get('/get-all-supervisor', BmgController.get_all_supervisor);
router.post('/get-employee-in-branch', EmpController.user_account_list_in_branch);

module.exports = router;