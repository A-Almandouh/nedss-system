console.log("saveDepartmentSheet loaded - Version 9 - Fixed");

async function saveDepartmentSheet() {
    let govSheetId = "";
    let deptSheetId = "";
    let driveFolderId = "";

    // 1. قراءة الإعدادات من ذاكرة الإضافة
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        console.log("🔍 قراءة الإعدادات...");
        const settings = (await chrome.storage.local.get("settings")).settings || {};
        govSheetId = settings.governorateSheet || "";
        deptSheetId = settings.departmentSheet || "";
        driveFolderId = settings.driveFolderId || "";

        console.log("📊 [GovernorateSheet]", govSheetId || "غير موجود");
        console.log("📊 [DepartmentSheet]", deptSheetId || "غير موجود");
        console.log("📊 [DriveFolder]", driveFolderId || "غير موجود");
    }

    // 2. جلب البيانات الأساسية (تم تقديمها هنا لتجنب أخطاء الاستدعاء)
    const allData = await collectAllData();
    const result = splitData(allData);

    // 3. تطبيق القيم الافتراضية الذكية بناءً على المنطقة في حال نقص الإعدادات
    if (!govSheetId || !deptSheetId || !driveFolderId) {
        const district = (allData.ResidenceDistrict || "").trim();
        console.log("📍 ResidenceDistrict =", district);

        switch (district) {
            case "الحمام":
                govSheetId = govSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                deptSheetId = deptSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = driveFolderId || "1GRuw0fNeOZNFE-NrP014rNmDuUhrySnW";
                break;
            case "العلمين":
                govSheetId = govSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                deptSheetId = deptSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = driveFolderId || "1KSG4-Q754StABwYqh8NxuAGh5zG2GpM0";
                break;
            case "الضبعه":
                govSheetId = govSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                deptSheetId = deptSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = driveFolderId || "1NVwy8oujcRiCaWLWrSA5EmaKinUpt0wX";
                break;
            case "مطروح":
                govSheetId = govSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                deptSheetId = deptSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = driveFolderId || "1POq1hlYgjh0BWus7Wgv4DwtPo896hOuy";
                break;
            case "النجيليه":
                govSheetId = govSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                deptSheetId = deptSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = driveFolderId || "1RcKYywc6GSQ6kna6gp5O4rcg2xxeeMIV";
                break;
            case "بسيدى برانى":
                govSheetId = govSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                deptSheetId = deptSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = driveFolderId || "1U7J2ZgXSQjWIeGfsDIQHtgP5Ga4Oje32";
                break;
            case "السلوم":
                govSheetId = govSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                deptSheetId = deptSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = driveFolderId || "1XJw4uTc2IyxLl3UDBHn9DM4zgW28WWNn";
                break;
            case "سيوة":
                govSheetId = govSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                deptSheetId = deptSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = driveFolderId || "1ZmRwdWHzuE-eHq1uZcka0aiQ3HIIBHus";
                break;
            default:
                govSheetId = govSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                deptSheetId = deptSheetId || "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";
                driveFolderId = driveFolderId || "1OImES8vUr4D_qyG3G1KLAgvkPNcOHVCb";
                break;
        }
    }

    console.log("📊 Final GovernorateSheet =", govSheetId);
    console.log("📊 Final DepartmentSheet =", deptSheetId);
    console.log("📊 Final DriveFolder =", driveFolderId);

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
       // استخراج الشهر والسنة من تاريخ التقرير المتاح في البيانات
    const reportDateRaw = allData.ReportDate || "";
    let reportMonth = "";
    let reportYear = "";
consol.log( allData.ReportDate)
    if (reportDateRaw) {
        const parsedDate = new Date(reportDateRaw);
        // التحقق من أن التاريخ صالح وليس نصاً عشوائياً
        if (!isNaN(parsedDate.getTime())) {
            reportMonth = parsedDate.getMonth() + 1; // إضافة 1 لأن الشهور تبدأ من 0
            reportYear = parsedDate.getFullYear();
        }
    }

    // في حال عدم العثور على تاريخ تقرير صالح، يتم استخدام تاريخ اليوم كخيار احتياطي بديل
    if (!reportMonth || !reportYear) {
        const fallbackDate = new Date();
        reportMonth = fallbackDate.getMonth() + 1;
        reportYear = fallbackDate.getFullYear();
        console.log("⚠️ لم يتم العثور على تاريخ تقرير صالح، تم استخدام تاريخ اليوم كبديل.");
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
