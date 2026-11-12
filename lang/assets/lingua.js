/* ==========================================================================
   Lingua Antiqua — shared site script
   --------------------------------------------------------------------------
   Renders the navigation, breadcrumb, footer, and hub pages from one manifest
   (SITE, below), handles the light/dark theme, and exposes a few utilities
   to the study applications as window.Lingua.

   To add an application: create its HTML page, then add one entry to the
   matching section's `apps` array in SITE. Navigation, the section hub, and
   the breadcrumb pick it up automatically.

   Page contract (set on <body>):
     data-page="home"                       the front page
     data-page="section" data-section="id"  a language hub
     data-section="id" data-app="id"        a study application
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Manifest
     ------------------------------------------------------------------------ */
  var SITE = {
    brand: ['Lingua', 'Antiqua'],
    home: {
      eyebrow: 'A Collection of Tools',
      title: 'Languages of the <em>Ancient World</em>',
      lede: 'A small library of applications for the study of classical and biblical tongues, gathered into one quiet place.',
      sectionsHeading: 'Languages'
    },
    footer: 'Crafted with care \u00B7 All applications are free to use',
    sections: [
      {
        id: 'greek',
        label: 'Greek',
        menuLabel: 'Koine & Classical',
        href: 'Greek.html',
        card: { glyph: '\u0391\u03A9', glyphLang: 'grc', text: 'From Homer\u2019s hexameter to Koine prose.' },
        hero: {
          glyph: '\u0391\u03C9',
          glyphLang: 'grc',
          eyebrow: 'Koine & Classical',
          title: 'The <em>Greek</em> Tongue',
          lede: 'From the hexameters of Homer to the gospels of the Evangelists. A small set of tools for learning the article, the vocabulary, and the forms that shaped Western thought.'
        },
        quote: {
          original: '\u1F18\u03BD \u1F00\u03C1\u03C7\u1FC7 \u1F26\u03BD \u1F41 \u03BB\u03CC\u03B3\u03BF\u03C2.',
          lang: 'grc',
          text: '\u201CIn the beginning was the Word.\u201D',
          attr: 'John 1:1'
        },
        apps: [
          {
            id: 'GreekArticles',
            href: 'GreekArticles.html',
            title: 'Greek Articles',
            category: 'Foundations',
            glyph: '\u0391\u03B1',
            glyphLang: 'grc',
            desc: 'Drill \u1F41, \u1F21, \u03C4\u03CC through flashcards, quizzes, and matching, across every case, gender, and number.',
            cta: 'Begin'
          },
          {
            id: 'GreekVocab',
            href: 'GreekVocab.html',
            title: 'Athenaze Vocabulary',
            category: 'Vocabulary',
            glyph: '\u03BB\u03CC\u03B3\u03BF\u03C2',
            glyphLang: 'grc',
            desc: 'Every word from Athenaze, Chapters I\u2013X, with flashcards, quizzes, matching, typed recall, and a sortable index.',
            cta: 'Practice'
          }
        ]
      },
      {
        id: 'latin',
        label: 'Latin',
        menuLabel: 'Classical Latin',
        href: 'Latin.html',
        card: { glyph: 'SPQR', glyphLang: 'la', text: 'The enduring voice of Rome and the West.' },
        hero: {
          glyph: 'Lat\u012Bna',
          glyphLang: 'la',
          eyebrow: 'Classical Latin',
          title: 'The <em>Latin</em> Tongue',
          lede: 'The language of Cicero, Vergil, and the Vulgate. Study the forms that carried Roman law, letters, and liturgy across two thousand years.'
        },
        quote: {
          original: 'Veni, vidi, vici.',
          lang: 'la',
          text: '\u201CI came, I saw, I conquered.\u201D',
          attr: 'Julius Caesar'
        },
        apps: [
          {
            id: 'LatinPronouns',
            href: 'LatinPronouns.html',
            title: 'Is, Ea, Id',
            category: 'Pronouns',
            glyph: 'is \u00B7 ea \u00B7 id',
            glyphLang: 'la',
            desc: 'The Latin demonstrative pronoun in every case and number: flashcards, quizzes, paradigm tables, and matching.',
            cta: 'Begin'
          }
        ]
      },
      {
        id: 'hebrew',
        label: 'Hebrew',
        menuLabel: 'Biblical Hebrew',
        href: 'Hebrew.html',
        card: { glyph: '\u05D0\u05D1', glyphLang: 'he', text: 'Scripture in its original tongue.' },
        hero: {
          glyph: '\u05D0\u05B8\u05DC\u05B6\u05E3',
          glyphLang: 'he',
          eyebrow: 'Biblical Hebrew',
          title: 'The <em>Hebrew</em> Tongue',
          lede: 'The language of the Torah and the Prophets. Learn the consonants, the vowel points, and the vocabulary of the Hebrew Bible.'
        },
        quote: {
          original: '\u05D1\u05B0\u05BC\u05E8\u05B5\u05D0\u05E9\u05C1\u05B4\u05D9\u05EA \u05D1\u05B8\u05BC\u05E8\u05B8\u05D0 \u05D0\u05B1\u05DC\u05B9\u05D4\u05B4\u05D9\u05DD \u05D0\u05B5\u05EA \u05D4\u05B7\u05E9\u05C1\u05B8\u05BC\u05DE\u05B7\u05D9\u05B4\u05DD \u05D5\u05B0\u05D0\u05B5\u05EA \u05D4\u05B8\u05D0\u05B8\u05E8\u05B6\u05E5',
          lang: 'he',
          text: '\u201CIn the beginning God created the heaven and the earth.\u201D',
          attr: 'Genesis 1:1'
        },
        apps: [
          {
            id: 'HebrewLetters',
            href: 'HebrewLetters.html',
            title: 'Letters',
            category: 'Foundations',
            glyph: '\u05D0\u05B8\u05BC\u05DC\u05B6\u05E3\u05BE\u05D1\u05B5\u05BC\u05D9\u05EA',
            glyphLang: 'he',
            desc: 'The twenty-two letters of the alef-bet, with their names, sounds, and final forms.',
            cta: 'Begin'
          },
          {
            id: 'HebrewVowels',
            href: 'HebrewVowels.html',
            title: 'Vowels',
            category: 'Foundations',
            glyph: '\u05E0\u05B4\u05D9\u05E7\u05BC\u05D5\u05BC\u05D3',
            glyphLang: 'he',
            desc: 'The Masoretic pointing system: long, short, and reduced vowels, with example words.',
            cta: 'Begin'
          },
          {
            id: 'HebrewVocab',
            href: 'HebrewVocab.html',
            title: 'Vocabulary',
            category: 'Vocabulary',
            glyph: '\u05DE\u05B4\u05DC\u05BC\u05D5\u05BC\u05DF',
            glyphLang: 'he',
            desc: 'Biblical Hebrew vocabulary in graded lists, with flashcards, a quiz, and progress saved on your device.',
            cta: 'Practice'
          }
        ]
      }
    ]
  };

  /* ------------------------------------------------------------------------
     Utilities (exposed to applications)
     ------------------------------------------------------------------------ */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Tiny hyperscript helper: h('button', { class: 'btn', onclick: fn }, ['Label']) */
  function h(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
        else if (v === true) e.setAttribute(k, '');
        else e.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  /* Wrap runs of Hebrew letters and points in <span lang="he"> so mixed text
     renders with the right font and bidi isolation. Input is escaped first. */
  function hebrewRuns(text) {
    return esc(text).replace(/[\u0590-\u05FF\u25CC][\u0590-\u05FF\u25CC\u05BE ]*[\u0590-\u05FF\u25CC]|[\u0590-\u05FF\u25CC]/g, function (m) {
      return '<span class="hebrew-inline" lang="he" dir="rtl">' + m + '</span>';
    });
  }

  /* localStorage that never throws (private mode, blocked storage, quota). */
  var store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (e) { return false; }
    },
    remove: function (key) {
      try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ }
    }
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ------------------------------------------------------------------------
     Theme
     ------------------------------------------------------------------------ */
  var THEME_KEY = 'lingua:theme';

  function systemPrefersDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function effectiveTheme() {
    var set = document.documentElement.getAttribute('data-theme');
    return set || (systemPrefersDark() ? 'dark' : 'light');
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#14100b' : '#1a1410');
  }
  function toggleTheme() {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set(THEME_KEY, next);
    syncThemeButton();
  }
  function syncThemeButton() {
    var btn = $('.theme-toggle');
    if (!btn) return;
    var dark = effectiveTheme() === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  /* ------------------------------------------------------------------------
     Chrome: header, breadcrumb, footer
     ------------------------------------------------------------------------ */
  var body = document.body;
  var pageKind = body.getAttribute('data-page') || (body.getAttribute('data-app') ? 'app' : '');
  var sectionId = body.getAttribute('data-section') || '';
  var appId = body.getAttribute('data-app') || '';

  function sectionById(id) {
    for (var i = 0; i < SITE.sections.length; i++) if (SITE.sections[i].id === id) return SITE.sections[i];
    return null;
  }
  function appById(section, id) {
    if (!section) return null;
    for (var i = 0; i < section.apps.length; i++) if (section.apps[i].id === id) return section.apps[i];
    return null;
  }

  var ICON_SUN = '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var ICON_MOON = '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/></svg>';
  var ICON_MENU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

  function headerHTML() {
    var nav = SITE.sections.map(function (s) {
      var current = s.id === sectionId;
      var links = s.apps.map(function (a) {
        var here = current && a.id === appId;
        return '<a href="' + esc(a.href) + '" role="menuitem"' + (here ? ' aria-current="page"' : '') + '>' + esc(a.title) + '</a>';
      }).join('');
      return '<div class="nav-item">' +
        '<button type="button" class="nav-trigger" aria-haspopup="true" aria-expanded="false"' + (current ? ' aria-current="true"' : '') + '>' + esc(s.label) + '</button>' +
        '<div class="dropdown" role="menu" aria-label="' + esc(s.label) + '">' +
          '<div class="dropdown-label">' + esc(s.menuLabel) + '</div>' +
          '<a href="' + esc(s.href) + '" role="menuitem">All ' + esc(s.label) + ' tools</a>' +
          links +
        '</div></div>';
    }).join('');

    return '<header class="topbar"><div class="topbar-inner">' +
      '<a href="index.html" class="brand">' + esc(SITE.brand[0]) + ' <span>' + esc(SITE.brand[1]) + '</span></a>' +
      '<nav class="primary-nav" id="primary-nav" aria-label="Languages">' + nav + '</nav>' +
      '<div class="topbar-tools">' +
        '<button type="button" class="icon-btn theme-toggle" aria-label="Switch theme">' + ICON_SUN + ICON_MOON + '</button>' +
        '<button type="button" class="icon-btn menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="primary-nav">' + ICON_MENU + '</button>' +
      '</div>' +
    '</div></header>';
  }

  function breadcrumbHTML() {
    var section = sectionById(sectionId);
    if (!section) return '';
    var items = ['<li><a href="index.html">Home</a></li>'];
    if (pageKind === 'section') {
      items.push('<li><span aria-current="page">' + esc(section.label) + '</span></li>');
    } else {
      items.push('<li><a href="' + esc(section.href) + '">' + esc(section.label) + '</a></li>');
      var app = appById(section, appId);
      if (app) items.push('<li><span aria-current="page">' + esc(app.title) + '</span></li>');
    }
    return '<ol>' + items.join('') + '</ol>';
  }

  function footerHTML() {
    var links = ['<a href="index.html">Home</a>'].concat(SITE.sections.map(function (s) {
      return '<a href="' + esc(s.href) + '">' + esc(s.label) + '</a>';
    })).join('');
    return '<footer class="site-footer">' +
      '<div class="ornament" aria-hidden="true">\u2766</div>' +
      '<nav class="footer-links" aria-label="Footer">' + links + '</nav>' +
      '<div>' + esc(SITE.footer) + '</div>' +
    '</footer>';
  }

  function cardHTML(opts) {
    return '<a href="' + esc(opts.href) + '" class="card">' +
      '<span class="card-glyph"' + (opts.glyphLang ? ' lang="' + opts.glyphLang + '"' : '') + ' aria-hidden="true">' + esc(opts.glyph) + '</span>' +
      (opts.category ? '<span class="card-category">' + esc(opts.category) + '</span>' : '') +
      '<h2>' + esc(opts.title) + '</h2>' +
      '<p>' + esc(opts.text) + '</p>' +
      '<span class="card-cta">' + esc(opts.cta) + '</span>' +
    '</a>';
  }

  function hubHTML() {
    if (pageKind === 'home') {
      var h = SITE.home;
      return '<section class="hero">' +
        '<div class="eyebrow">' + esc(h.eyebrow) + '</div>' +
        '<h1>' + h.title + '</h1>' +
        '<p class="lede">' + esc(h.lede) + '</p>' +
        '<div class="ornament-rule" aria-hidden="true">\u2766</div>' +
      '</section>' +
      '<h2 class="section-heading">' + esc(h.sectionsHeading) + '</h2>' +
      '<section class="card-grid" aria-label="Languages">' +
        SITE.sections.map(function (s) {
          return cardHTML({ href: s.href, glyph: s.card.glyph, glyphLang: s.card.glyphLang, title: s.label, text: s.card.text, cta: 'Enter' });
        }).join('') +
      '</section>';
    }

    var section = sectionById(sectionId);
    if (!section) return '';
    var hero = section.hero;
    var q = section.quote;
    return '<section class="hero">' +
      '<div class="hero-glyph" lang="' + hero.glyphLang + '" aria-hidden="true">' + esc(hero.glyph) + '</div>' +
      '<div class="eyebrow">' + esc(hero.eyebrow) + '</div>' +
      '<h1>' + hero.title + '</h1>' +
      '<p class="lede">' + esc(hero.lede) + '</p>' +
      '<div class="ornament-rule" aria-hidden="true">\u2766</div>' +
    '</section>' +
    '<h2 class="section-heading">Applications</h2>' +
    '<section class="card-grid" aria-label="' + esc(section.label) + ' applications">' +
      section.apps.map(function (a) {
        return cardHTML({ href: a.href, glyph: a.glyph, glyphLang: a.glyphLang, category: a.category, title: a.title, text: a.desc, cta: a.cta });
      }).join('') +
    '</section>' +
    (q ? '<blockquote class="quote">' +
      '<p class="quote-original" lang="' + q.lang + '">' + esc(q.original) + '</p>' +
      '<p class="quote-text">' + esc(q.text) + '</p>' +
      '<p class="quote-attr">' + esc(q.attr) + '</p>' +
    '</blockquote>' : '');
  }

  function fill(el, html) {
    if (el && !el.hasAttribute('data-rendered')) {
      el.innerHTML = html;
      el.setAttribute('data-rendered', '');
      return true;
    }
    return false;
  }

  var wired = false;
  function wireChrome() {
    var topbar = $('.topbar');
    if (!topbar || wired) return;
    wired = true;

    var items = $$('.nav-item', topbar);
    var menuBtn = $('.menu-toggle', topbar);

    function closeAll(except) {
      items.forEach(function (item) {
        if (item === except) return;
        item.classList.remove('open');
        $('.nav-trigger', item).setAttribute('aria-expanded', 'false');
      });
    }
    function setOpen(item, open) {
      closeAll(open ? item : null);
      item.classList.toggle('open', open);
      $('.nav-trigger', item).setAttribute('aria-expanded', String(open));
    }
    function menuLinks(item) { return $$('.dropdown a', item); }

    items.forEach(function (item) {
      var trigger = $('.nav-trigger', item);
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(item, !item.classList.contains('open'));
      });
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setOpen(item, true);
          var first = menuLinks(item)[0];
          if (first) first.focus();
        }
      });
      item.addEventListener('keydown', function (e) {
        var links = menuLinks(item);
        var i = links.indexOf(document.activeElement);
        if (i === -1) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
        else if (e.key === 'Home') { e.preventDefault(); links[0].focus(); }
        else if (e.key === 'End') { e.preventDefault(); links[links.length - 1].focus(); }
      });
      item.addEventListener('focusout', function (e) {
        if (!item.contains(e.relatedTarget)) setOpen(item, false);
      });
    });

    document.addEventListener('click', function (e) {
      if (!topbar.contains(e.target)) {
        closeAll(null);
        topbar.classList.remove('menu-open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = items.filter(function (i) { return i.classList.contains('open'); })[0];
      closeAll(null);
      if (open) $('.nav-trigger', open).focus();
      if (topbar.classList.contains('menu-open')) {
        topbar.classList.remove('menu-open');
        if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); }
      }
    });

    if (menuBtn) {
      menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = !topbar.classList.contains('menu-open');
        topbar.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
      });
    }

    $('.theme-toggle', topbar).addEventListener('click', toggleTheme);
    syncThemeButton();

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () { if (!store.get(THEME_KEY, null)) syncThemeButton(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
  }

  function render() {
    var headerEl = document.getElementById('site-header');
    if (fill(headerEl, headerHTML())) wireChrome();

    var crumbEl = document.getElementById('site-breadcrumb');
    if (crumbEl && pageKind !== 'home') fill(crumbEl, breadcrumbHTML());

    var hubEl = document.getElementById('hub-root');
    if (hubEl) fill(hubEl, hubHTML());

    fill(document.getElementById('site-footer'), footerHTML());
  }

  // Render what already exists immediately (no flash of an empty header),
  // then fill the rest once the document has been parsed.
  render();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);

  window.Lingua = {
    site: SITE,
    shuffle: shuffle,
    esc: esc,
    h: h,
    hebrewRuns: hebrewRuns,
    store: store,
    $: $,
    $$: $$,
    theme: { get: effectiveTheme, set: function (t) { applyTheme(t); store.set(THEME_KEY, t); syncThemeButton(); }, toggle: toggleTheme }
  };
})();
