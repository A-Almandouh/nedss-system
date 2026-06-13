
//const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywVVr1NoIYGnyaAlbbBGayNJQVgFVmCVUKNEakWBXlMZ05uIrEm-YseLVyaRmvqQe-/exec";
console.log("saveDepartmentSheet loaded2");

async function saveDepartmentSheet() {
    let govSheetId = "";
    let deptSheetId = "";

    // 1. جلب معرفات الملفات من ذاكرة الإضافة أو استخدام الافتراضي للاختبار
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const settings = (await chrome.storage.local.get("settings")).settings || {};
        govSheetId = settings.governorateSheet; // ملف المحافظة
        deptSheetId = settings.departmentSheet;  // ملف الإدارة
    } else {
        console.log("تنبيه: الكود يعمل خارج إضافة كروم، تم استخدام المعرّفات الافتراضية للاختبار.");
        govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; // معرف شيت المحافظة الافتراضي للاختبار
        deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; // معرف شيت الإدارة الافتراضي للاختبار
    }

    // 2. التحقق من وجود الملفات وإظهار التنبيهات المناسبة دون إيقاف الكود
    if (!govSheetId && !deptSheetId) {
        alert("⚠️ خطأ: لم يتم تحديد ملف المحافظة أو ملف الإدارة! تم إلغاء عملية الحفظ.");
        return;
    }

    if (!govSheetId) {
        console.warn("تنبيه: ملف المحافظة غير محدد، سيتم الحفظ في ملف الإدارة فقط.");
    }
    if (!deptSheetId) {
        console.warn("تنبيه: ملف الإدارة غير محدد، سيتم الحفظ في ملف المحافظة فقط.");
    }

    // 3. جمع البيانات وتجهيزها
    const allData = await collectAllData();
    const result = splitData(allData);

    // الرابط المحدد والخاص بك تم تثبيته هنا بشكل مباشر ومحمي
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywVVr1NoIYGnyaAlbbBGayNJQVgFVmCVUKNEakWBXlMZ05uIrEm-YseLVyaRmvqQe-/exec";
    
    // مصفوفة لتتبع نتائج الحفظ لعرض التقرير النهائي
    let summaryMessages = [];

    //---------------------------------------------------------
    // دالة فرعية داخلية لإرسال البيانات للشيت المحدد
    //---------------------------------------------------------
    async function sendToGoogleSheet(spreadsheetId, label) {
        try {
            // أ. إرسال البيانات العامة
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
            const resGenJson = await responseGeneral.json();

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
            const resDisJson = await responseDisease.json();

            if (resGenJson.success && resDisJson.success) {
                summaryMessages.push(`✅ تم حفظ/تحديث البيانات بنجاح في (${label}).`);
            } else {
                summaryMessages.push(`❌ حدثت مشكلة أثناء الحفظ الداخلي في (${label}).`);
            }

        } catch (error) {
            console.error(`خطأ أثناء الاتصال بـ ${label}:`, error);
            summaryMessages.push(`⚠️ فشل الاتصال بالسيرفر أثناء الحفظ في (${label}).`);
        }
    }

    //---------------------------------------------------------
    // تنفيذ عمليات الحفظ بشكل مستقل ومتتابع
    //---------------------------------------------------------
    
    // تنفيذ الحفظ لملف المحافظة إذا كان موجوداً
    if (govSheetId) {
        console.log("بدء الحفظ في ملف المحافظة...");
        await sendToGoogleSheet(govSheetId, "ملف المحافظة");
    }

    // تنفيذ الحفظ لملف الإدارة إذا كان موجوداً
    if (deptSheetId) {
        console.log("بدء الحفظ في ملف الإدارة...");
        await sendToGoogleSheet(deptSheetId, "ملف الإدارة");
    }

    // 4. عرض التقرير النهائي للمستخدم بناءً على ما حدث
    alert(summaryMessages.join("\n"));
}
