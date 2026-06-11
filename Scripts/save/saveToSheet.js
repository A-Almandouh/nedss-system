console.log(
    "saveToSheet loaded"
);

async function saveToDepartmentSheet() {

    console.log(
        "saveToDepartmentSheet"
    );

    const data =
        await collectAllData();

    console.log(data);

    return;
}


async function saveToGovernorateSheet() {

    console.log(
        "saveToGovernorateSheet"
    );

    const data =
        await collectAllData();

    console.log(data);

    return;
}
(async function () {

    console.log("TEST");

    const data =
        await collectAllData();
const result = splitData(data);

console.log("GENERAL DATA");

console.table(result.generalData);

console.log("DISEASE DATA");

console.table(result.diseaseData);
    console.log(
        "ALL DATA",
        data
    );

})();
