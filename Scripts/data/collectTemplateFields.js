// collectTemplateFields.js
console.log("collectTemplateFields loaded");

/**
 * دالة جمع بيانات النموذج
 * تقوم باستخراج البيانات من كافة الحقول مع مراعاة أنواعها (Checkbox, Radio, Select)
 */
function collectTemplateFields() {
    const form = document.getElementById("investigationForm");
    
    // إذا لم يتم العثور على النموذج، نرجع كائناً فارغاً
    if (!form) {
        console.warn("Form #investigationForm not found!");
        return {};
    }

    const data = {};
    const fields = form.querySelectorAll("input, select, textarea");

    fields.forEach(field => {
        const key = field.name || field.id;
        if (!key) return;

        // 1. التعامل مع Radio Buttons
        if (field.type === "radio") {
            if (field.checked) {
                data[key] = field.value;
            }
            // ملاحظة: إذا لم يكن محدداً، لن نضعه في الـ data أو نتركه كما هو
            return;
        }

        // 2. التعامل مع Checkboxes (هذا هو التصحيح الذي كنت تحتاجه)
        if (field.type === "checkbox") {
            // سيعيد true إذا تم اختياره، و false إذا لم يتم
            data[key] = field.checked;
            return;
        }

        // 3. التعامل مع القوائم المنسدلة (Select)
        if (field.tagName === "SELECT") {
            data[key] = field.options[field.selectedIndex]?.text || "";
            return;
        }

        // 4. التعامل مع حقول النص (Text, Number, Date, Textarea)
        data[key] = (field.value || "").trim();
    });

    console.log("Template Data Collected Successfully:", data);
    return data;
}

// تنفيذ أولي للتأكد من عمل الكود
console.log("Template Fields Initial Collection:", collectTemplateFields());
