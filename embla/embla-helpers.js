// Browser-compatible Embla carousel helpers
(function() {
  'use strict';

  // Arrow button handlers
  const addTogglePrevNextBtnsActive = (emblaApi, prevBtn, nextBtn) => {
    const togglePrevNextBtnsState = () => {
      if (emblaApi.canScrollPrev()) prevBtn.removeAttribute('disabled')
      else prevBtn.setAttribute('disabled', 'disabled')

      if (emblaApi.canScrollNext()) nextBtn.removeAttribute('disabled')
      else nextBtn.setAttribute('disabled', 'disabled')
    }

    emblaApi
      .on('select', togglePrevNextBtnsState)
      .on('init', togglePrevNextBtnsState)
      .on('reInit', togglePrevNextBtnsState)

    return () => {
      prevBtn.removeAttribute('disabled')
      nextBtn.removeAttribute('disabled')
    }
  }

  const addPrevNextBtnsClickHandlers = (emblaApi, prevBtn, nextBtn) => {
    const scrollPrev = () => {
      emblaApi.scrollPrev()
    }
    const scrollNext = () => {
      emblaApi.scrollNext()
    }
    prevBtn.addEventListener('click', scrollPrev, false)
    nextBtn.addEventListener('click', scrollNext, false)

    const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
      emblaApi,
      prevBtn,
      nextBtn
    )

    return () => {
      removeTogglePrevNextBtnsActive()
      prevBtn.removeEventListener('click', scrollPrev, false)
      nextBtn.removeEventListener('click', scrollNext, false)
    }
  }

  // Autoscroll functionality
  const addAutoScroll = (emblaApi, options = {}) => {
    const { 
      delay = 4000, 
      stopOnInteraction = false,
      stopOnMouseEnter = true,
      stopOnFocusIn = true 
    } = options;
    
    let autoScrollTimer = null;
    let isAutoScrolling = false;

    const startAutoScroll = () => {
      if (isAutoScrolling) return;
      isAutoScrolling = true;
      autoScrollTimer = setInterval(() => {
        emblaApi.scrollNext();
      }, delay);
    };

    const stopAutoScroll = () => {
      if (!isAutoScrolling) return;
      isAutoScrolling = false;
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    };

    const resetAutoScroll = () => {
      stopAutoScroll();
      setTimeout(startAutoScroll, 100);
    };

    // Initialize autoscroll after embla is initialized
    emblaApi.on('init', () => {
      startAutoScroll();
    });

    return {
      start: startAutoScroll,
      stop: stopAutoScroll,
      reset: resetAutoScroll,
      isPlaying: () => isAutoScrolling
    };
  };

  // Expose to global scope
  window.EmblaHelpers = {
    addPrevNextBtnsClickHandlers,
    addAutoScroll
  };
})();
