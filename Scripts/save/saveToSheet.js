console.log("saveToSheet loaded");

// تم تعديل الدالة لتستقبل كائن الإعدادات (passedSettings) وتمريره للأسفل
async function saveToSheet(passedSettings = null) {

    try {

        //----------------------------------
        // شيت الإدارة (تم تمرير الإعدادات هنا)
        //----------------------------------
        await saveDepartmentSheet(passedSettings);

    }

    catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء حفظ البيانات"
        );

    }

}
