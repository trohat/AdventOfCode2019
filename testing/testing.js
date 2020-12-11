let testNumber = 0;

const doEqualTest = (calculated, expected) => {
    testNumber++;
    if (calculated === expected) {
        console.info(`Test číslo ${testNumber} prošel.`);
    } else {
        console.error(`Test číslo ${testNumber} neprošel.`);
        console.warn(`Očekávaná hodnota: ${expected}`);
        console.warn(`Vypočítaná hodnota: ${calculated}`);
    }
};