console.log("saveToSheet loaded");

async function saveToSheet() {

    try {

        //----------------------------------
        // شيت الإدارة
        //----------------------------------

        await saveDepartmentSheet();

        //----------------------------------
        // شيت المحافظة
        //----------------------------------

        await saveGovernorateSheet();

        //----------------------------------

        alert(
            "تم حفظ البيانات فى شيت الإدارة وشيت المحافظة بنجاح"
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء حفظ البيانات"
        );

    }

}
