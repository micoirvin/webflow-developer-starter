const modals = () => {
  const modalButtons = document.querySelectorAll(
    '[button-function="modal-open"]'
  );
  modalButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const type = button.getAttribute('modal-type');
      const name = button.getAttribute('modal-name');
      const modal = document.querySelector(
        `[modal][modal-type=${type}][modal-name=${name}]`
      );
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
