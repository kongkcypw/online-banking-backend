// Generate timestamp for unique key
async function getTimestamp() {
    const now = new Date();
    // Padding function to ensure single digit numbers are preceded by a zero
    const pad = (number) => (number < 10 ? '0' + number : number);
    // Extracting parts of the date
    const year = now.getFullYear().toString(); 
    const month = pad(now.getMonth() + 1); // Months are 0-based
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const minute = pad(now.getMinutes());
    const second = pad(now.getSeconds());

    // Combining all parts into YYMMDDHHMMSS format
    return `${year}${month}${day}${hour}${minute}${second}`;
}

const removeProperties = (obj, ...props) => {
    let newObj = { ...obj };
    props.forEach(prop => delete newObj[prop]);
    return newObj;
}

async function calculateNewBalance(accountBalance, transactionFlow, transactionAmount){
    let newBalance;
    if(accountBalance !== null){
        if(transactionFlow === "IN"){
            newBalance = accountBalance + transactionAmount
        }
        else if(transactionFlow === "OUT"){
            newBalance = accountBalance - transactionAmount
        }
        return newBalance
    }
    return null
}

async function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

module.exports = {
    getTimestamp,
    removeProperties,
    calculateNewBalance,
    calculateAge
}