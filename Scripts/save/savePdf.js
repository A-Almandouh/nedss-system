// savePdf.js

async function savePdf() {

    const clone =
        document.documentElement.cloneNode(true);

    // input
    document.querySelectorAll("input").forEach((input, index) => {

        const clonedInput =
            clone.querySelectorAll("input")[index];

        if (!clonedInput) return;

        if (
            input.type === "checkbox" ||
            input.type === "radio"
        ) {

            clonedInput.checked =
                input.checked;

        } else {

            clonedInput.value =
                input.value;

            clonedInput.setAttribute(
                "value",
                input.value
            );
        }
    });

    // textarea
    document.querySelectorAll("textarea").forEach((textarea, index) => {

        const clonedTextarea =
            clone.querySelectorAll("textarea")[index];

        if (!clonedTextarea) return;

        clonedTextarea.value =
            textarea.value;

        clonedTextarea.textContent =
            textarea.value;
    });

    // select
    document.querySelectorAll("select").forEach((select, index) => {

        const clonedSelect =
            clone.querySelectorAll("select")[index];

        if (!clonedSelect) return;

        clonedSelect.value =
            select.value;

        [...clonedSelect.options].forEach(option =>
            option.removeAttribute("selected")
        );

        const selected =
            clonedSelect.querySelector(
                `option[value="${select.value}"]`
            );

        if (selected) {

            selected.setAttribute(
                "selected",
                "selected"
            );
        }
    });

    const container =
        document.createElement("div");

    container.appendChild(clone);

    const options = {

        margin: 0.3,

        filename:
            document.title + ".pdf",

        image: {
            type: "jpeg",
            quality: 1
        },

        html2canvas: {
            scale: 2,
            useCORS: true
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        }
    };

    await html2pdf()
        .set(options)
        .from(container)
        .save();
}
