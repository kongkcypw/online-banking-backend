const { get_all_branch } = require("../../models/BranchModel");
const { all_branches_InOut_transaction_date_range, 
        all_branches_count_all_date_range, 
        all_branches_transaction_detail_date_range, 
        transaction_ranking_date_range,
        account_ranking_date_range,
        atm_ranking_date_range } = require("../../models/join/TransactionModel");

const get_current_date = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const inOut = await all_branches_InOut_transaction_date_range(startDate, endDate);
        const count = await all_branches_count_all_date_range(startDate, endDate);
        const detail = await all_branches_transaction_detail_date_range(startDate, endDate);
        res.status(200).json({ status: 200, message: "get transaction in branch success", flow: inOut, sum: count[0], detail: detail });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
    }
}

const get_all_bank_branches = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const inOut = await all_branches_InOut_transaction_date_range(startDate, endDate);
        const count = await all_branches_count_all_date_range(startDate, endDate);
        const detail = await all_branches_transaction_detail_date_range(startDate, endDate);
        const branch = await get_all_branch();
        res.status(200).json({ status: 200, message: "get transaction in branch success", flow: inOut, sum: count[0], detail: detail, branch: branch });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
    }
}

const get_transaction_ranking = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const transaction_rank = await transaction_ranking_date_range(startDate, endDate);
        const all_branch = await get_all_branch();
        res.status(200).json({ status: 200, message: "get transaction ranking success", rank: transaction_rank, all_branch: all_branch});
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
    }
}

const get_overview_dashboard = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const inOut = await all_branches_InOut_transaction_date_range(startDate, endDate);
        const count = await all_branches_count_all_date_range(startDate, endDate);
        const rankAccount = await account_ranking_date_range(startDate, endDate);
        const rankAtm = await atm_ranking_date_range(startDate, endDate);
        res.status(200).json({ status: 200, message: "get overview bankmanager dashboard success", flow: inOut, sum: count[0], account: rankAccount, atm: rankAtm });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
    }
}

module.exports = {
    get_current_date,
    get_all_bank_branches,
    get_transaction_ranking,
    get_overview_dashboard
}