const accordion = () => {
  const accordions = document.querySelectorAll('[accordion-element="root"]');

  accordions.forEach((accordion) => {
    const mq = accordion.getAttribute('accordion-mq') || null;
    const mqs = {
      'mob-l': '(max-width: 767px)',
    };
    if (mq) {
      const mediaQuery = window.matchMedia(mqs[mq]);
      if (!mediaQuery.matches) {
        return;
      }
    }

    const accordionItems = accordion.querySelectorAll('[accordion-element="box"]');

    accordionItems.forEach((item, index) => {
      const header = item.querySelector('[accordion-element="header"]');
      const contentWrapper = item.querySelector('[accordion-element="content-wrap"]');
      contentWrapper.style.maxHeight = '0px';

      /*
       ** Set accessibility
       */
      let accordionId = `accordion-${index}`;
      let accordionTargetId = `accordion-target-${index}`;

      // Trigger
      header.id = accordionId;
      header.setAttribute('aria-controls', accordionTargetId);

      // Target
      contentWrapper.id = accordionTargetId;
      contentWrapper.setAttribute('labelledby', accordionId);

      header.addEventListener('click', (e) => {
        e.preventDefault();
        const contentWrapperHeight = contentWrapper.querySelector(
          '[accordion-element="content"]'
        ).offsetHeight;
        toggleAccordion(item, header, contentWrapper, contentWrapperHeight);
      });
    });

    function toggleAccordion(item, header, contentWrapper, height) {
      // Close all other accordion items first
      accordions.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.setAttribute('aria-expanded', 'false');
          otherItem.setAttribute('accordion-state', '');
          const otherContent = item.querySelector('[accordion-element="content-wrapper"]');
          if (otherContent) {
            otherContent.style.maxHeight = '0px';
          }
        }
      });

      // Toggle the clicked item
      let ariaExpanded = header.getAttribute('aria-expanded');
      ariaExpanded = ariaExpanded === 'true' ? 'false' : 'true';
      header.setAttribute('aria-expanded', ariaExpanded);
      item.setAttribute(
        'accordion-state',
        item.getAttribute('accordion-state') === 'expanded' ? '' : 'expanded'
      );
      if (contentWrapper) {
        contentWrapper.style.maxHeight =
          contentWrapper.style.maxHeight === '0px' ? `${height + 9 * 14}px` : '0px';
      }
    }
  });
};

accordion();
