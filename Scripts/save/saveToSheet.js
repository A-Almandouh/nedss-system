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

console.log(
    "GENERAL DATA",
    JSON.stringify(
        result.generalData,
        null,
        2
    )
);

console.log(
    "DISEASE DATA",
    JSON.stringify(
        result.diseaseData,
        null,
        2
    )
);

})();
