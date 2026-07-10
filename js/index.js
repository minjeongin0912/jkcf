// ==================== HEADER ====================
document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector(".site-header");
  const dropdownItems = document.querySelectorAll(".site-nav__item--has-dropdown");
  const siteNav = document.querySelector(".site-nav");
  const menuButton = document.querySelector(".site-header__menu-button");
  const menuCloseButton = document.querySelector(".mobile-nav__close");
  const mobileToggleButtons = document.querySelectorAll(".site-nav__toggle");
  const mobileShareButton = document.querySelector(".mobile-nav__share");
  const mobileMediaQuery = window.matchMedia("(max-width: 1024px)");

  const syncHeaderState = () => {
    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle("is-scrolled", window.scrollY > 10);
    siteHeader.classList.toggle("is-menu-active", Boolean(siteNav && siteNav.classList.contains("is-open")));
  };

  dropdownItems.forEach((item) => {
    const trigger = item.querySelector(".site-nav__link");
    const dropdown = item.querySelector(".site-nav__dropdown");

    if (!trigger || !dropdown) {
      return;
    }

    const setOpen = (isOpen) => {
      if (mobileMediaQuery.matches) {
        item.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", String(item.classList.contains("is-mobile-open")));
        dropdown.setAttribute("aria-hidden", String(!item.classList.contains("is-mobile-open")));
        return;
      }

      item.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      dropdown.setAttribute("aria-hidden", String(!isOpen));
    };

    item.addEventListener("mouseenter", () => setOpen(true));
    item.addEventListener("mouseleave", () => setOpen(false));
    item.addEventListener("focusin", () => setOpen(true));
    item.addEventListener("focusout", (event) => {
      if (!item.contains(event.relatedTarget)) {
        setOpen(false);
      }
    });
  });

  const setMenuOpen = (isOpen) => {
    if (!siteNav || !menuButton) {
      return;
    }

    siteNav.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    document.body.classList.toggle("is-menu-open", isOpen);
    syncHeaderState();

    if (!isOpen) {
      setLanguageMenuOpen(false);
    }
  };

  const syncNavigationMode = () => {
    const isMobile = mobileMediaQuery.matches;

    if (!siteNav) {
      return;
    }

    siteNav.setAttribute("aria-hidden", String(isMobile && !siteNav.classList.contains("is-open")));

    dropdownItems.forEach((item, index) => {
      const trigger = item.querySelector(".site-nav__link");
      const dropdown = item.querySelector(".site-nav__dropdown");
      const toggle = item.querySelector(".site-nav__toggle");

      if (!trigger || !dropdown) {
        return;
      }

      if (isMobile) {
        if (!siteNav.dataset.mobileReady && index === 0) {
          item.classList.add("is-mobile-open");
        }

        const isOpen = item.classList.contains("is-mobile-open");

        trigger.setAttribute("aria-expanded", String(isOpen));
        dropdown.setAttribute("aria-hidden", String(!isOpen));

        if (toggle) {
          toggle.setAttribute("aria-expanded", String(isOpen));
          const icon = toggle.querySelector("i");

          if (icon) {
            icon.classList.toggle("fa-chevron-down", isOpen);
            icon.classList.toggle("fa-chevron-right", !isOpen);
          }
        }

        item.classList.remove("is-open");
      } else {
        item.classList.remove("is-mobile-open");
        trigger.setAttribute("aria-expanded", "false");
        dropdown.setAttribute("aria-hidden", "true");

        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
        }
      }
    });

    if (isMobile) {
      siteNav.dataset.mobileReady = "true";
    } else {
      delete siteNav.dataset.mobileReady;
    }
  };

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        setMenuOpen(!isOpen);
        syncNavigationMode();
    });

    if (menuCloseButton) {
      menuCloseButton.addEventListener("click", () => {
        setMenuOpen(false);
        syncNavigationMode();
      });
    }

    mobileToggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".site-nav__item--has-dropdown");

        if (!item || !mobileMediaQuery.matches) {
          return;
        }

        const shouldOpen = !item.classList.contains("is-mobile-open");

        dropdownItems.forEach((dropdownItem) => {
          dropdownItem.classList.remove("is-mobile-open");
        });

        item.classList.toggle("is-mobile-open", shouldOpen);
        syncNavigationMode();
      });
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a") && !event.target.closest(".mobile-nav__action") && mobileMediaQuery.matches) {
        setMenuOpen(false);
        syncNavigationMode();
      }
    });

    mobileMediaQuery.addEventListener("change", () => {
      setMenuOpen(false);
      syncNavigationMode();
    });
  }

