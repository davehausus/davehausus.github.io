"use strict";

(function ($) {
  $(document).ready(function () {
    "use strict"; // PRELOADER — ALWAYS RUN ON HOME, SKIP ELSEWHERE

    (function () {
      var preloader = document.querySelector('.preloader');
      var percentage = document.querySelector('.inner .percentage');
      var body = document.body;
      if (!preloader || !percentage) return; // Check if we're on the home page

      var isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('/'); // If NOT home page, skip preloader entirely

      if (!isHomePage) {
        preloader.style.display = 'none';
        body.classList.remove('page-loading');
        return;
      } // HOME PAGE: Always run preloader (remove sessionStorage check)


      var DURATION = 700;
      var MAX_TIME = 1100;
      var startTime = performance.now();
      var finished = false;
      var currentValue = 0;
      var lastDisplayed = -1;
      body.classList.add('page-loading');
      preloader.classList.remove('page-loaded'); // Set initial value immediately to prevent flash

      percentage.textContent = '0'; // Force layout before animation starts

      preloader.offsetHeight;

      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      }

      function finish() {
        if (finished) return;
        finished = true; // Guard against multiple calls

        if (preloader.classList.contains('page-loaded')) return;
        percentage.textContent = 100;
        preloader.classList.add('page-loaded');
        body.classList.remove('page-loading'); // Wait for CSS transition to complete before display:none

        setTimeout(function () {
          preloader.style.display = 'none'; // Clean up to prevent memory leaks

          preloader.remove();
        }, 500); // Match CSS transition duration (0.4s + buffer)
      }

      function animate(now) {
        if (finished) return;
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / DURATION, 1);
        var eased = easeOutExpo(progress);
        var target = eased * 100; // Smooth step toward target

        currentValue += (target - currentValue) * 0.25; // Clamp + floor for stability

        currentValue = Math.max(0, Math.min(currentValue, 99.5));
        var displayValue = Math.floor(currentValue); // Only update DOM if changed

        if (displayValue !== lastDisplayed) {
          percentage.textContent = displayValue;
          lastDisplayed = displayValue;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          finish();
        }
      } // Start animation


      requestAnimationFrame(animate); // Hard fail-safe: never block page

      setTimeout(finish, MAX_TIME);
    })(); // SWIPER SLIDER - PREVENT LAYOUT SHIFT


    (function () {
      var swiperContainer = document.querySelector('.swiper-container');
      if (!swiperContainer) return; // Set initial heights BEFORE Swiper initializes

      var slides = swiperContainer.querySelectorAll('.swiper-slide');
      slides.forEach(function (slide) {
        slide.style.height = '560px';
      }); // Initialize Swiper

      var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        loop: true,
        autoHeight: false,
        speed: 600,
        // Initialize immediately
        init: true,
        // Preload images
        preloadImages: true,
        updateOnImagesReady: true,
        // Watch for changes
        observer: true,
        observeParents: true,
        autoplay: {
          delay: 5500,
          disableOnInteraction: false,
          waitForTransition: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          renderBullet: function renderBullet(index, className) {
            return '<span class="' + className + '"><svg><circle r="18" cx="20" cy="20"></circle></svg></span>';
          }
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        on: {
          init: function init() {
            // Force reflow to prevent shift
            this.$el[0].offsetHeight;
          }
        }
      }); // Pause on hover

      swiperContainer.addEventListener('mouseenter', function () {
        mySwiper.autoplay.stop();
      });
      swiperContainer.addEventListener('mouseleave', function () {
        mySwiper.autoplay.start();
      });
    })(); // HAMBURGER AUDIO


    var hamburgerMenu = document.getElementById("hamburger-menu");
    var hamburgerAudio = document.getElementById("hamburger-hover");

    if (hamburgerMenu && hamburgerAudio) {
      hamburgerMenu.addEventListener('click', function (e) {
        hamburgerAudio.play();
      });
    } // LOGO RANDOM FADE - Optimized


    (function () {
      var delay = 3000;
      var $logoFigures = $('.logos ul > li figure');
      if ($logoFigures.length === 0) return; // Exit if no logos

      $logoFigures.each(function () {
        var $imgArr = $(this).children();
        $imgArr.eq(Math.floor(Math.random() * $imgArr.length)).show();
      });
      setInterval(changeImage, delay);

      function changeImage() {
        var $liArr = $('.logos ul > li figure');
        var $currLi = $liArr.eq(Math.floor(Math.random() * $liArr.length));
        var $currImg = $('img:visible', $currLi);
        var $next = $currImg.next().length === 1 ? $currImg.next() : $('img:first', $currLi);
        $currImg.fadeOut(1500);
        $next.fadeIn(1500);
      }
    })(); // CONTACT FORM INPUT LABEL - Optimized


    function checkForInput(element) {
      var $label = $(element).siblings('span');
      $label.toggleClass('label-up', $(element).val().length > 0);
    }

    var $formInputs = $('input, textarea');
    $formInputs.each(function () {
      checkForInput(this);
    });
    $formInputs.on('input', function () {
      // Changed from 'change keyup' to 'input'
      checkForInput(this);
    }); // PAGE TRANSITION - Optimized

    $('body a').on('click', function (e) {
      if (typeof $(this).data('fancybox') == 'undefined') {
        e.preventDefault();
        var url = this.getAttribute("href");

        if (url.indexOf('#') != -1) {
          var hash = url.substring(url.indexOf('#'));

          if ($('body ' + hash).length != 0) {
            $('.transition-overlay').removeClass("active");
            $(".hamburger").removeClass("open");
            $("body").removeClass("overflow");
            $(".navigation-menu").removeClass("active");
            $(".navigation-menu .inner ul").css("transition-delay", "0s");
            $(".navigation-menu .inner blockquote").css("transition-delay", "0s");
            $(".navigation-menu .bg-layers span").css("transition-delay", "0.3s");
            $('html, body').animate({
              scrollTop: $(hash).offset().top
            }, 800, 'swing'); // Added easing
          }
        } else {
          $('.transition-overlay').toggleClass("active");
          setTimeout(function () {
            window.location = url;
          }, 600);
        }
      }
    }); // Reset menu and overlay on resize back to desktop

    var resizeTimer;
    var lastWidth = $(window).width();
    $(window).on('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var currentWidth = $(window).width();

        if (currentWidth !== lastWidth) {
          lastWidth = currentWidth;

          if (currentWidth >= 992) {
            $("body").removeClass("overflow");
            $(".navigation-menu").removeClass("active");
            $(".navbar").removeClass("light");
            $(".transition-overlay").removeClass("active");
            TweenMax.set('.burger-svg__bar-1', {
              y: 0,
              rotation: 0,
              scaleX: 1
            });
            TweenMax.set('.burger-svg__bar-2', {
              scaleX: 1,
              opacity: 1
            });
            TweenMax.set('.burger-svg__bar-3', {
              y: 0,
              rotation: 0,
              scaleX: 1
            });
            window._burgerIsOpen = false; // ← now reachable

            window._burgerIsChangingState = false; // ← now reachable
          }
        }
      }, 150);
    }); // Clean up transition-overlay when returning via browser Back

    $(window).on('pageshow', function () {
      $('.transition-overlay').removeClass("active");
    }); // GO TO TOP - Debounced scroll

    var scrollTimer;
    $(window).on('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        $('.gotop').toggleClass('visible', $(window).scrollTop() > 300);
      }, 100);
    });
    $('.gotop').on('click', function (e) {
      e.preventDefault();
      $("html, body").animate({
        scrollTop: 0
      }, 600, 'swing');
    }); // STICKY SIDE LOGO - Throttled

    var lastScroll = 0;
    var ticking = false;
    $(window).on("scroll", function () {
      lastScroll = $(document).scrollTop();

      if (!ticking) {
        window.requestAnimationFrame(function () {
          $('.logo').toggleClass('sticky', lastScroll > 300);
          ticking = false;
        });
        ticking = true;
      }
    }); // HIDE NAVBAR - Throttled

    var navbarTicking = false;
    var lastNavbarScroll = 0;
    $(window).on("scroll", function () {
      lastNavbarScroll = $(document).scrollTop();

      if (!navbarTicking) {
        window.requestAnimationFrame(function () {
          $('.navbar').toggleClass('hide', lastNavbarScroll > 30);
          navbarTicking = false;
        });
        navbarTicking = true;
      }
    }); // DATA BACKGROUND IMAGE

    var $slides = $(".swiper-slide");
    $slides.each(function () {
      var bgUrl = $(this).attr("data-background");

      if (bgUrl) {
        $(this).css("background-image", "url(" + bgUrl + ")");
      }
    }); // HAMBURGER - Already well optimized with GSAP

    window._burgerIsOpen = false;
    window._burgerIsChangingState = false;

    (function () {
      var $burger = $('.burger');
      var $bar1 = $('.burger-svg__bar-1');
      var $bar2 = $('.burger-svg__bar-2');
      var $bar3 = $('.burger-svg__bar-3');
      var burgerTL = new TimelineMax();

      function burgerOver() {
        if (!window._burgerIsChangingState) {
          burgerTL.clear();

          if (!window._burgerIsOpen) {
            burgerTL.to($bar1, 0.5, {
              y: -2,
              ease: Elastic.easeOut
            }).to($bar2, 0.5, {
              scaleX: 0.6,
              ease: Elastic.easeOut,
              transformOrigin: "50% 50%"
            }, "-=0.5").to($bar3, 0.5, {
              y: 2,
              ease: Elastic.easeOut
            }, "-=0.5");
          } else {
            burgerTL.to($bar1, 0.5, {
              scaleX: 1.2,
              ease: Elastic.easeOut
            }).to($bar3, 0.5, {
              scaleX: 1.2,
              ease: Elastic.easeOut
            }, "-=0.5");
          }
        }
      }

      function burgerOut() {
        if (!window._burgerIsChangingState) {
          burgerTL.clear();

          if (!window._burgerIsOpen) {
            burgerTL.to($bar1, 0.5, {
              y: 0,
              ease: Elastic.easeOut
            }).to($bar2, 0.5, {
              scaleX: 1,
              ease: Elastic.easeOut,
              transformOrigin: "50% 50%"
            }, "-=0.5").to($bar3, 0.5, {
              y: 0,
              ease: Elastic.easeOut
            }, "-=0.5");
          } else {
            burgerTL.to($bar1, 0.5, {
              scaleX: 1,
              ease: Elastic.easeOut
            }).to($bar3, 0.5, {
              scaleX: 1,
              ease: Elastic.easeOut
            }, "-=0.5");
          }
        }
      }

      function showCloseBurger() {
        burgerTL.clear();
        burgerTL.to($bar1, 0.3, {
          y: 6,
          ease: Power4.easeIn
        }).to($bar2, 0.3, {
          scaleX: 1,
          ease: Power4.easeIn
        }, "-=0.3").to($bar3, 0.3, {
          y: -6,
          ease: Power4.easeIn
        }, "-=0.3").to($bar1, 0.5, {
          rotation: 45,
          ease: Elastic.easeOut,
          transformOrigin: "50% 50%"
        }).set($bar2, {
          opacity: 0,
          immediateRender: false
        }, "-=0.5").to($bar3, 0.5, {
          rotation: -45,
          ease: Elastic.easeOut,
          transformOrigin: "50% 50%",
          onComplete: function onComplete() {
            window._burgerIsChangingState = false;
            window._burgerIsOpen = true;
          }
        }, "-=0.5");
      }

      function showOpenBurger() {
        burgerTL.clear();
        burgerTL.to($bar1, 0.3, {
          scaleX: 0,
          ease: Back.easeIn
        }).to($bar3, 0.3, {
          scaleX: 0,
          ease: Back.easeIn
        }, "-=0.3").set($bar1, {
          rotation: 0,
          y: 0
        }).set($bar2, {
          scaleX: 0,
          opacity: 1
        }).set($bar3, {
          rotation: 0,
          y: 0
        }).to($bar2, 0.5, {
          scaleX: 1,
          ease: Elastic.easeOut
        }).to($bar1, 0.5, {
          scaleX: 1,
          ease: Elastic.easeOut
        }, "-=0.4").to($bar3, 0.5, {
          scaleX: 1,
          ease: Elastic.easeOut,
          onComplete: function onComplete() {
            window._burgerIsChangingState = false;
            window._burgerIsOpen = false;
          }
        }, "-=0.5");
      }

      $burger.on('click', function (e) {
        $("body").toggleClass("overflow");
        $(".navigation-menu").toggleClass("active");
        $(".navbar").toggleClass("light");

        if (!window._burgerIsOpen) {
          $(".navbar").removeClass("hide");
        }

        if (!window._burgerIsChangingState) {
          window._burgerIsChangingState = true;

          if (!window._burgerIsOpen) {
            showCloseBurger();
          } else {
            showOpenBurger();
          }
        }
      });
      $burger.hover(burgerOver, burgerOut);
    })(); // MASONRY - Optimized with imagesLoaded


    var $container = $('.works ul');

    if ($container.length) {
      $container.imagesLoaded(function () {
        $container.isotope({
          itemSelector: '.works ul li',
          layoutMode: 'masonry',
          transitionDuration: '0.6s'
        });
      });
    }
  }); // SCROLL BG COLOR - Throttled with RAF

  var colorTicking = false;
  var $body = $('body');
  var $panels = $('section, footer, header');
  $(window).on('scroll', function () {
    if (!colorTicking) {
      window.requestAnimationFrame(function () {
        updateBackgroundColor();
        colorTicking = false;
      });
      colorTicking = true;
    }
  });

  function updateBackgroundColor() {
    var scroll = $(window).scrollTop() + $(window).height() / 3;
    $panels.each(function () {
      var $this = $(this);
      var top = $this.position().top;
      var bottom = top + $this.height();

      if (top <= scroll && bottom > scroll) {
        var newColor = 'color-' + $(this).data('color');

        if (!$body.hasClass(newColor)) {
          $body.removeClass(function (index, css) {
            return (css.match(/(^|\s)color-\S+/g) || []).join(' ');
          });
          $body.addClass(newColor);
        }

        return false; // Break loop once found
      }
    });
  } // Initial call


  updateBackgroundColor(); // WOW ANIMATION 

  wow = new WOW({
    animateClass: 'animated',
    offset: 50,
    mobile: false // Disable on mobile for better performance

  });
  wow.init(); // VIDEO OVERLAY 

  $('.video').parent().on('click', function () {
    var video = $(this).children(".video").get(0);
    var $playpause = $(this).children(".playpause");

    if (video.paused) {
      video.play();
      $playpause.fadeOut(300);
    } else {
      video.pause();
      $playpause.fadeIn(300);
    }
  }); // COUNTER - Optimized with Intersection Observer

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var $odometer = $(entry.target);

          if ($odometer.data('status') == 'yes') {
            $odometer.html($odometer.data('count'));
            $odometer.data('status', 'no');
            counterObserver.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    });
    $('.odometer').each(function () {
      counterObserver.observe(this);
    });
  } else {
    // Fallback for older browsers
    $(document).on('scroll', function () {
      $('.odometer').each(function () {
        var parent_section_position = $(this).closest('section').position();
        var parent_section_top = parent_section_position.top;

        if ($(document).scrollTop() > parent_section_top - 300) {
          if ($(this).data('status') == 'yes') {
            $(this).html($(this).data('count'));
            $(this).data('status', 'no');
          }
        }
      });
    });
  }
})(jQuery);