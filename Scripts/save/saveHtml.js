// saveHtml.js
console.log("saveHtml loaded");
async function saveHtml() {
    // نسخة من الصفحة
    const clone = document.documentElement.cloneNode(true);

    // حفظ قيم input
    document.querySelectorAll("input").forEach((input, index) => {

        const clonedInput = clone.querySelectorAll("input")[index];
        if (!clonedInput) return;

        if (input.type === "checkbox" || input.type === "radio") {

            if (input.checked) {
                clonedInput.setAttribute("checked", "checked");
            } else {
                clonedInput.removeAttribute("checked");
            }

        } else {

            clonedInput.setAttribute("value", input.value);
        }
    });

    // حفظ قيم textarea
    document.querySelectorAll("textarea").forEach((textarea, index) => {

        const clonedTextarea =
            clone.querySelectorAll("textarea")[index];

        if (!clonedTextarea) return;

        clonedTextarea.textContent =
            textarea.value;
    });

    // حفظ القوائم المنسدلة
    document.querySelectorAll("select").forEach((select, index) => {

        const clonedSelect =
            clone.querySelectorAll("select")[index];

        if (!clonedSelect) return;

        [...clonedSelect.options].forEach(option => {
            option.removeAttribute("selected");
        });

        const selectedOption =
            clonedSelect.options[select.selectedIndex];

        if (selectedOption) {
            selectedOption.setAttribute(
                "selected",
                "selected"
            );
        }
    });

    const html =
        "<!DOCTYPE html>\n" +
        clone.outerHTML;

    const blob =
        new Blob(
            [html],
            {
                type: "text/html;charset=utf-8"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        (document.title || "Case") + ".html";

    document.body.appendChild(a);

    a.click();

    a.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}
