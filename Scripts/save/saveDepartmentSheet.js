console.log("saveDepartmentSheet loaded");

async function saveDepartmentSheet() {

    //--------------------------------
    // مؤقتاً للاختبار
    //--------------------------------

    const spreadsheetId =
        "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";

    //--------------------------------

    const allData =
        await collectAllData();

    const result =
        splitData(
            allData
        );

    //--------------------------------
    // G-Data
    //--------------------------------

    await fetch(

        GOOGLE_SCRIPT_URL,

        {

            method: "POST",

            body: JSON.stringify({

                spreadsheetId,

               
