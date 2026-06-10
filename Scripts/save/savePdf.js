// savePdf.js
console.log("savePDF loaded");
async function savePdf() {

    const element =
        document.body;

    const options = {

        margin: 0.5,

        filename:
            document.title +
            ".pdf",

        image: {

            type: "jpeg",

            quality: 1

        },

        html2canvas: {

            scale: 2

        },

        jsPDF: {

            unit: "in",

            format: "a4",

            orientation:
                "portrait"

        }

    };

    html2pdf()

        .set(
            options
        )

        .from(
            element
        )

        .save();

}
