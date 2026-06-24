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

  const languageSwitcher = document.querySelector(".language-switcher");
  const languageButton = document.querySelector(".language-switcher__button");
  const languageMenu = document.querySelector(".language-switcher__menu");
  const languageCurrent = document.querySelector(".language-switcher__current");
  const languageOptions = document.querySelectorAll("[data-lang-option]");
  const translatableItems = document.querySelectorAll("[data-ja][data-ko]");
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

  const syncHeaderState = () => {
    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle("is-scrolled", window.scrollY > 10);
    siteHeader.classList.toggle("is-menu-active", Boolean(siteNav && siteNav.classList.contains("is-open")));
  };

  const setMenuOpen = (isOpen) => {
    if (!siteNav || !menuButton) {
      return;
    }

    siteNav.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "\u30e1\u30cb\u30e5\u30fc\u3092\u9589\u3058\u308b" : "\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f");
    document.body.classList.toggle("is-menu-open", isOpen);

    if (!isOpen) {
      setLanguageMenuOpen(false);
    }

    syncHeaderState();
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

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
      syncNavigationMode();
    });
  }

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

  if (siteNav) {
    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a") && !event.target.closest(".mobile-nav__action") && mobileMediaQuery.matches) {
        setMenuOpen(false);
        syncNavigationMode();
      }
    });
  }

  mobileMediaQuery.addEventListener("change", () => {
    setMenuOpen(false);
    syncNavigationMode();
  });

// ==================== LANGUAGE ====================
  const applyLanguage = (language) => {
    const currentLanguage = availableLanguages.includes(language) ? language : "ja";

    document.documentElement.lang = currentLanguage;

    translatableItems.forEach((item) => {
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

    if (languageCurrent) {
      languageCurrent.textContent = currentLanguage === "ko" ? "\ud55c\uad6d\uc5b4" : "\u65e5\u672c\u8a9e";
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
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setLanguageMenuOpen(false);
      setMenuOpen(false);
      syncNavigationMode();
    }
  });

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

// ==================== SUBPAGE ====================
  syncNavigationMode();
  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
  applyLanguage(localStorage.getItem(storageKey) || "ja");
});

// ==================== RESPONSIVE ====================
