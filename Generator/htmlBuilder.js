function buildTemplate(
    fields
){

    let html =
`
<form id="investigationForm">

`;

    fields.forEach(
        field=>{

            html +=

`
<div class="row g-0 mb-2">

<div class="col-9">

<label>

${field.label}

</label>

</div>

<div class="col-3">

`;

            //--------------------------------
            // text
            //--------------------------------

            if(
                field.type
                ==
                "text"
            ){

                html +=

`
<input
type="text"
class="form-control"
id="${field.name}">
`;

            }

            //--------------------------------
            // select
            //--------------------------------

            else{

                html +=

`
<select
class="form-select"
id="${field.name}">

<option></option>

</select>
`;

            }

            html +=

`
</div>

</div>

`;

        }

    );

    html +=

`

</form>

`;

    return html;

}