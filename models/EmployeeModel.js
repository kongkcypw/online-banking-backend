const { db } = require("../config/mysql");

const insert_employee = async (employeeID, branchID, email, password, firstName, lastName, idCard, address, birth, role, permissionLevel) => {
    try {
        const query = `INSERT INTO Employee (EmployeeID, BranchID, Email, Password, FirstName, LastName, IdCard, Address, Birth, Role, PermissionLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [employeeID, branchID, email, password, firstName, lastName, idCard, address, birth, role, permissionLevel]);
        return result;
    } catch (error) {
        throw error;
    }
}

const get_next_employeeID = async (length) => {
    try {
        const query = `SELECT EmployeeID FROM Employee
        WHERE EmployeeID LIKE 'E%'
        ORDER BY EmployeeID DESC
        LIMIT 1;`;
        const rows = await db.query(query);  // Execute query without explicit array for parameters
        let newIdNumber;
        if (rows[0].length > 0) {
            const lastId = rows[0][0].EmployeeID.replace(/\D/g, ''); // Correctly access the first element and get the numeric part
            newIdNumber = parseInt(lastId, 10) + 1; // increment the numeric part
        } else {
            newIdNumber = 1; // If no existing entries, start at 1
        }

        return `E${newIdNumber.toString().padStart(length, '0')}`;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const get_supervisor = async () => {
    try {
        const query = `
        SELECT
            e.FirstName,
            e.LastName,
            e.BranchID,
            br.Name AS BranchName
        FROM Employee e
        JOIN Branch br ON e.BranchID = br.branchID
        WHERE permissionLevel = 2`;
        const [result] = await db.execute(query, []);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    insert_employee,
    get_next_employeeID,
    get_supervisor
}