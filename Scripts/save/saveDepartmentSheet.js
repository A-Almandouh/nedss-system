
//const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhQ7qPMq_kQpwT_wUzTJ4SbfYKhwpfb6S-Tuxbc3_dCmciR5-FE5IA5QcIllyumySY/exec";
console.log("saveDepartmentSheet loaded - Version 8");

async function saveDepartmentSheet() {
    let govSheetId = "";
    let deptSheetId = "";
    let driveFolderId = "";

    // 1. جلب معرفات الملفات والمجلد من ذاكرة الإضافة مع التحقق الذكي من صحتها
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        console.log("🔍 جاري التحقق من بيانات الإعدادات في ذاكرة الإضافة محلياً...");
        const settings = (await chrome.storage.local.get("settings")).settings || {};
        
        govSheetId = settings.governorateSheet || "";
        deptSheetId = settings.departmentSheet || "";
        driveFolderId = settings.driveFolderId || "";

        // فحص وصول البيانات للـ Console
        console.log("📊 [ملف المحافظة]:", govSheetId ? "✅ متوفر: " + govSheetId : "❌ غير معرف بالإعدادات");
        console.log("📊 [ملف الإدارة]:", deptSheetId ? "✅ متوفر: " + deptSheetId : "❌ غير معرف بالإعدادات");
        console.log("📊 [مجلد درايف]:", driveFolderId ? "✅ متوفر: " + driveFolderId : "❌ غير معرف بالإعدادات");
    } else {
        console.log("⚠️ تنبيه: الكود يعمل خارج إضافة كروم (الـ Console العام). تم تطبيق قيم الاختبار الافتراضية.");
        govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M"; 
        deptSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
        driveFolderId = "1O4fbgDHYXjYV9Garh_zsJAL__PhSk_5c"; 
    }

    // 2. التحقق من معرف مجلد درايف وتطبيق القيم الافتراضية الذكية بناءً على المنطقة
    if (!driveFolderId) {
        console.log("🔄 لم يتم العثور على driveFolderId في الإعدادات، يتم الفحص بناءً على المنطقة...");
        
        // خريطة المجلدات حسب اسم المنطقة (مكتوبة بالصيغة النقية التي تبدأ بالحرف مباشرة)
        const folderMap = {
            "الحمام": "GRuw0fNeOZNFE-NrP014rNmDuUhrySnW",
            "العلمين": "KSG4-Q754StABwYqh8NxuAGh5zG2GpM0",
            "الضبعه": "NVwy8oujcRiCaWLWrSA5EmaKinUpt0wX",
            "مطروح": "POq1hlYgjh0BWus7Wgv4DwtPo896hOuy",
            "النجيليه": "RcKYywc6GSQ6kna6gp5O4rcg2xxeeMIV",
            "بسيدى برانى": "U7J2ZgXSQjWIeGfsDIQHtgP5Ga4Oje32",
            "السلوم": "XJw4uTc2IyxLl3UDBHn9DM4zgW28WWNn",
            "سيوة": "ZmRwdWHzuE-eHq1uZcka0aiQ3HIIBHus"
        };

        // التحقق من وجود الكائن allData والمنطقة المطلوبة داخل الخريطة
        const currentDistrict = typeof allData !== "undefined" && allData.ResidenceDistrict ? allData.ResidenceDistrict.trim() : "";
        
        if (currentDistrict && folderMap[currentDistrict]) {
            driveFolderId = folderMap[currentDistrict];
            console.log(`📁 تم تعيين مجلد المنطقة تلقائياً [${currentDistrict}]: ${driveFolderId}`);
        } else {
            // الخيار الأخير (تقصيات المحافظات) بدون رقم 1 في البداية ليصبح المعرف نقياً
            driveFolderId = "OImES8vUr4D_qyG3G1KLAgvkPNcOHVCb";
            console.log("📁 تم تطبيق المجلد الافتراضي الأخير [تقصيات المحافظات]:", driveFolderId);
        }
    }



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
