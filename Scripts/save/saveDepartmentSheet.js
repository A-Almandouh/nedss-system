console.log(
    "saveDepartmentSheet loaded"
);

async function saveDepartmentSheet() {

    const data =
        await collectAllData();

    console.log(
        "Department Data",
        data
    );

}
