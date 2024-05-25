const { get_next_employeeID, insert_employee } = require("../../models/EmployeeModel");
const bcrypt = require("bcryptjs");

const register_supervisor = async (req, res) => {
    try {
        const { branchID, email, password, firstName, lastName, idCard, address, birth } = req.body;

        const role = "Supervisor";
        const permissionLevel = 2;

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

module.exports = {
    register_supervisor
}