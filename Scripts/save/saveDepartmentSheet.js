
//const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPYz2EK2bLj6ToVLJa0bJktLhbBAkdbjxZP8SBUpiseBraA5EgxbC1iWp9JjyO1747/exec";
console.log("saveDepartmentSheet loaded3");

async function saveDepartmentSheet() {
    let govSheetId = "";
    let deptSheetId = "";

    // 1. جلب معرفات الملفات من ذاكرة الإضافة أو استخدام الافتراضي للاختبار
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const settings = (await chrome.storage.local.get("settings")).settings || {};
        govSheetId = settings.governorateSheet;
        deptSheetId = settings.departmentSheet;
    } else {
        console.log("تنبيه: الكود يعمل خارج إضافة كروم، تم استخدام المعرّفات الافتراضية للاختبار.");
        govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
        deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
    }

    if (!govSheetId && !deptSheetId) {
        alert("⚠️ خطأ: لم يتم تحديد ملف المحافظة أو ملف الإدارة! تم إلغاء عملية الحفظ.");
        return;
    }

    // 2. جمع البيانات النصية وتجهيزها للشيتات
    const allData = await collectAllData();
    const result = splitData(allData);

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPYz2EK2bLj6ToVLJa0bJktLhbBAkdbjxZP8SBUpiseBraA5EgxbC1iWp9JjyO1747/exec";
    let summaryMessages = [];

    //---------------------------------------------------------
    // أ. جلب كود الـ HTML المحدث والمطوّر برمجياً لرفعه للسحابة
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
    // اسم ملف الـ HTML سيكون اسم المريض متبوعاً بالرقم التعريفي
    const htmlFileName = `${allData.PatientName || document.title || "Case"}_${allData.CaseID || ""}.html`;

    //---------------------------------------------------------
    // دالة فرعية داخلية لإرسال البيانات وجدول الـ HTML للشيت المحدد
    //---------------------------------------------------------
    async function sendToGoogleSheet(spreadsheetId, label) {
        try {
            // أولاً: إرسال البيانات العامة للشيت
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

            // ثانياً: إرسال بيانات المرض للشيت
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
    // تنفيذ عمليات الحفظ المتتابعة
    //---------------------------------------------------------
    
    // 1. حفظ ملف المحافظة
    if (govSheetId) {
        console.log("بدء الحفظ في ملف المحافظة...");
        await sendToGoogleSheet(govSheetId, "ملف المحافظة");
    }

    // 2. حفظ ملف الإدارة
    if (deptSheetId) {
        console.log("بدء الحفظ في ملف الإدارة...");
        await sendToGoogleSheet(deptSheetId, "ملف الإدارة");
    }

    // 3. رفع ملف الـ HTML إلى Google Drive تلقائياً
    try {
        console.log("جاري رفع نسخة الـ HTML إلى Google Drive سحابياً...");
        const responseHTML = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "uploadHTML",
                htmlContent: fullHtmlString,
                fileName: htmlFileName
            })
        });
        const resHtmlJson = await responseHTML.json();
        if (resHtmlJson.success) {
            summaryMessages.push(`☁️ تم رفع نسخة الـ HTML بأمان لـ Google Drive في مجلد NEDSS_Saved_Cases.`);
        } else {
            summaryMessages.push(`❌ فشل رفع ملف الـ HTML على السحابة: ${resHtmlJson.error}`);
        }
    } catch (err) {
        console.error("خطأ أثناء رفع ملف الـ HTML:", err);
        summaryMessages.push("⚠️ فشل الاتصال بالسيرفر أثناء رفع ملف الـ HTML.");
    }

    // 4. عرض التقرير النهائي الشامل للمستخدم
    alert(summaryMessages.join("\n"));
}
