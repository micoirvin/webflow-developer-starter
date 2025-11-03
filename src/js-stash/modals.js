const modals = () => {
  const modalButtons = document.querySelectorAll('[button-function="modal-open"]');
  modalButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      let type = button.getAttribute('modal-type');
      if (!type) type = button.getAttribute('button-function-arg1');
      let name = button.getAttribute('modal-name');
      if (!name) name = button.getAttribute('button-function-arg2');

      const modal = document.querySelector(`[modal][modal-type=${type}][modal-name=${name}]`);
      modal?.setAttribute('is-open', '');
    });
  });

  const modalCloseButtons = document.querySelectorAll('[modal-close]');
  modalCloseButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      button.closest('[modal]')?.removeAttribute('is-open');
    });
  });
};

modals();

document.addEventListener('DOMContentLoaded', () => {});
