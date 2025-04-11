document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('brandForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // отменяем стандартную отправку

        const isValid = await validateForm();

        if (isValid) {
            form.submit(); // если всё прошло — отправляем вручную
        }
    });
});

async function validateForm() {
    const brandNameInput = document.getElementById('BrandName');
    const errorSpan = document.getElementById('brandNameError');
    const errorSummary = document.getElementById('errorSummary');
    const form = document.getElementById('brandForm');
    const idInput = form.querySelector('input[name="Id"]');

    errorSpan.textContent = '';
    errorSummary.textContent = '';

    const brandName = brandNameInput.value.trim();

    if (brandName.length === 0) {
        errorSpan.textContent = 'Бренд гитары не заполнен';
        errorSummary.textContent = 'Пожалуйста, исправьте ошибки в форме.';
        return false;
    }

    if (brandName.length > 50) {
        errorSpan.textContent = 'Название бренда не должно превышать 50 символов';
        errorSummary.textContent = 'Пожалуйста, исправьте ошибки в форме.';
        return false;
    }

    const response = await fetch(`/Admin/CheckBrandName?brandName=${encodeURIComponent(brandName)}&id=${idInput.value}`);
    const isUnique = await response.json();

    if (!isUnique) {
        errorSpan.textContent = 'Такой бренд уже существует';
        errorSummary.textContent = 'Пожалуйста, исправьте ошибки в форме.';
        return false;
    }

    return true;
}
