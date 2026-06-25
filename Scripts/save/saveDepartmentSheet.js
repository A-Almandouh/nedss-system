
//const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhQ7qPMq_kQpwT_wUzTJ4SbfYKhwpfb6S-Tuxbc3_dCmciR5-FE5IA5QcIllyumySY/exec";
console.log("saveDepartmentSheet loaded - Version 8");

async function saveDepartmentSheet() {
    let govSheetId = "";
    let deptSheetId = "";
    let driveFolderId = "";

    // 1. محاولة جلب البيانات من ذاكرة الإضافة أولاً
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        console.log("🔍 جاري التحقق من بيانات الإعدادات في ذاكرة الإضافة محلياً...");
        const settings = (await chrome.storage.local.get("settings")).settings || {};
        
        govSheetId = settings.governorateSheet || "";
        deptSheetId = settings.departmentSheet || "";
        driveFolderId = settings.driveFolderId || "";
    }

    // 2. إذا كانت الإعدادات فارغة (سواء بسبب عدم وجودها بالإضافة أو لأننا نعمل خارج الإضافة بالـ Console)
    if (!govSheetId || !deptSheetId || !driveFolderId) {
        console.log("🔄 الإعدادات غير مكتملة أو الكود يعمل بالـ Console الفردي. يتم تطبيق القيم الافتراضية بناءً على الإدارة...");

        // تنظيف اسم الإدارة من أي مسافات زائدة
        const district = typeof allData !== "undefined" && allData.ResidenceDistrict ? allData.ResidenceDistrict.trim() : "";

        switch (district) {
            case "الحمام":
                console.log("📍 إدارة الحمام");
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
                deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = "1GRuw0fNeOZNFE-NrP014rNmDuUhrySnW"; 
                break;

            case "العلمين":
                console.log("📍 إدارة العلمين");
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
                deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = "1KSG4-Q754StABwYqh8NxuAGh5zG2GpM0"; 
                break;

            case "الضبعه":
                console.log("📍 إدارة الضبعه");
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
                deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = "1NVwy8oujcRiCaWLWrSA5EmaKinUpt0wX"; 
                break;

            case "مطروح":
                console.log("📍 إدارة مطروح");
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
                deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = "1POq1hlYgjh0BWus7Wgv4DwtPo896hOuy"; 
                break;

            case "النجيليه":
                console.log("📍 إدارة النجيليه");
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
                deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = "1RcKYywc6GSQ6kna6gp5O4rcg2xxeeMIV"; 
                break;

            case "بسيدى برانى":
                console.log("📍 إدارة بسيدى برانى");
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
                deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = "1U7J2ZgXSQjWIeGfsDIQHtgP5Ga4Oje32"; 
                break;

            case "السلوم":
                console.log("📍 إدارة السلوم");
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
                deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = "1XJw4uTc2IyxLl3UDBHn9DM4zgW28WWNn"; 
                break;

            case "سيوة":
                console.log("📍 إدارة سيوة");
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
                deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = "1ZmRwdWHzuE-eHq1uZcka0aiQ3HIIBHus"; 
                break;

            default:
                // الخيار الأخير (تقصيات المحافظات) في حال لم تطابق الإدارة أي مما سبق
                console.log("⚠️ تم تطبيق الخيار الأخير [تقصيات المحافظات]");
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
                deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = "1OImES8vUr4D_qyG3G1KLAgvkPNcOHVCb"; 
                break;
        }
    }

    // طباعة النتيجة النهائية للتأكيد
    console.log("📊 [ملف المحافظة النهائي]:", govSheetId);
    console.log("📊 [ملف الإدارة النهائي]:", deptSheetId);
    console.log("📊 [مجلد درايف النهائي]:", driveFolderId);



    // التحقق الفوري لعدم إضاعة الوقت في حال غياب الشيتات
    if (!govSheetId && !deptSheetId) {
        alert("⚠️ خطأ: لم يتم جلب ملف المحافظة أو ملف الإدارة من الإعدادات! تم إلغاء عملية الحفظ.");
        return;
    }

    // 2. جمع البيانات النصية وتجهيزها
    const allData = await collectAllData();
    const result = splitData(allData);

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhQ7qPMq_kQpwT_wUzTJ4SbfYKhwpfb6S-Tuxbc3_dCmciR5-FE5IA5QcIllyumySY/exec";
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
    if (driveFolderId) {
        try {
            console.log("جاري رفع نسخة الـ HTML إلى Google Drive... المجلد المستخدم:", driveFolderId);
            const responseHTML = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({
                    action: "uploadHTML",
                    htmlContent: fullHtmlString,
                    fileName: htmlFileName,
                    folderId: driveFolderId 
                })
            });
            
            const resHtmlJson = await responseHTML.json();
            console.log("الرد الكامل لملف الـ HTML من السيرفر:", resHtmlJson);

            if (resHtmlJson.success) {
                summaryMessages.push(`☁️ تم رفع نسخة الـ HTML بنجاح إلى المجلد المحدد في Google Drive.`);
            } else {
                summaryMessages.push(`❌ فشل رفع ملف الـ HTML. السبب: ${resHtmlJson.error || "خطأ غير معروف"}`);
            }
        } catch (err) {
            console.error("خطأ أثناء رفع ملف الـ HTML في المتصفح:", err);
            summaryMessages.push("⚠️ فشل الاتصال بالسيرفر أثناء رفع ملف الـ HTML.");
        }
    } else {
        console.warn("تنبيه: تم تخطي رفع ملف الـ HTML لأن معرف المجلد (driveFolderId) فارغ.");
        summaryMessages.push("⚠️ لم يتم رفع ملف الـ HTML لعدم توفر معرّف المجلد.");
    }

    alert(summaryMessages.join("\n"));
}