// ==================== LANGUAGE ====================
  const languageSwitcher = document.querySelector(".language-switcher");
  const languageButton = document.querySelector(".language-switcher__button");
  const languageMenu = document.querySelector(".language-switcher__menu");
  const languageCurrent = document.querySelector(".language-switcher__current");
  const languageOptions = document.querySelectorAll("[data-lang-option]");
  const storageKey = "jkcf-language";

  const availableLanguages = ["ja", "ko"];

  const setLanguageMenuOpen = (isOpen) => {
    if (!languageSwitcher || !languageButton || !languageMenu) {
      return;
    }

    languageSwitcher.classList.toggle("is-open", isOpen);
    languageButton.setAttribute("aria-expanded", String(isOpen));
    languageMenu.setAttribute("aria-hidden", String(!isOpen));
  };

  const applyLanguage = (language) => {
    const currentLanguage = availableLanguages.includes(language) ? language : "ja";

    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-ja][data-ko]").forEach((item) => {
      const text = item.dataset[currentLanguage];

      if (text) {
        item.replaceChildren(...text.split("\n").flatMap((line, index) => {
          const nodes = [];

          if (index > 0) {
            nodes.push(document.createElement("br"));
          }

          nodes.push(document.createTextNode(line));
          return nodes;
        }));
      }
    });

    document.querySelectorAll("[data-aria-ja][data-aria-ko]").forEach((item) => {
      const ariaLabel = item.dataset[`aria${currentLanguage === "ko" ? "Ko" : "Ja"}`];

      if (ariaLabel) {
        item.setAttribute("aria-label", ariaLabel);
      }
    });

    const footerSecondary = document.querySelector("[data-footer-secondary]");

    if (footerSecondary) {
      footerSecondary.querySelectorAll("[data-ja][data-ko]").forEach((item) => {
        const footerText = item.dataset[currentLanguage];

        if (footerText) {
          item.textContent = footerText;
        }
      });
    }

    if (languageCurrent) {
      languageCurrent.textContent = currentLanguage === "ko" ? "한국어" : "日本語";
    }

    languageOptions.forEach((option) => {
      const isCurrent = option.dataset.langOption === currentLanguage;
      option.setAttribute("aria-current", String(isCurrent));
    });

    localStorage.setItem(storageKey, currentLanguage);
  };

  if (languageButton && languageMenu) {
    languageButton.addEventListener("click", () => {
      const isOpen = languageButton.getAttribute("aria-expanded") === "true";
      setLanguageMenuOpen(!isOpen);
    });

    languageOptions.forEach((option) => {
      option.addEventListener("click", () => {
        applyLanguage(option.dataset.langOption);
        setLanguageMenuOpen(false);
      });
    });

    document.addEventListener("click", (event) => {
      if (languageSwitcher && !languageSwitcher.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setLanguageMenuOpen(false);
        setMenuOpen(false);
        syncNavigationMode();
      }
    });
  }

  if (mobileShareButton) {
    mobileShareButton.addEventListener("click", async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: document.title,
            url: window.location.href,
          });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
        }
      } catch (error) {
        return;
      }
    });
  }

// ==================== VISUAL ====================
  const heroSlides = document.querySelectorAll("[data-hero-slide]");
  const heroDots = document.querySelectorAll("[data-hero-dot]");
  const heroIntervalTime = 5000;
  let heroCurrentIndex = 0;
  let heroTimerId = null;

  const showHeroSlide = (nextIndex) => {
    if (!heroSlides.length || !heroDots.length) {
      return;
    }

    heroCurrentIndex = (nextIndex + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, index) => {
      const isActive = index === heroCurrentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    heroDots.forEach((dot, index) => {
      const isActive = index === heroCurrentIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });
  };

  const startHeroAutoPlay = () => {
    if (heroTimerId || heroSlides.length <= 1) {
      return;
    }

    heroTimerId = window.setInterval(() => {
      showHeroSlide(heroCurrentIndex + 1);
    }, heroIntervalTime);
  };

  const resetHeroAutoPlay = () => {
    if (heroTimerId) {
      window.clearInterval(heroTimerId);
      heroTimerId = null;
    }

    startHeroAutoPlay();
  };

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showHeroSlide(index);
      resetHeroAutoPlay();
    });
  });

  showHeroSlide(0);
  startHeroAutoPlay();

