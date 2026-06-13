console.log("saveDepartmentSheet loaded");

async function saveDepartmentSheet() {
    const spreadsheetId = "1g8NVjns3UNfURYebKkMBI33XB4BJUnDZJ3I6372J64M";

    const allData = await collectAllData();
    const result = splitData(allData);

    // الرابط الخاص بك من واقع رسالة الخطأ
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzbasd78UdrLoqpPgvtmBBb3YOX43A0bGcPgORXLRgJYwxX_7oZGZCaDfOppZdRgR9z/exec";

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "cors", // تفعيل وضع كورس
            headers: {
                // تغيير النوع إلى text/plain يتخطى حظر الـ CORS في جوجل سكريبت
                "Content-Type": "text/plain;charset=utf-8" 
            },
            body: JSON.stringify({
                spreadsheetId: spreadsheetId,
                sheetName: "G-Data",
                data: result.generalData
            })
        });

        const json = await response.json();
        console.log("تم الحفظ بنجاح:", json);
        
    } catch (error) {
        console.error("حدث خطأ أثناء حفظ البيانات:", error);
    }
}
