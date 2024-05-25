const { get_next_employeeID, insert_employee, get_supervisor } = require("../../models/EmployeeModel");
const bcrypt = require("bcryptjs");

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

module.exports = {
    register_bankmanager,
    get_all_supervisor
}