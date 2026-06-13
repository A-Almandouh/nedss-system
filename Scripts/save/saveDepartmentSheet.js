console.log("saveDepartmentSheet loaded");
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywVVr1NoIYGnyaAlbbBGayNJQVgFVmCVUKNEakWBXlMZ05uIrEm-YseLVyaRmvqQe-/exec";


async function saveDepartmentSheet() {
    const settings = (await chrome.storage.local.get("settings")).settings || {};
    const spreadsheetId = settings.departmentSheet;

    if (!spreadsheetId) {
        alert("لم يتم تحديد ملف الإدارة");
        return;
    }

    //--------------------------------
    // جمع البيانات
    //--------------------------------
    const allData = await collectAllData();
    const result = splitData(allData);

    // تأكيد الرابط الخاص بك (تأكد من تعريفه في مكان ما بالكود أو استبدل المتغير بالرابط المباشر)
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywVVr1NoIYGnyaAlbbBGayNJQVgFVmCVUKNEakWBXlMZ05uIrEm-YseLVyaRmvqQe-/exec";
    try {
        //--------------------------------
        // 1. حفظ البيانات العامة
        //--------------------------------
        console.log("جاري حفظ البيانات العامة...");
        const responseGeneral = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8" // التحايل لتخطي CORS
            },
            body: JSON.stringify({
                spreadsheetId: spreadsheetId,
                sheetName: "G-Data",
                data: result.generalData
            })
        });

        const resGeneralJson = await responseGeneral.json();
        console.log("نتيجة حفظ البيانات العامة:", resGeneralJson);

        //--------------------------------
        // 2. حفظ بيانات المرض
        //--------------------------------
        console.log(`جاري حفظ بيانات المرض في الشيت: ${allData.DiseaseID}...`);
        const responseDisease = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8" // التحايل لتخطي CORS
            },
            body: JSON.stringify({
                spreadsheetId: spreadsheetId,
                sheetName: allData.DiseaseID, // اسم الشيت هو رقم المرض
                data: result.diseaseData
            })
        });

        const resDiseaseJson = await responseDisease.json();
        console.log("نتيجة حفظ بيانات المرض:", resDiseaseJson);

        // تنبيه للمستخدم بنجاح العمليتين
        if (resGeneralJson.success && resDiseaseJson.success) {
            alert("تم حفظ البيانات العامة وبيانات المرض بنجاح في جوجل شيت!");
        } else {
            alert("تم إرسال البيانات ولكن حدثت مشكلة في الشيت، راجع الـ Console لمعرفة السبب.");
        }

    } catch (error) {
        console.error("حدث خطأ أثناء عملية الاتصال بحفظ البيانات:", error);
        alert("فشلت عملية الحفظ، يرجى التحقق من اتصال الإنترنت أو من إعدادات السكريبت.");
    }
}
