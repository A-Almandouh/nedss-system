function buildJson(
    html
){

    const parser =
        new DOMParser();

    const doc =
        parser.parseFromString(
            html,
            "text/html"
        );

    const fields =
        [];

    //------------------------------------
    // INPUT
    //------------------------------------

    doc
    .querySelectorAll(
        "input[type=text]"
    )
    .forEach(
        input=>{

            let label =
                "";

            const td =
                input.closest(
                    "td"
                );

            if(
                td &&
                td.previousElementSibling
            ){

                label =
                    td.previousElementSibling
                    .innerText
                    .trim();

            }

            fields.push({

                type:
                    "text",

                name:
                    input.id,

                label:
                    label

            });

        }
    );

    //------------------------------------
    // SELECT
    //------------------------------------

    doc
    .querySelectorAll(
        "select"
    )
    .forEach(
        select=>{

            let label =
                "";

            const td =
                select.closest(
                    "td"
                );

            if(
                td &&
                td.previousElementSibling
            ){

                label =
                    td.previousElementSibling
                    .innerText
                    .trim();

            }

            fields.push({

                type:
                    "select",

                name:
                    select.id,

                label:
                    label

            });

        }
    );

    return fields;

}