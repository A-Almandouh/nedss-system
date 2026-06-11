console.log("splitData loaded");

function splitData(allData) {

    //------------------------------------
    // الحقول العامة التى ستذهب إلى G-Data
    //------------------------------------

    const GENERAL_FIELDS = [

        "CaseID",
        "DiseaseID",

        "PatientName",

        "FirstName",
        "FatherName",
        "GrandFatherName",
        "FamilyName",

        "NationalID",
        "Age",
        "Gender",

        "Phone",

        "ReportingGov",
        "ReportingDistrict",
        "ReportingAdministration",

        "ResidenceGovernorate",
        "ResidenceDistrict",

        "NotificationDate",
        "ReportDate",

        "HospitalName",
        "Address"

    ];

    //------------------------------------
    // إنشاء generalData
    //------------------------------------

    const generalData = {};

    GENERAL_FIELDS.forEach(key => {

        if (allData[key] !== undefined) {

            generalData[key] = allData[key];

        }

    });

    //------------------------------------
    // diseaseData = كل البيانات
    //------------------------------------

    const diseaseData = {

        ...allData

    };

    //------------------------------------

    return {

        generalData,
        diseaseData

    };

}
