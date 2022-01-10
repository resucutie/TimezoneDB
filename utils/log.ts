import chalk from "chalk"

function errorLog(message: any) {
    console.log(chalk.red`Error!`, message)
}

export {
    errorLog
}