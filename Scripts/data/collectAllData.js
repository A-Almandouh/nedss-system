// collectAllData.js

async function collectAllData() {

    //----------------------------------
    // بيانات النظام
    //----------------------------------

    const generalData =
        await extractGeneralData();

    //----------------------------------
    // بيانات الفورم الإضافى
    //----------------------------------

    const templateData =
        collectTemplateFields();

    //----------------------------------
    // دمج البيانات
    //----------------------------------

    const data = {

        ...generalData,

        ...templateData

    };

    console.log(
        "All Data",
        data
    );

    return data;

}

async function collectAllData() {

    const allData = {

        ...window.caseData,

        ...collectTemplateFields()

    };

    console.log(
        "ALL DATA"
    );

    console.table(
        allData
    );

    return allData;

}
