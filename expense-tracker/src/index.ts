// Pick up the desired functionality (based on the argument type)
// Pick up subsequent arguments based on the primary argument which was passed
// Store the date in a json file

const fs = require('fs');

interface Expense {
    id : number,
    date : string
    description : string,
    amount : number
    category : string
}

const expenseFilePath = __dirname + "/expenses.json";
const expenseIdFilePath = __dirname + "/lastExpenseId.json";


const Commands : Record<string, () => void> = {
    "add" : addExpense,
    "list" : listExpenses,
     "summary" : summaryOfExpenses,
     "delete" : deleteExpense,
    // "export" : exportExpenses

}

function fileChecker(path : string){
    if(fs.existsSync(path)) return true;
    else return false;
}


function addExpense(){
    // Check if the JSON File exists for adding expense
    // Also check if the id file exists

    const desc = process.argv[4];
    const amount = Number(process.argv[6]);
    const category = process.argv[8];
    let expense : Expense | null = null;
    let expenseId = 1;
    if(fileChecker(expenseFilePath)){
            expenseId = fileChecker(expenseIdFilePath) ? Number(JSON.parse(fs.readFileSync(expenseIdFilePath, 'utf-8'))) + 1 : 1;
            expense = {
                id : expenseId,
                date : new Date().toLocaleString("en-GB").replace(/\//g, "-").slice(0,10),
                description : desc, 
                amount : amount, 
                category : category
            }
    }

    else {
        expenseId = 1;
        expense= {
            id : expenseId,
            date : new Date().toLocaleString("en-GB").replace(/\//g, "-").slice(0,10),
            description : desc, 
            amount : amount, 
            category : category
        }
    }

            const existingExpenses : Expense[] = fileChecker(expenseFilePath) ? JSON.parse(fs.readFileSync(expenseFilePath, 'utf-8')) : [] ;
            existingExpenses.push(expense);
            fs.writeFile(expenseFilePath, JSON.stringify(existingExpenses), (error : Error)=>{
                if (error) console.log(error);
                else{
                    console.log("Expense added successfully (ID : " + expenseId + ")");
                    fs.writeFile(expenseIdFilePath, JSON.stringify(expenseId), (err : Error)=>{
                        if(err) console.log(err);
                    })
                }
            })
        }

function listExpenses() {
    console.log("ID" + "    " + "Date" + "           " + "Description" + "        " + "Amount");
    const expenses : Expense[] = JSON.parse(fs.readFileSync(expenseFilePath,'utf-8'));
    for(const expense of expenses){
        console.log(expense.id + "    " + expense.date + "         " + expense.description + "        " + "    $" + expense.amount);
    }
}

function summaryOfExpenses(){
    const expenses : Expense[] = JSON.parse(fs.readFileSync(expenseFilePath,'utf-8'));
    let sumOfExpense = 0;
    for(const expense of expenses){
        sumOfExpense+= expense.amount;
    }
    console.log("$" + sumOfExpense);
}

function deleteExpense() {
    const expenseId = Number(process.argv[4]);
    const expenses : Expense[] = JSON.parse(fs.readFileSync(expenseFilePath,'utf-8'));
    const index = expenses.findIndex(expense => expense.id === expenseId);
    expenses.splice(index,1);
    fs.writeFile(expenseFilePath, JSON.stringify(expenses), (err : Error)=>{
        if(err) console.log(err);
    })

} 


const command = process.argv[2]?.toLowerCase();
if(command && command in Commands){
    Commands[command]();
}