// ==================== SECTION 01 ====================
  const activitiesSection = document.querySelector(".activities-section");

  if (activitiesSection) {
    if ("IntersectionObserver" in window) {
      const activitiesObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.18,
      });

      activitiesObserver.observe(activitiesSection);
    } else {
      activitiesSection.classList.add("is-visible");
    }
  }

// ==================== SECTION 02 ====================
  const newsSection = document.querySelector(".news-section");

  if (newsSection) {
    if ("IntersectionObserver" in window) {
      const newsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.15,
      });

      newsObserver.observe(newsSection);
    } else {
      newsSection.classList.add("is-visible");
    }
  }

// ==================== SECTION 03 ====================
  const reportSection = document.querySelector(".report-section");
  const reportTrack = document.querySelector("[data-report-track]");
  const reportDots = document.querySelectorAll("[data-report-dot]");
  const reportPrev = document.querySelector("[data-report-prev]");
  const reportNext = document.querySelector("[data-report-next]");

  if (reportSection) {
    if ("IntersectionObserver" in window) {
      const reportObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.15,
      });

      reportObserver.observe(reportSection);
    } else {
      reportSection.classList.add("is-visible");
    }
  }

  if (reportTrack && reportDots.length) {
    const reportCards = Array.from(reportTrack.querySelectorAll(".report-card"));
    const reportTotal = reportCards.length;
    let reportCurrent = 0;
    let reportLocked = false;

    // 무한 루프용 카드 클론 추가
    reportCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      reportTrack.appendChild(clone);
    });

    const calcOffset = (index) => {
      const gap = parseFloat(getComputedStyle(reportTrack).columnGap) || 24;
      return index * (reportCards[0].getBoundingClientRect().width + gap);
    };

    const updateReportDots = () => {
      const active = reportCurrent % reportTotal;
      reportDots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === active);
        dot.setAttribute("aria-current", String(i === active));
      });
    };

    const setPos = (index, animated) => {
      reportCurrent = index;
      if (!animated) {
        reportTrack.style.transition = "none";
        void reportTrack.offsetWidth;
      }
      reportTrack.style.transform = `translateX(-${calcOffset(reportCurrent)}px)`;
      if (!animated) {
        requestAnimationFrame(() => {
          reportTrack.style.transition = "transform 0.4s ease";
        });
      }
      updateReportDots();
    };

    // 클론 영역에 닿으면 실제 위치로 순간 복귀
    reportTrack.addEventListener("transitionend", () => {
      reportLocked = false;
      if (reportCurrent >= reportTotal) {
        setPos(reportCurrent - reportTotal, false);
      }
    });

    const goTo = (index) => {
      if (reportLocked) return;
      reportLocked = true;
      setPos(index, true);
    };

    if (reportNext) {
      reportNext.addEventListener("click", () => goTo(reportCurrent + 1));
    }

    if (reportPrev) {
      reportPrev.addEventListener("click", () => {
        if (reportLocked) return;
        if (reportCurrent <= 0) {
          // 클론 끝으로 순간 이동 후 역방향 애니메이션
          setPos(reportTotal, false);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => goTo(reportTotal - 1));
          });
        } else {
          goTo(reportCurrent - 1);
        }
      });
    }

    reportDots.forEach((dot, index) => {
      dot.addEventListener("click", () => goTo(index));
    });

    window.addEventListener("resize", () => {
      setPos(reportCurrent % reportTotal, false);
    }, { passive: true });

    setPos(0, false);
    if (reportPrev) reportPrev.disabled = false;
    if (reportNext) reportNext.disabled = false;
  }

