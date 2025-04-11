document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isValid = await validateGuitarForm();
        if (isValid) form.submit();
    });
});

async function validateGuitarForm() {
    const brandSelect = document.querySelector('[name="GuitarBrandId"]');
    const modelInput = document.querySelector('[name="GuitarModel"]');
    const typeSelect = document.querySelector('[name="GuitarType"]');
    const yearInput = document.querySelector('[name="GuitarYear"]');
    const priceInput = document.querySelector('[name="GuitarPrice"]');
    const idInput = document.querySelector('[name="Id"]');

    let isValid = true;
    clearErrors();

    const brandId = brandSelect.value.trim();
    const model = modelInput.value.trim();
    const type = typeSelect.value;
    const year = parseInt(yearInput.value, 10);
    const price = parseFloat(priceInput.value);

    if (!brandId) {
        showError(brandSelect, 'Бренд гитары не выбран');
        isValid = false;
    }

    if (!model) {
        showError(modelInput, 'Модель гитары не указана');
        isValid = false;
    } else if (model.length > 50) {
        showError(modelInput, 'Название модели не должно превышать 50 символов');
        isValid = false;
    }

    if (!type) {
        showError(typeSelect, 'Тип гитары не выбран');
        isValid = false;
    }

    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        showError(yearInput, 'Год выпуска должен быть от 1900 до ' + new Date().getFullYear());
        isValid = false;
    }

    if (isNaN(price) || price < 0) {
        showError(priceInput, 'Цена гитары должна быть положительной');
        isValid = false;
    }

    // Проверка дубликата
    if (isValid) {
        const res = await fetch(`/Admin/CheckGuitarDuplicate?brandId=${brandId}&model=${encodeURIComponent(model)}&id=${idInput.value}`);
        const isDuplicate = !(await res.json());
        if (isDuplicate) {
            showError(modelInput, 'Такая гитара уже существует');
            isValid = false;
        }
    }

    return isValid;
}
function showError(input, message) {
    const fieldName = input.getAttribute('name');
    const validationSpan = document.querySelector(`span[data-valmsg-for="${fieldName}"]`);

    if (validationSpan) {
        validationSpan.textContent = message;
        validationSpan.classList.add('text-danger');
    }
}


function clearErrors() {
    document.querySelectorAll('span.text-danger').forEach(span => {
        span.textContent = '';
    });
}
