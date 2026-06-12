console.log("testSheet loaded");

async function testSheet() {

    const body = {

        spreadsheetId:
            "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M",

        sheetName:
            "G-Data",

        data: {

            CaseID: "TEST-001",

            PatientName: "أحمد حمدى",

            DiseaseID: "1",

            Phone: "01000000000"

        }

    };

    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyawpMOpj-ubnIivLU1E4jt1T6azDQwL0dPVZhEp3iP30nngvtR0sD5RH3sqNL3HWcz/exec",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
    );

    const result = await response.text();

    console.log(result);

}
