// تحميل الإعدادات
function loadSettings() {

    

    const settings =
        JSON.parse(
            chrome.storage.local.getItem("settings")
        ) || {};

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
function saveSettings() {

 

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

    chrome.storage.local.setItem(
        "settings",
        JSON.stringify(settings)
    );

    alert(
        "تم حفظ الإعدادات بنجاح"
    );
}


// بعد تحميل الصفحة
document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSettings();

        document
            .getElementById("saveButton")
            .addEventListener(
                "click",
                saveSettings
            );

    }
);
