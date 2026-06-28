console.log("saveDepartmentSheet loaded - Version 11");

// جعل الدالة تستقبل كائن settings القادم من content.js كمعامل (Parameter)
async function saveDepartmentSheet(passedSettings = null) {
    let govSheetId = "";
    let deptSheetId = "";
    let driveFolderId = "";

    function isValidId(val) {
        return typeof val === "string" && val.trim() !== "";
    }

    console.log("🚀 بدء تشغيل دالة saveDepartmentSheet...");

    // محاولة قراءة الإعدادات الممررة أولاً، وإلا يحاول قراءتها محلياً
    let settings = passedSettings || {};
    
    if (!passedSettings && typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        console.log("🔍 محاولة قراءة الإعدادات محلياً من chrome.storage.local...");
        try {
            const storageData = await chrome.storage.local.get("settings");
            settings = storageData.settings || {};
        } catch (err) {
            console.error("❌ خطأ أثناء القراءة المحلية:", err);
        }
    }

    // مطابقة المسميات الصحيحة بناءً على الـ IDs في صفحة الإعدادات الخاصة بك
    govSheetId = settings.governorateSheet || "";
    deptSheetId = settings.departmentSheet || "";
    driveFolderId = settings.pdfFolder || ""; // 💡 تم التعديل هنا إلى pdfFolder ليتطابق مع الـ ID لديك

    console.log("📊 المستخرج الفعلي [GovernorateSheet]:", govSheetId || "❌ فارغ");
    console.log("📊 المستخرج الفعلي [DepartmentSheet]:", deptSheetId || "❌ فارغ");
    console.log("📊 المستخرج الفعلي [DriveFolder (pdfFolder)]:", driveFolderId || "❌ فارغ");

    // 2. جلب البيانات الأساسية للعملية
    const allData = await collectAllData();
    const result = splitData(allData);

    // 3. تطبيق القيم الافتراضية الذكية بفصل الشروط بالكامل وبشكل مستقل
    const district = (allData.ResidenceDistrict || "").trim();
    console.log("📍 المنطقة الحالية (ResidenceDistrict) =", district);

    // [فصل مستقل] - فحص وتهيئة شرط الـ Governorate Sheet
    if (!isValidId(govSheetId)) {
        switch (district) {
            case "الحمام": case "العلمين": case "الضبعه": case "مطروح": 
            case "النجيليه": case "سيدى برانى": case "السلوم": case "سيوة":
                govSheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                break;
            default:
                govSheetId = "1HE7HinF2pQu4hh33GXvxvr8_upcJJ_-kqaM1MTfhe64";
                break;
        }
        console.log("⚠️ تم تطبيق govSheetId افتراضي للمنطقة:", govSheetId);
    } else {
        console.log("✅ تم اعتماد govSheetId من الإعدادات بنجاح:", govSheetId);
    }

    // [فصل مستقل] - فحص وتهيئة شرط الـ Department Sheet
    if (!isValidId(deptSheetId)) {
        switch (district) {
            case "الحمام": deptSheetId = "1tNEAKq7VLRGA1zSG7mieqrS4PXMa3IHTv1b2p9xPkSk"; break;
            case "العلمين": deptSheetId = "1nwYgtaB-jXYDaDS9001U44Z1teMfaPyijPaTu1ZxuB8"; break;
            case "الضبعه": deptSheetId = "1eFyCrNURcj-WjJazULVQgO4HWRY86fkK-HYibvzaqys"; break;
            case "مطروح": deptSheetId = "19Ei5f4s58XbhHkKxmJguTeKOFALwEQkGH65AF7JZE4I"; break;
            case "النجيليه": deptSheetId = "1y46lHwCV_HBzCAbwiuheenRWcEKRXWPWPsdN2y86y50"; break;
            case "سيدى برانى": deptSheetId = "1hoq1TrS8ubeDan_KzvyFCFLLdGaLCCgC11jvvMet7wI"; break;
            case "السلوم": deptSheetId = "177nqNVKJ5IQDPKLoFniDI243LMTHVPw6KBzVdovHULY"; break;
            case "سيوة": deptSheetId = "1P8eUrMclPEY_JqoifR38AEAIuKcb3eLN6DmG_FlGWMM"; break;
            default: deptSheetId = "1HE7HinF2pQu4hh33GXvxvr8_upcJJ_-kqaM1MTfhe64"; break;
        }
        console.log("⚠️ تم تطبيق deptSheetId افتراضي للمنطقة:", deptSheetId);
    } else {
        console.log("✅ تم اعتماد deptSheetId من الإعدادات بنجاح:", deptSheetId);
    }

    // [فصل مستقل] - فحص وتهيئة شرط الـ Drive Folder ID
    if (!isValidId(driveFolderId)) {
        switch (district) {
            case "الحمام": driveFolderId = "1GRuw0fNeOZNFE-NrP014rNmDuUhrySnW"; break;
            case "العلمين": driveFolderId = "1KSG4-Q754StABwYqh8NxuAGh5zG2GpM0"; break;
            case "الضبعه": driveFolderId = "1NVwy8oujcRiCaWLWrSA5EmaKinUpt0wX"; break;
            case "مطروح": driveFolderId = "1POq1hlYgjh0BWus7Wgv4DwtPo896hOuy"; break;
            case "النجيليه": driveFolderId = "1RcKYywc6GSQ6kna6gp5O4rcg2xxeeMIV"; break;
            case "سيدى برانى": driveFolderId = "1U7J2ZgXSQjWIeGfsDIQHtgP5Ga4Oje32"; break;
            case "السلوم": driveFolderId = "1XJw4uTc2IyxLl3UDBHn9DM4zgW28WWNn"; break;
            case "سيوة": driveFolderId = "1ZmRwdWHzuE-eHq1uZcka0aiQ3HIIBHus"; break;
            default: driveFolderId = "1OImES8vUr4D_qyG3G1KLAgvkPNcOHVCb"; break;
        }
        console.log("⚠️ تم تطبيق driveFolderId افتراضي للمنطقة:", driveFolderId);
    } else {
        console.log("✅ تم اعتماد driveFolderId من الإعدادات بنجاح:", driveFolderId);
    }

    console.log("📊 Final GovernorateSheet =", govSheetId);
    console.log("📊 Final DepartmentSheet =", deptSheetId);
    console.log("📊 Final DriveFolder =", driveFolderId);

    console.log("⚙️ جاري بدء عمليات الحفظ والرفع الفعلية...");
    

    // التحقق من وجود المعرفات قبل بدء الإرسال
    if (!govSheetId && !deptSheetId) {
        alert("⚠️ خطأ: لم يتم جلب ملف المحافظة أو ملف الإدارة من الإعدادات! تم إلغاء عملية الحفظ.");
        return;
    }

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhQ7qPMq_kQpwT_wUzTJ4SbfYKhwpfb6S-Tuxbc3_dCmciR5-FE5IA5QcIllyumySY/exec";
    let summaryMessages = [];

    // 4. معالجة وتجهيز ملف الـ HTML وتنسيقه للرفع
    const clone = document.documentElement.cloneNode(true);
    const toolbar = clone.querySelector("#nedss-toolbar");
    if (toolbar) {
        toolbar.remove();
    }

    document.querySelectorAll("input").forEach((input, index) => {
        const clonedInput = clone.querySelectorAll("input")[index];
        if (!clonedInput) return;
        if (input.type === "checkbox" || input.type === "radio") {
            if (input.checked) {
                clonedInput.setAttribute("checked", "checked");
            } else {
                clonedInput.removeAttribute("checked");
            }
        } else {
            clonedInput.setAttribute("value", input.value);
        }
    });

    document.querySelectorAll("textarea").forEach((textarea, index) => {
        const clonedTextarea = clone.querySelectorAll("textarea")[index];
        if (clonedTextarea) {
            clonedTextarea.textContent = textarea.value;
        }
    });

    document.querySelectorAll("select").forEach((select, index) => {
        const clonedSelect = clone.querySelectorAll("select")[index];
        if (!clonedSelect) return;
        [...clonedSelect.options].forEach(option => option.removeAttribute("selected"));
        const selectedOption = clonedSelect.options[select.selectedIndex];
        if (selectedOption) {
            selectedOption.setAttribute("selected", "selected");
        }
    });
      const reportDateRaw = (allData.ReportDate || "").trim();
    let reportMonth = "";
    let reportYear = "";

    if (reportDateRaw && reportDateRaw.includes("/")) {
        const dateParts = reportDateRaw.split("/"); // تقسيم النص عند كل "/"
        
        // التأكد من أن النص تم تقسيمه إلى 3 أجزاء (يوم، شهر، سنة)
        if (dateParts.length === 3) {
            reportMonth = dateParts[1].trim(); // الجزء الثاني هو الشهر (مثال: 06)
            reportYear = dateParts[2].trim();  // الجزء الثالث هو السنة (مثال: 2026)
        }
    }

    // في حال عدم العثور على تاريخ تقرير صالح أو كان الحقل فارغاً، يتم استخدام تاريخ اليوم كاحتياطي
    if (!reportMonth || !reportYear) {
        const fallbackDate = new Date();
        reportMonth = String(fallbackDate.getMonth() + 1).padStart(2, '0'); // يضمن ظهور الشهر بخانتين مثل 06
        reportYear = String(fallbackDate.getFullYear());
        console.log("⚠️ لم يتم العثور على تاريخ تقرير بصيغة صحيحة، تم استخدام تاريخ اليوم كبديل.");
    }

    // صياغة اسم الملف: اسم المرض - الشهر - السنة - اسم المريض
   

    const fullHtmlString = "<!DOCTYPE html>\n" + clone.outerHTML;
    const htmlFileName = `${allData.DiseaseName || "مرض"}_${reportMonth}_${reportYear}_${allData.PatientName || "مريض"}.html`;

   
    // دالة داخلية لإرسال البيانات لـ Google Sheet
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

    // 5. تنفيذ عمليات الحفظ والرفع الفعالة
    if (govSheetId) {
        console.log("بدء الحفظ في ملف المحافظة...");
        await sendToGoogleSheet(govSheetId, "ملف المحافظة");
    }

    if (deptSheetId) {
        console.log("بدء الحفظ في ملف الإدارة...");
        await sendToGoogleSheet(deptSheetId, "ملف الإدارة");
    }

    if (driveFolderId) {
        try {
            console.log("جاري رفع نسخة الـ HTML إلى Google Drive... المجلد المستخدم:", driveFolderId);
            const responseHTML = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ action: "uploadHTML", htmlContent: fullHtmlString, fileName: htmlFileName, folderId: driveFolderId })
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

    // عرض النتيجة النهائية للمستخدم
    alert(summaryMessages.join("\n"));
}
