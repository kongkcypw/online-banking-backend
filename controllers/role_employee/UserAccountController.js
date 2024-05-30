const { get_user_account_list_in_branch } = require("../../models/join/UserAccountModel");

const user_account_list_in_branch = async (req, res) => {
    try{
        const { branchID } = req.body
        const user_list = await get_user_account_list_in_branch(branchID);
        res.status(200).json({ status: 200, message: "get user list success", user: user_list });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
    }
}

module.exports = {
    user_account_list_in_branch
}