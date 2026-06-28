function createToolbar() {
    console.log("createToolbar called");
    if (document.getElementById("nedss-toolbar")) {
        return;
    }

    const toolbar = document.createElement("div");
    toolbar.id = "nedss-toolbar";
    toolbar.className = "no-print";

    toolbar.innerHTML = `
        <button id="btnPrint">🖨 طباعة</button>
        <button id="btnHtml">💾 HTML</button>
        <button id="btnCsv">📊 CSV</button>
        <button id="btnSave">☁ حفظ البيانات On-Line</button>
    `;

    document.body.prepend(toolbar);

    //----------------------------------
    // تنسيق الأزرار
    //----------------------------------
    Object.assign(toolbar.style, {
        position: "sticky",
        top: "0",
        zIndex: "9999",
        background: "#ffffff",
        padding: "10px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    });

    if (!document.getElementById("nedss-print-style")) {
        const style = document.createElement("style");
        style.id = "nedss-print-style";
        style.textContent = `
            @media print {
                #nedss-toolbar,
                .no-print {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    toolbar.querySelectorAll("button").forEach(btn => {
        Object.assign(btn.style, {
            border: "0",
            padding: "8px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#0d6efd",
            color: "white"
        });
    });

    //----------------------------------
    // حدث الطباعة
    //----------------------------------
    document.getElementById("btnPrint").onclick = () => {
        window.print();
    };

    //----------------------------------
    // حدث الـ HTML
    //----------------------------------
    document.getElementById("btnHtml").onclick = () => {
        if (typeof saveHtml === "function") {
            saveHtml();
        }
    };

    //-----------------------------
    // حدث الـ CSV
    //-----------------------
    document.getElementById("btnCsv").onclick = () => {
        if (typeof saveCsv === "function") {
            saveCsv();
        } else {
            alert("saveCsv غير موجود");
        }
    };
    
        //-------------------------------------------------
    // 💡 حدث حفظ أون لاين (مع إضافة تنبيهات الفحص)
    //-------------------------------------------------
    const btnSave = document.getElementById("btnSave");
    if (btnSave) {
        btnSave.onclick = () => {
            alert("1. تم الضغط على زر الحفظ بنجاح!");
            
            if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get("settings", function(data) {
                    const currentSettings = data.settings || {};
                    
                    // تنبيه يوضح محتوى الذاكرة المجلوبة بالكامل
                    alert("2. محتوى الذاكرة المجلوب من داخل التولبار:\n" + JSON.stringify(currentSettings));
                    
                    if (typeof saveToSheet === "function") {
                        saveToSheet(currentSettings);
                    } else if (typeof saveDepartmentSheet === "function") {
                        saveDepartmentSheet(currentSettings);
                    } else {
                        alert("🚨 خطأ: دالة الحفظ غير متوفرة في هذه الصفحة!");
                    }
                });
            } else {
                alert("⚠️ تنبيه: بيئة chrome.storage غير متاحة في مكان تشغيل التولبار!");
                if (typeof saveToSheet === "function") saveToSheet();
            }
        };
   

createToolbar();
