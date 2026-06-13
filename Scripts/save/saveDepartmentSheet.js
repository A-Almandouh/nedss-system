
//const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywVVr1NoIYGnyaAlbbBGayNJQVgFVmCVUKNEakWBXlMZ05uIrEm-YseLVyaRmvqQe-/exec";

console.log("saveDepartmentSheet loaded");

async function saveDepartmentSheet() {
    let governorateSheetId = "";
    let departmentSheetId = "";

    // 1. جلب المعرفات بناءً على بيئة التشغيل (إضافة كروم أم الـ Console للاختبار)
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const settings = (await chrome.storage.local.get("settings")).settings || {};
        governorateSheetId = settings.governorateSheet; // ملف المحافظة
        departmentSheetId = settings.departmentSheet;   // ملف الإدارة
    } else {
        console.log("تنبيه: الكود يعمل خارج إضافة كروم، تم استخدام المعرفات الافتراضية للاختبار.");
        // ضع هنا المعرفات الافتراضية الخاصة بك للاختبار في الـ Console
        governorateSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
        departmentSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
    }

    // 2. التحقق من وجود الملفات وإظهار التنبيهات المناسبة دون إيقاف الكود
    if (!governorateSheetId && !departmentSheetId) {
        alert("⚠️ خطأ: لم يتم تحديد ملف المحافظة ولا ملف الإدارة في الإعدادات! تم إلغاء الحفظ.");
        return;
    }
    if (!governorateSheetId) {
        console.warn("تنبيه: ملف المحافظة غير محدد، سيتم الحفظ في ملف الإدارة فقط.");
    }
    if (!departmentSheetId) {
        console.warn("تنبيه: ملف الإدارة غير محدد، سيتم الحفظ في ملف المحافظة فقط.");
    }

    // 3. جمع البيانات وتجهيزها
    const allData = await collectAllData();
    const result = splitData(allData);

    const GOOGLE_SCRIPT_URL = "https://google.com";
    
    // مصفوفة لتتبع نتائج الحفظ لعرضها في تنبيه نهائي للمستخدم
    let summaryMessages = [];

    // 4. دالة داخلية مساعدة لإرسال البيانات لملف محدد (تمنع تكرار الكود وتضمن عدم توقف السكريبت بالكامل)
    async function sendToSpreadsheet(spreadsheetId, label) {
        try {
            // أ. إرسال البيانات العامة "G-Data"
            const responseGeneral = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({
                    spreadsheetId: spreadsheetId,
                    sheetName: "G-Data",
                    data: result.generalData
                })
            });
            const resGeneralJson = await responseGeneral.json();

            // ب. إرسال بيانات المرض
            const responseDisease = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({
                    spreadsheetId: spreadsheetId,
                    sheetName: allData.DiseaseID, 
                    data: result.diseaseData
                })
            });
            const resDiseaseJson = await responseDisease.json();

            if (resGeneralJson.success && resDiseaseJson.success) {
                summaryMessages.push(`✅ تم الحفظ/التحديث بنجاح في ${label}.`);
            } else {
                summaryMessages.push(`❌ حدث خطأ داخلي أثناء الحفظ في ${label}.`);
            }
        } catch (error) {
            console.error(`خطأ أثناء الاتصال بـ ${label}:`, error);
            summaryMessages.push(`❌ فشل الاتصال بالسيرفر لحفظ بيانات ${label}.`);
        }
    }

    // 5. تنفيذ الحفظ للملفات المتاحة فقط بالتوازي
    const tasks = [];
    if (governorateSheetId) {
        tasks.push(sendToSpreadsheet(governorateSheetId, "ملف المحافظة"));
    }
    if (departmentSheetId) {
        tasks.push(sendToSpreadsheet(departmentSheetId, "ملف الإدارة"));
    }

    // الانتظار حتى تنتهي كافة المحاولات
    await Promise.all(tasks);

    // 6. عرض النتيجة النهائية للمستخدم بناءً على ما حدث فعلياً
    alert(summaryMessages.join("\n"));
}
