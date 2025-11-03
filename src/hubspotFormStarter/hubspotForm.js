const PORTAL_ID = 'YOUR_PORTAL_ID';

function getFormData(form) {
  const formData = {};
  const fields = form.querySelectorAll('[data-u-hsform-fieldname]');

  fields.forEach((field) => {
    const fieldName = field.getAttribute('data-u-hsform-fieldname');
    if (!fieldName) return;

    if (field.type === 'checkbox') {
      if (!formData[fieldName]) formData[fieldName] = [];
      if (field.checked) formData[fieldName].push(field.value || 'on');
      return;
    }

    if (field.type === 'radio') {
      if (field.checked) formData[fieldName] = field.value;
      return;
    }

    if (field.tagName.toLowerCase() === 'select' && field.multiple) {
      const values = Array.from(field.selectedOptions).map((o) => o.value);
      formData[fieldName] = values;
      return;
    }

    formData[fieldName] = field.value;
  });

  return formData;
}

async function submitToHubspot(formData, formId) {
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${formId}`;

  const data = {
    fields: Object.entries(formData).flatMap(([name, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => ({ name, value: v }));
      }
      return { name, value };
    }),
    context: {
      pageUri: window.location.href,
      pageName: document.title,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Form submission failed: ${response.status} ${response.statusText} ${text}`);
  }

  return response.json();
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const formId = form.getAttribute('data-u-hsform-id');
  if (!formId) {
    console.error('No FORM_ID found on form (no id or data-u-hsform-id)');
    return;
  }

  const formData = getFormData(form);

  try {
    const json = await submitToHubspot(formData, formId);
    form.reset();
    // alert('Form submitted successfully!');
    console.log('Form submitted successfully:', json);
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('There was an error submitting the form. Please try again.');
  }
}

function initForms() {
  const forms = document.querySelectorAll('form[data-u-hsform-id]');
  forms.forEach((form) => {
    form.addEventListener('submit', handleSubmit);
  });
}

document.addEventListener('DOMContentLoaded', initForms);
