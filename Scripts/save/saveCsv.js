// saveCsv.js

console.log("saveCsv loaded");

async function saveCsv() {

    try {

        console.log("saveCsv started");

        const data =
            await collectAllData();

        console.log("DATA =", data);

        if (
            !data ||
            Object.keys(data).length === 0
        ) {

            alert("لا توجد بيانات");

            return;
        }

        const headers =
            Object.keys(data);

        const values =
            Object.values(data);

        const escapeCsv =
            value => {

                const str =
                    String(value ?? "");

                return '"' +
                    str.replace(
                        /"/g,
                        '""'
                    ) +
                    '"';

            };

        const csv =
            "\uFEFF" +
            headers
                .map(escapeCsv)
                .join(",") +
            "\r\n" +
            values
                .map(escapeCsv)
                .join(",");

        const blob =
            new Blob(
                [csv],
                {
                    type:
                    "text/csv;charset=utf-8"
                }
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

        // اسم الملف
        const diseaseId =
            data.DiseaseID ||
            "UnknownDisease";

        const caseId =
            data.CaseID ||
            "UnknownCase";

        a.download =
            `${diseaseId} - ${caseId}.csv`;

        document.body.appendChild(
            a
        );

        a.click();

        a.remove();

        setTimeout(() => {

            URL.revokeObjectURL(
                url
            );

        }, 1000);

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
