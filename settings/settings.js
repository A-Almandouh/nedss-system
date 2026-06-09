alert("تمت القراءة")
```javascript
// تحميل الإعدادات
async function loadSettings() {
alert("تم تحميسل الاعدادات")
    const result =
        await chrome.storage.local.get(
            "settings"
        );

    const settings =
        result.settings || {};

    // switches
    document.getElementById("autoSearch").checked =
        settings.autoSearch || false;

    document.getElementById("mergeTabs").checked =
        settings.mergeTabs || false;

    document.getElementById("highlightMissing").checked =
        settings.highlightMissing || false;

    document.getElementById("completionPercentage").checked =
        settings.completionPercentage || false;

    document.getElementById("menLab").checked =
        settings.menLab || false;

    document.getElementById("savePdf").checked =
        settings.savePdf || false;

    document.getElementById("updateCases").checked =
        settings.updateCases || false;

    document.getElementById("saveExtraQuestions").checked =
        settings.saveExtraQuestions || false;

    document.getElementById("openGov").checked =
        settings.openGov || false;

    document.getElementById("showLinks").checked =
        settings.showLinks || false;

    document.getElementById("showCasesCount").checked =
        settings.showCasesCount || false;

    document.getElementById("customScripts").checked =
        settings.customScripts || false;

    // text boxes

    document.getElementById("departmentSheet").value =
        settings.departmentSheet || "";

    document.getElementById("governorateSheet").value =
        settings.governorateSheet || "";

    document.getElementById("pdfFolder").value =
        settings.pdfFolder || "";

    document.getElementById("excludedDiseases").value =
        settings.excludedDiseases || "";

    document.getElementById("excludedStatus").value =
        settings.excludedStatus || "";

    document.getElementById("customCode").value =
        settings.customCode || "";

}



// حفظ الإعدادات
async function saveSettings() {
alert("تم الدخول للحفظ ")
    const settings = {

        autoSearch:
            document.getElementById("autoSearch").checked,

        mergeTabs:
            document.getElementById("mergeTabs").checked,

        highlightMissing:
            document.getElementById("highlightMissing").checked,

        completionPercentage:
            document.getElementById("completionPercentage").checked,

        menLab:
            document.getElementById("menLab").checked,

        savePdf:
            document.getElementById("savePdf").checked,

        updateCases:
            document.getElementById("updateCases").checked,

        saveExtraQuestions:
            document.getElementById("saveExtraQuestions").checked,

        openGov:
            document.getElementById("openGov").checked,

        showLinks:
            document.getElementById("showLinks").checked,

        showCasesCount:
            document.getElementById("showCasesCount").checked,

        customScripts:
            document.getElementById("customScripts").checked,

        departmentSheet:
            document.getElementById("departmentSheet").value.trim(),

        governorateSheet:
            document.getElementById("governorateSheet").value.trim(),

        pdfFolder:
            document.getElementById("pdfFolder").value.trim(),

        excludedDiseases:
            document.getElementById("excludedDiseases").value.trim(),

        excludedStatus:
            document.getElementById("excludedStatus").value.trim(),

        customCode:
            document.getElementById("customCode").value

    };

    await chrome.storage.local.set({
        settings
    });

    alert(
        "تم حفظ الإعدادات بنجاح"
    );

}



// زر الحفظ
document
    .getElementById("saveButton")
    .addEventListener(
        "click",
        saveSettings
    );


// تحميل الصفحة
loadSettings();
```
