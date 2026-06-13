console.log("saveToSheet loaded");

async function saveToSheet() {

    try {

        //----------------------------------
        // شيت الإدارة
        //----------------------------------

        await saveDepartmentSheet();

        
        //----------------------------------

        alert(
            "تم حفظ البيانات بنجاح"
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء حفظ البيانات"
        );

    }

}
