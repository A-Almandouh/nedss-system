console.log("saveDepartmentSheet loaded");

async function saveDepartmentSheet() {

    const settings =
        (
            await chrome.storage.local.get(
                "settings"
            )
        ).settings || {};

    const spreadsheetId =
        settings.departmentSheet;

    if (!spreadsheetId) {

        alert(
            "لم يتم تحديد ملف الإدارة"
        );

        return;

    }

    //--------------------------------
    // جمع البيانات
    //--------------------------------

    const allData =
        await collectAllData();

    const result =
        splitData(
            allData
        );

    //--------------------------------
    // البيانات العامة
    //--------------------------------

    await fetch(

        GOOGLE_SCRIPT_URL,

        {

            method: "POST",

            body: JSON.stringify({

                spreadsheetId,

                sheetName:
                    "G-Data",

                data:
                    result.generalData

            })

        }

    );

    //--------------------------------
    // بيانات المرض
    //--------------------------------

    await fetch(

        GOOGLE_SCRIPT_URL,

        {

            method: "POST",

            body: JSON.stringify({

                spreadsheetId,

                sheetName:
                    allData.DiseaseID,

                data:
                    result.diseaseData

            })

        }

    );

}
