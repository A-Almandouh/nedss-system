const data = await collectAllData();

console.log("CSV DATA", data);
async function saveCsv() {

    try {

        const data =
            collectAllData();

        if (!data) {

            alert(
                "لا توجد بيانات"
            );

            return;
        }

        const headers =
            Object.keys(data);

        const values =
            Object.values(data);

        const escapeCsv =
            value => {

                const str =
                    String(
                        value ?? ""
                    );

                return '"' +
                    str.replace(
                        /"/g,
                        '""'
                    ) +
                    '"';

            };

        const csv =
            "\uFEFF" +
            headers.map(
                escapeCsv
            ).join(",") +
            "\r\n" +
            values.map(
                escapeCsv
            ).join(",");

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

    }
    catch (err) {

        console.error(
            err
        );

        alert(
            err.message
        );

    }

}
