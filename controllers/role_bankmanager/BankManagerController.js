const { get_next_employeeID, insert_employee, get_supervisor, get_employee } = require("../../models/EmployeeModel");
const bcrypt = require("bcryptjs");
const { get_user_account_list_all_branch } = require("../../models/join/UserAccountModel");
const { get_all_branch } = require("../../models/BranchModel");

const register_bankmanager = async (req, res) => {
    try {
        const { email, password, firstName, lastName, idCard, address, birth } = req.body;

        const branchID = "";
        const role = "Bankmanager";
        const permissionLevel = 3;

        const employeeID = await get_next_employeeID(4);

        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10)

        const insert = await insert_employee(employeeID, branchID, email, encryptedPassword, firstName, lastName, idCard, address, birth, role, permissionLevel);
        res.status(200).json({ status: 200, message: "Register new supervisor success", test: employeeID });

    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
    }
}

const get_all_supervisor = async(req, res) => {
    try {
        const supervisor = await get_supervisor();
        res.status(200).json({ status: 200, message: "Get all supervisor list success", supervisor: supervisor })
    } catch(error){
        console.log(error);
        res.status(400).json({ status: 400, message: error });
    }
} 

const get_all_user_account = async(req, res) => {
    try {
        const userList = await get_user_account_list_all_branch();
        res.status(200).json({ status: 200, message: "Get all user list success", user: userList })
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error})
    }
}

const get_all_employee = async(req, res) => {
    try {
        const employee = await get_employee();
        const branch = await get_all_branch();
        res.status(200).json({ status: 200, message: "Get all user list success", employee: employee, branch: branch })
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error})
    }
}

module.exports = {
    register_bankmanager,
    get_all_supervisor,
    get_all_user_account,
    get_all_employee
}