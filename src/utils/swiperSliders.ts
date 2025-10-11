declare const Swiper: any;

export const swiperSliders = () => {
  const sliderWrapperControllable = document.querySelectorAll('[swiper_slider_controllable]');

  sliderWrapperControllable.forEach((slider) => {
    const swiperEl = slider.querySelector('[swiper]');
    const swiperWrapper = slider.querySelector('[swiper-wrapper]');
    const swiperSlides = slider.querySelectorAll('[swiper-slide]');
    if (!swiperEl) return;
    swiperEl.classList.add('swiper');
    swiperWrapper?.classList.add('swiper-wrapper');
    swiperSlides.forEach((s) => s.classList.add('swiper-slide'));
  });

  const sliderWrapper = document.querySelectorAll('[swiper_slider]');

  sliderWrapper.forEach((slider) => {
    const swiperEl = slider.querySelector('[swiper]');
    const isDefault = swiperEl?.hasAttribute('swiper-default');
    const isAuto = swiperEl?.hasAttribute('swiper-auto');
    const swiperWrapper = slider.querySelector('[swiper-wrapper]');
    const swiperSlides = slider.querySelectorAll('[swiper-slide]');
    const nextEl = slider.querySelector('[swiper-button-next]') ?? null;
    const prevEl = slider.querySelector('[swiper-button-prev]') ?? null;
    console.log('slider', slider);
    console.log('nextEl, prevEl', nextEl, prevEl);
    const isController = swiperEl?.hasAttribute('swiper-controller');

    let swiper = null;

    if (!swiperEl) return;
    swiperEl.classList.add('swiper');
    swiperWrapper?.classList.add('swiper-wrapper');
    swiperSlides.forEach((s) => s.classList.add('swiper-slide'));

    if (isDefault) {
      swiper = new Swiper(swiperEl as HTMLElement, {
        loop: true,
        speed: 1000,
        slidesPerView: 'auto',
        grabCursor: true,
        watchSlidesProgress: true,
        navigation: {
          prevEl: prevEl,
          nextEl: nextEl,
        },
      });
    } else if (isAuto) {
      swiper = new Swiper(swiperEl as HTMLElement, {
        loop: true,
        speed: 1000,
        effect: 'fade',
        fadeEffect: {
          crossFade: true,
        },
        spaceBetween: 0,
        slidersPerView: 'auto',
        autoplay: {
          delay: 1000,
          disableOnInteraction: false,
        },
        grabCursor: false,
        watchSlidesProgress: false,
        navigation: {
          prevEl: prevEl,
          nextEl: nextEl,
        },
      });
    }

    console.log('isController', isController, swiperEl, swiper);

    if (swiper && isController) {
      const controlId = swiperEl.getAttribute('swiper-control-id');
      if (!controlId) return;
      const syncedSwiper = document.querySelector(
        `[swiper-controllable][swiper-control-id="${controlId}"]`
      );
      console.log('syncedSwiper', syncedSwiper);
      if (!syncedSwiper) return;

      const controllableSwiper = new Swiper(syncedSwiper as HTMLElement, {
        loop: true,
        effect: 'fade',
        fadeEffect: {
          crossFade: true,
        },
        slidersPerView: 'auto',
        grabCursor: false,
        watchSlidesProgress: false,
        disableOnInteraction: false,
      });
      swiper.controller.control = controllableSwiper;
    }
  });
};
