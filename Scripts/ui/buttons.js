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

    // تنسيق الأزرار
    Object.assign(toolbar.style, {
        position: "sticky", top: "0", zIndex: "9999", background: "#ffffff",
        padding: "10px", borderBottom: "1px solid #ddd", display: "flex", gap: "10px", flexWrap: "wrap"
    });

    if (!document.getElementById("nedss-print-style")) {
        const style = document.createElement("style");
        style.id = "nedss-print-style";
        style.textContent = `@media print { #nedss-toolbar, .no-print { display: none !important; } }`;
        document.head.appendChild(style);
    }

    toolbar.querySelectorAll("button").forEach(btn => {
        Object.assign(btn.style, {
            border: "0", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", background: "#0d6efd", color: "white"
        });
    });

    document.getElementById("btnPrint").onclick = () => { window.print(); };
    document.getElementById("btnHtml").onclick = () => { if (typeof saveHtml === "function") saveHtml(); };
    document.getElementById("btnCsv").onclick = () => { if (typeof saveCsv === "function") saveCsv(); };
    
    // حدث الحفظ المحدث والمبسط
    const btnSave = document.getElementById("btnSave");
    if (btnSave) {
        btnSave.onclick = () => {
            console.log("☁ بدء الحفظ أونلاين بالإعدادات العابرة للحدود:", window.globalAppSettings);
            if (typeof saveToSheet === "function") {
                saveToSheet(window.globalAppSettings);
            }
        };
    }
}

createToolbar();
