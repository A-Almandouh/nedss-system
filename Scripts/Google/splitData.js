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
        "geType",
        "Sex",
        "MaritalStatus",
        "Phone",

        "ReportingGov",
        "ReportingDistrict",
        "ReportingAdministration",
        "IsolationPlace",
         "NotificationDate",
        "ReportDate",

        "ResidenceGovernorate",
        "ResidenceDistrict",
        "ResidenceAdministration",
        "Address"

        "DiseaseName",
        "OnsetDate",
        "",
        "OutCome",
        "FinalDiagnosis",
        "Occupation","OccupationOther","School","EducationLevel","EducationClasification"
		
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
