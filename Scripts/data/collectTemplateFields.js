// collectTemplateFields.js

function collectTemplateFields() {

    const form =
        document.getElementById(
            "investigationForm"
        );

    if (!form) {

        return {};

    }

    const data = {};

    const fields =
        form.querySelectorAll(
            "input, select, textarea"
        );

    fields.forEach(field => {

        const key =
            field.name ||
            field.id;

        if (!key)
            return;

        //----------------------------------
        // Radio
        //----------------------------------

        if (
            field.type === "radio"
        ) {

            if (
                field.checked
            ) {

                data[key] =
                    field.value;

            }

            return;

        }

        //----------------------------------
        // Checkbox
        //----------------------------------

        if (
            field.type === "checkbox"
        ) {

            data[key] =
                field.checked;

            return;

        }

        //----------------------------------
        // Select
        //----------------------------------

        if (
            field.tagName ===
            "SELECT"
        ) {

            data[key] =
                field.options[
                    field.selectedIndex
                ]?.text || "";

            return;

        }

        //----------------------------------
        // Input/Textarea
        //----------------------------------

        data[key] =
            (
                field.value || ""
            ).trim();

    });

    console.log(
        "Template Data",
        data
    );

    return data;

}


console.log(
    "Template Fields:",
    collectTemplateFields()
);

function collectTemplateFields() {

    const data = {};

    document
        .querySelectorAll(
            "#investigationForm input, #investigationForm select, #investigationForm textarea"
        )
        .forEach(el => {

            data[
                el.id || el.name
            ] = el.value;

        });

    console.log(
        "Template Fields",
        data
    );

    return data;

}
