// saveHtml.js
console.log("saveHtml loaded");
async function saveHtml() {

    const data =
        await collectAllData();

    let html = `

<!DOCTYPE html>

<html dir="rtl">

<head>

<meta charset="utf-8">

<title>
${document.title}
</title>

<style>

body{

font-family:tahoma;

padding:20px;

}

table{

width:100%;

border-collapse:collapse;

}

td{

border:1px solid #ddd;

padding:8px;

}

</style>

</head>

<body>

<h2>

${document.title}

</h2>

<table>

`;

    for (const key in data) {

        html += `

<tr>

<td>
${key}
</td>

<td>
${data[key]}
</td>

</tr>

`;

    }

    html += `

</table>

</body>

</html>

`;

    const blob =
        new Blob(
            [html],
            {
                type:
                    "text/html"
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

    a.href =
        url;

    a.download =
        document.title +
        ".html";

    a.click();

    URL.revokeObjectURL(
        url
    );

}
