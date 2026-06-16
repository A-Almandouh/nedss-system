document
.getElementById(
    "btnGenerate"
)
.onclick =
function(){

    const html =
        document
        .getElementById(
            "sourceHtml"
        )
        .value;

    const fields =
        buildJson(
            html
        );

    document
    .getElementById(
        "jsonResult"
    )
    .value =
        JSON.stringify(
            fields,
            null,
            4
        );

    document
    .getElementById(
        "templateResult"
    )
    .value =
        buildTemplate(
            fields
        );

};