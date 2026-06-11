// saveCsv.js

console.log("saveCsv loaded");

// اختبار عند تحميل الملف
try {

    const testData = collectAllData();

    console.log("TEST collectAllData =", testData);

}
catch (err) {

    console.error(
        "TEST ERROR",
        err
    );

}

async function saveCsv() {

    try {

        console.log(
            "saveCsv started"
        );

        // جمع البيانات
        const data =
            await collectAllData();

        console.log(
            "DATA =",
            data
        );

        // فحص البيانات
        if (!data) {

            console.error(
                "DATA IS NULL"
            );

            alert(
                "لا توجد بيانات"
            );

            return;

        }

        console.log(
            "DATA TYPE =",
            typeof data
        );

        console.log(
            "KEYS =",
            Object.keys(data)
        );

        console.log(
            "VALUES =",
            Object.values(data)
        );

        if (
            Object.keys(data).length === 0
        ) {

            alert(
                "البيانات فارغة"
            );

            return;

        }

        // رؤوس الأعمدة
        const headers =
            Object.keys(data);

        // القيم
        const values =
            Object.values(data);

        // معالجة النصوص
        const escapeCsv =
            value => {

                const str =
                    String(
                        value ?? ""
                    );

                return (
                    '"' +
                    str.replace(
                        /"/g,
                        '""'
                    ) +
                    '"'
                );

            };

        // إنشاء CSV
        const csv =
            "\uFEFF" +
            headers
                .map(
                    escapeCsv
                )
                .join(",") +
            "\r\n" +
            values
                .map(
                    escapeCsv
                )
                .join(",");

        console.log(
            "CSV CONTENT:"
        );

        console.log(
            csv
        );

        // إنشاء الملف
        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8"
                }
            );

        console.log(
            "BLOB SIZE =",
            blob.size
        );

        const url =
            URL.createObjectURL(
                blob
            );

        const a =
            document.createElement(
                "a"
            );

        a.href = url;

        a.download =
            (
                data.PatientName ||
                data.CaseID ||
                "Case"
            ) +
            ".csv";

        document.body.appendChild(
            a
        );

        a.click();

        a.remove();

        setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );

        console.log(
            "CSV SAVED"
        );

    }
    catch (err) {

        console.error(
            "saveCsv ERROR",
            err
        );

        alert(
            err.message
        );

    }

}
