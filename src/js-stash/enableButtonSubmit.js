const enableButtonSubmit = () => {
  document.querySelectorAll('a[submit], a[button-function="submit"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const form = el.closest('form');
      if (form) {
        form.requestSubmit ? form.requestSubmit() : form.submit();
      }
    });
  });
};
