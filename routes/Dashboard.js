const express = require('express');
const router = express.Router();

const EmpController = require('../controllers/role_employee/UserAccountController');
const BmgController = require('../controllers/role_bankmanager/BankManagerController');

router.post('/get-employee-in-branch', EmpController.user_account_list_in_branch);

router.get('/get-user-all', BmgController.get_all_user_account);
router.get('/get-all-employee', BmgController.get_all_employee);
router.get('/get-all-supervisor', BmgController.get_all_supervisor);


module.exports = router;