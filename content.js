
console.log("pathname =", location.pathname);

if (
    location.pathname.includes("Ext_") ||
    location.pathname.includes("AddNewRes.aspx")
) {
    console.log("CALLING RUN()");
    run();
}
else {
    console.log("PAGE NOT MATCHED");
}


async function getSettings() {

    const settings =
        JSON.parse(
            localStorage.getItem("settings")
        ) || {};

    return settings;
}

chrome.runtime.onMessage.addListener((request) => {

    console.log(
        "message received",
        request
    );

    if (request.action === "run") {
        run();
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
     console.log("RUN STARTED");
    console.log(
        "PAGE URL",
        location.href
    );

    // =====================================
    // EXTERNAL PAGE
    // =====================================

    if (
        location.pathname.includes("Ext_")
         ||
        location.pathname.includes("AddNewRes.aspx")
    ) {

        console.log(
            "EXTERNAL PAGE DETECTED"
        );

        try {

            const diseaseId =
                sessionStorage.getItem(
                    "DiseaseID"
                );

            console.log(
                "DiseaseID",
                diseaseId
            );

            const diseaseData =
                await extractDiseaseData(
                    diseaseId
                );

            console.log(
                "EXTERNAL DATA",
                diseaseData
            );

            const generalData =
                JSON.parse(
                    sessionStorage.getItem(
                        "generalData"
                    ) || "{}"
                );

            console.log(
                "GENERAL DATA",
                generalData
            );

            const merged = {
                ...generalData,
                ...diseaseData
            };

            console.log(
                "MERGED DATA",
                merged
            );

            openTemplate(
                merged
            );

        } catch (err) {

            console.error(
                "EXTERNAL ERROR",
                err
            );
        }

        return;
    }

    // =====================================
    // GENERAL PAGE
    // =====================================

    try {

        console.log(
            "run started"
        );

        const generalData =
            await extractData();

        console.log(
            "GENERAL DATA",
            generalData
        );

        const diseaseId =
            generalData.DiseaseID;
        console.log(
            "DiseaseID before routing =",
            generalData.DiseaseID
        );
        const route =
            await getDiseaseRoute(
                diseaseId,
                generalData.CaseID
            );

        console.log(
            "ROUTE",
            route
        );

        // ============================
        // LINK MODE
        // ============================

        if (
            route.mode === "link"
        ) {

            console.log(
                "LINK MODE"
            );

            const link =
                document.querySelector(
                    "a.NavLink"
                );

            if (!link) {

                throw new Error(
                    "NavLink not found"
                );
            }

            link.click();

            await sleep(3000);

            const diseaseData =
                await extractDiseaseData(
                    diseaseId
                );

            const merged = {
                ...generalData,
                ...diseaseData
            };

            openTemplate(
                merged
            );

            return;
        }

        // ============================
        // EXTERNAL MODE
        // ============================

        if (
            route.mode === "external"
        ) {

            console.log(
                "EXTERNAL MODE"
            );

            sessionStorage.setItem(
                "generalData",
                JSON.stringify(
                    generalData
                )
            );

            sessionStorage.setItem(
                "DiseaseID",
                diseaseId
            );

            console.log(
                "GENERAL DATA SAVED"
            );

            console.log(
                "REDIRECT TO",
                route.finalUrl
            );

            location.href =
                route.finalUrl;

            return;
        }

        // ============================
        // GENERAL MODE
        // ============================

        if (
            route.mode === "general"
        ) {

            console.log(
                "GENERAL MODE"
            );

            openTemplate(
                generalData
            );

            return;
        }

        throw new Error(
            "Unknown mode: " +
            route.mode
        );

    } catch (err) {

        console.error(
            err
        );

        alert(
            err.message
        );
    }
}

// =====================================
// AUTO RUN FOR ANY EXTERNAL PAGE
// =====================================

if (
    location.pathname.includes(
        "Ext_"
    )
) {

    console.log(
        "AUTO RUN EXTERNAL"
    );

    run();
}

// =====================================
// OPEN TEMPLATE
// =====================================

function openTemplate(data) {

    const diseaseId = data.DiseaseID;
    console.log(
    "DiseaseID in openTemplate =",
    diseaseId
    );
    const templateUrl =
        `https://a-almandouh.github.io/nedss-system/Templates/${diseaseId}.html`;

    console.log(
        "OPEN TEMPLATE",
        templateUrl
    );

    const win = window.open(
        templateUrl,
        "_blank"
    );

    if (!win) {

        alert("Popup blocked");

        return;
    }

    setTimeout(() => {

        win.postMessage({

            type: "FILL_DATA",
            data

        }, "*");

    }, 2000);
}

(async function () {

    const result = await chrome.storage.local.get("settings");
    const settings = result.settings || {};

    if (settings.autoSearch) {
        autoSearch();
    }

    if (settings.mergeTabs) {
        mergeTabs();
    }

    if (settings.highlightMissing) {
        highlightMissing();
    }

    if (settings.showLinks) {
        showLinks();
    }

    if (settings.menLab) {
        menLab();
    }

    if (settings.completionPercentage) {
        completionPercentage();
    }

})();

// فتح المحافظة فى ADI 
const GOVSELECT = document.getElementById("ContentPlaceHolder1_ddlGov");
 if (GOVSELECT) { GOVSELECT.disabled = false; }