// ==================== YOUTUBE ====================
  const youtubeCards = document.querySelectorAll("[data-youtube-card]");
  const youtubeDots = document.querySelectorAll("[data-youtube-dot]");
  const youtubePrev = document.querySelector("[data-youtube-prev]");
  const youtubeNext = document.querySelector("[data-youtube-next]");
  let youtubeCurrent = 0;

  const getYoutubeId = (url) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.replace("/", "");
      }

      return parsedUrl.searchParams.get("v") || "";
    } catch (error) {
      return "";
    }
  };

  const stopYoutubePlayers = () => {
    youtubeCards.forEach((card) => {
      const link = card.querySelector(".youtube-card__link");
      const iframe = card.querySelector(".youtube-card__iframe");

      if (iframe) {
        iframe.remove();
      }

      if (link) {
        link.classList.remove("is-playing");
      }
    });
  };

  const updateYoutubeCarousel = (nextIndex) => {
    youtubeCurrent = (nextIndex + youtubeCards.length) % youtubeCards.length;

    youtubeCards.forEach((card, index) => {
      let position = (index - youtubeCurrent + youtubeCards.length) % youtubeCards.length;

      if (position > Math.floor(youtubeCards.length / 2)) {
        position -= youtubeCards.length;
      }

      const isActive = position === 0;
      const link = card.querySelector(".youtube-card__link");

      card.dataset.position = String(position);
      card.classList.toggle("is-active", isActive);
      card.classList.add("is-visible");

      if (link) {
        link.tabIndex = isActive ? 0 : -1;
      }
    });

    youtubeDots.forEach((dot, index) => {
      const isActive = index === youtubeCurrent;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });
  };

  const showYoutubeSlide = (nextIndex) => {
    if (!youtubeCards.length) {
      return;
    }

    const normalizedIndex = (nextIndex + youtubeCards.length) % youtubeCards.length;

    if (normalizedIndex !== youtubeCurrent) {
      stopYoutubePlayers();
    }

    updateYoutubeCarousel(normalizedIndex);
  };

  if (youtubeCards.length) {
    youtubeCards.forEach((card, index) => {
      const link = card.querySelector(".youtube-card__link");

      if (!link) {
        return;
      }

      link.addEventListener("click", (event) => {
        event.preventDefault();

        if (!card.classList.contains("is-active")) {
          showYoutubeSlide(index);
          return;
        }

        const videoId = getYoutubeId(link.dataset.youtubeUrl || "");

        if (!videoId || link.classList.contains("is-playing")) {
          return;
        }

        stopYoutubePlayers();
        link.classList.add("is-playing");

        const iframe = document.createElement("iframe");
        iframe.className = "youtube-card__iframe";
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.title = "YouTube video player";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;

        link.appendChild(iframe);
      });
    });

    if (youtubePrev) {
      youtubePrev.addEventListener("click", () => {
        showYoutubeSlide(youtubeCurrent - 1);
      });
    }

    if (youtubeNext) {
      youtubeNext.addEventListener("click", () => {
        showYoutubeSlide(youtubeCurrent + 1);
      });
    }

    youtubeDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        if (index === youtubeCurrent) {
          return;
        }

        showYoutubeSlide(index);
      });
    });

    updateYoutubeCarousel(0);
  }

  syncNavigationMode();
  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
  applyLanguage(localStorage.getItem(storageKey) || "ja");
});

// ==================== SECTION 01 ====================

// ==================== SECTION 02 ====================

// ==================== SECTION 03 ====================

// ==================== SECTION 04 ====================
  const storiesSection = document.querySelector(".stories-section");

  if (storiesSection) {
    if ("IntersectionObserver" in window) {
      const storiesObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.15,
      });

      storiesObserver.observe(storiesSection);
    } else {
      storiesSection.classList.add("is-visible");
    }
  }

// ==================== SECTION 05 ====================
  const ctaBlocks = document.querySelectorAll(".cta-block");

  if (ctaBlocks.length) {
    if ("IntersectionObserver" in window) {
      const ctaObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.22,
      });

      ctaBlocks.forEach((block) => {
        ctaObserver.observe(block);
      });
    } else {
      ctaBlocks.forEach((block) => {
        block.classList.add("is-visible");
      });
    }
  }

// ==================== RESPONSIVE ====================

// ==================== GO TO TOP ====================
const goToTopButton = document.querySelector("[data-go-to-top]");

if (goToTopButton) {
  const syncGoToTopState = () => {
    const isVisible = window.scrollY > 500;
    goToTopButton.classList.toggle("is-visible", isVisible);
    goToTopButton.setAttribute("aria-hidden", String(!isVisible));
    goToTopButton.tabIndex = isVisible ? 0 : -1;
  };

  goToTopButton.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", syncGoToTopState, { passive: true });
  syncGoToTopState();
}
