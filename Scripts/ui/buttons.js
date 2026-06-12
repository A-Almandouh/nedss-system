function createToolbar() {
  console.log("createToolbar called");
    if (
        document.getElementById(
            "nedss-toolbar"
        )
    ) {
        return;
    }

    const toolbar =
        document.createElement(
            "div"
        );

    toolbar.id =
        "nedss-toolbar";

    toolbar.className =
        "no-print";

    toolbar.innerHTML = `

<button id="btnPrint">
🖨 طباعة
</button>

<button id="btnHtml">
💾 HTML
</button>

<button id="btnCsv">
📊 CSV
</button>

<button id="btnSave">
☁ حفظ البيانات
</button>

<button id="btnDepartment">
🏥 شيت الإدارة
</button>

<button id="btnGovernorate">
🏢 شيت المحافظة
</button>

<button id="btnUpdate">
🔄 تحديث
</button>

`;

    document.body.prepend(
        toolbar
    );

    //----------------------------------
    // تنسيق الأزرار
    //----------------------------------

    Object.assign(
    toolbar.style,
    {
        position: "sticky",
        top: "0",
        zIndex: "9999",
        background: "#ffffff",
        padding: "10px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    }
);

toolbar.classList.add("no-print");

if (!document.getElementById("nedss-print-style")) {

    const style =
        document.createElement("style");

    style.id =
        "nedss-print-style";

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

toolbar
    .querySelectorAll("button")
    .forEach(btn => {

        Object.assign(
            btn.style,
            {
                border: "0",
                padding: "8px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#0d6efd",
                color: "white"
            }
        );

    });    //----------------------------------
    // طباعة
    //----------------------------------

    document
        .getElementById(
            "btnPrint"
        )
        .onclick = () => {

            window.print();

        };

       //----------------------------------
    // HTML
    //----------------------------------

    document
        .getElementById(
            "btnHtml"
        )
        .onclick = () => {

            if (
                typeof saveHtml ===
                "function"
            ) {

                saveHtml();

            }

        };

     //-----------------------------
    //csv
    //-----------------------
    document
    .getElementById("btnCsv")
    .onclick =
    () => {

        if (
            typeof saveCsv ===
            "function"
        ) {

            saveCsv();

        }
        else {

            alert(
                "saveCsv غير موجود"
            );

        }

    };
    
//---------------------------حفظ اون لاين  جوجل شيت -------------

  const btnSave =
    document.getElementById(
        "btnSave"
    );

if (btnSave) {

    btnSave.onclick = () => {

        if (
            typeof saveToSheet ===
            "function"
        ) {

            saveToSheet();

        }

    };

}
  

    //----------------------------------
    // شيت الإدارة
    //----------------------------------

    document
        .getElementById(
            "btnDepartment"
        )
        .onclick = () => {

            if (
                typeof saveDepartmentSheet ===
                "function"
            ) {

                saveDepartmentSheet();

            }

        };

    //----------------------------------
    // شيت المحافظة
    //----------------------------------

    document
        .getElementById(
            "btnGovernorate"
        )
        .onclick = () => {

            if (
                typeof saveGovernorateSheet ===
                "function"
            ) {

                saveGovernorateSheet();

            }

        };

    //----------------------------------
    // تحديث
    //----------------------------------

    document
        .getElementById(
            "btnUpdate"
        )
        .onclick = () => {

            if (
                typeof updateCase ===
                "function"
            ) {

                updateCase();

            }

        };

}

createToolbar()
