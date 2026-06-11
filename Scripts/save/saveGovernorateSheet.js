console.log(
    "saveGovernorateSheet loaded"
);

async function saveGovernorateSheet() {

    const data =
        await collectAllData();

    console.log(
        "Governorate Data",
        data
    );

}
