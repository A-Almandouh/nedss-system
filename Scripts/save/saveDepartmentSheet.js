
//const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz76KHoZNQGO_HqvEuvIIInfk1FLdEWBb-ipA6oYzJ2n-2It6i6ZCz1pzBZhKlCJhjr/exec";
console.log("saveDepartmentSheet loaded4");

async function saveDepartmentSheet() {
    let govSheetId = "";
    let deptSheetId = "";
    let driveFolderId = ""; // المتغير الجديد لربطه بصفحة الإعدادات مستقبلاً

    // 1. جلب معرفات الملفات والمجلد من ذاكرة الإضافة أو استخدام الافتراضي للاختبار
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const settings = (await chrome.storage.local.get("settings")).settings || {};
        govSheetId = settings.governorateSheet;
        deptSheetId = settings.departmentSheet;
        driveFolderId = settings.driveFolderId; // سيتم قراءته مباشرة من إعدادات الإضافة
    } else {
        console.log("تنبيه: الكود يعمل خارج إضافة كروم، تم استخدام المعرّفات الافتراضية للاختبار.");
        govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
        deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
        driveFolderId = "1O4fbgDHYXjYV9Garh_zsJAL__PhSk_5c"; // 💡 يمكنك وضع الـ Folder ID الخاص بك هنا للاختبار في الـ Console
    }

    if (!govSheetId && !deptSheetId) {
        alert("⚠️ خطأ: لم يتم تحديد ملف المحافظة أو ملف الإدارة! تم إلغاء عملية الحفظ.");
        return;
    }

    // 2. جمع البيانات النصية وتجهيزها
    const allData = await collectAllData();
    const result = splitData(allData);

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz76KHoZNQGO_HqvEuvIIInfk1FLdEWBb-ipA6oYzJ2n-2It6i6ZCz1pzBZhKlCJhjr/exec";
    let summaryMessages = [];

    //---------------------------------------------------------
    // أ. تجهيز نسخة الـ HTML برمجياً
    //---------------------------------------------------------
    const clone = document.documentElement.cloneNode(true);
    const toolbar = clone.querySelector("#nedss-toolbar");
    if (toolbar) { toolbar.remove(); }

    document.querySelectorAll("input").forEach((input, index) => {
        const clonedInput = clone.querySelectorAll("input")[index];
        if (!clonedInput) return;
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) { clonedInput.setAttribute("checked", "checked"); } 
            else { clonedInput.removeAttribute("checked"); }
        } else { clonedInput.setAttribute("value", input.value); }
    });

    document.querySelectorAll("textarea").forEach((textarea, index) => {
        const clonedTextarea = clone.querySelectorAll("textarea")[index];
        if (clonedTextarea) { clonedTextarea.textContent = textarea.value; }
    });

    document.querySelectorAll("select").forEach((select, index) => {
        const clonedSelect = clone.querySelectorAll("select")[index];
        if (!clonedSelect) return;
        [...clonedSelect.options].forEach(option => option.removeAttribute("selected"));
        const selectedOption = clonedSelect.options[select.selectedIndex];
        if (selectedOption) { selectedOption.setAttribute("selected", "selected"); }
    });

    const fullHtmlString = "<!DOCTYPE html>\n" + clone.outerHTML;
    const htmlFileName = `${allData.PatientName || document.title || "Case"}_${allData.CaseID || ""}.html`;

    //---------------------------------------------------------
    // دالة فرعية داخلية لإرسال البيانات للشيتات
    //---------------------------------------------------------
    async function sendToGoogleSheet(spreadsheetId, label) {
        try {
            const responseGeneral = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ spreadsheetId: spreadsheetId, sheetName: "G-Data", data: result.generalData })
            });
            const resGenJson = await responseGeneral.json();

            const responseDisease = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ spreadsheetId: spreadsheetId, sheetName: allData.DiseaseID, data: result.diseaseData })
            });
            const resDisJson = await responseDisease.json();

            if (resGenJson.success && resDisJson.success) {
                summaryMessages.push(`✅ تم حفظ/تحديث البيانات في (${label}).`);
            } else {
                summaryMessages.push(`❌ حدثت مشكلة أثناء الحفظ الداخلي في (${label}).`);
            }
        } catch (error) {
            console.error(`خطأ أثناء الاتصال بـ ${label}:`, error);
            summaryMessages.push(`⚠️ فشل الاتصال بالسيرفر أثناء الحفظ في (${label}).`);
        }
    }

    //---------------------------------------------------------
    // تنفيذ عمليات الحفظ المتتابعة للـ Sheets
    //---------------------------------------------------------
    if (govSheetId) {
        console.log("بدء الحفظ في ملف المحافظة...");
        await sendToGoogleSheet(govSheetId, "ملف المحافظة");
    }

    if (deptSheetId) {
        console.log("بدء الحفظ في ملف الإدارة...");
        await sendToGoogleSheet(deptSheetId, "ملف الإدارة");
    }

    //---------------------------------------------------------
    // ب. رفع ملف الـ HTML وتمرير الـ folderId المختار برمجياً
    //---------------------------------------------------------
    try {
        console.log("جاري رفع نسخة الـ HTML إلى Google Drive...");
        const responseHTML = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "uploadHTML",
                htmlContent: fullHtmlString,
                fileName: htmlFileName,
                folderId: driveFolderId // 💡 يتم إرسال معرف المجلد القادم من إعدادات المتصفح هنا
            })
        });
        const resHtmlJson = await responseHTML.json();
        if (resHtmlJson.success) {
            summaryMessages.push(`☁️ تم رفع نسخة الـ HTML بنجاح إلى المجلد المحدد في Google Drive.`);
        } else {
            summaryMessages.push(`❌ فشل رفع ملف الـ HTML: ${resHtmlJson.error}`);
        }
    } catch (err) {
        console.error("خطأ أثناء رفع ملف الـ HTML:", err);
        summaryMessages.push("⚠️ فشل الاتصال بالسيرفر أثناء رفع ملف الـ HTML.");
    }

    alert(summaryMessages.join("\n"));
}
