import colors from 'colors';

function printError(error) {
    console.error(colors.red.bold('ERROR'));
    console.error(colors.red(error.message));
}

export { printError };
