console.log("testSheet loaded");

async function testSheet() {

    const response = await fetch(

        "https://script.google.com/macros/s/AKfycbzbasd78UdrLoqpPgvtmBBb3YOX43A0bGcPgORXLRgJYwxX_7oZGZCaDfOppZdRgR9z/exec",

        {
            method: "POST",

            body: JSON.stringify({

                spreadsheetId:
                    "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M",

                sheetName:
                    "TEST",

                data: {

                    CaseID:
                        "123456",

                    PatientName:
                        "Ahmed",

                    DiseaseID:
                        "1",

                    Phone:
                        "01000000000"

                }

            })

        }

    );

    const result =
        await response.json();

    console.log(result);

}
