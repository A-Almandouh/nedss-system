console.log("saveDepartmentSheet loaded");

async function saveDepartmentSheet() {
    //--------------------------------
    // للاختبار
    //--------------------------------
    const spreadsheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";

    //--------------------------------
    const allData = await collectAllData();
    const result = splitData(allData);

    //--------------------------------
    // حفظ البيانات العامة
    //--------------------------------
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                spreadsheetId: spreadsheetId,
                sheetName: "G-Data",
                data: result.generalData
            })
        });

        const json = await response.json();
        console.log(json);
        
    } catch (error) {
        console.error("حدث خطأ أثناء حفظ البيانات:", error);
    }
}
