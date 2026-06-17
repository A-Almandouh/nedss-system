console.log("saveToSheet loaded");

async function saveToSheet() {

    try {

        //----------------------------------
        // شيت الإدارة
        //----------------------------------

        await saveDepartmentSheet();

               

    }

    catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء حفظ البيانات"
        );

    }

}
