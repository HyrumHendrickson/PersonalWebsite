/* ==========================================================================
   Paradigm trainer
   --------------------------------------------------------------------------
   One study engine for any inflected paradigm that is organised by case,
   gender, and number: flashcards, multiple-choice quiz, paradigm tables, and
   a matching game. The Greek article and the Latin pronoun pages are both
   thin configurations of this file.

   Requires assets/lingua.js (for Lingua.shuffle).

   Lingua.paradigmTrainer({
     root:       '#app',                      container element or selector
     lang:       'grc' | 'la',                BCP-47 tag for the forms
     formName:   'article' | 'pronoun',       used in quiz prompts
     langLabel:  'Greek' | 'Latin',           used in labels and buttons
     cases:      ['Nominative', ...],         row order for the paradigm table
     genders:    ['Masculine', ...],
     numbers:    ['Singular', 'Plural'],
     forms: [ { form, gender, number, case, gloss, translit?, variant? }, ... ],
     praise:     'Recte!',                    shown after a correct answer
     victory:    'Optim\u0113!',              shown when a match round is complete
     notes:      ['<em>html</em>', ...]       paragraphs under the paradigm tables
   });
   ========================================================================== */
(function () {
  'use strict';

  var L = window.Lingua;
  var shuffle = L.shuffle;
  var h = L.h;

  function trainer(cfg) {
    var root = typeof cfg.root === 'string' ? document.querySelector(cfg.root) : cfg.root;
    var FORMS = cfg.forms;
    var CASES = cfg.cases;
    var GENDERS = cfg.genders;
    var NUMBERS = cfg.numbers;
    var lang = cfg.lang;
    var ROUND_SIZE = 6;

    /* ---------- helpers over the data set ---------- */
    function fullLabel(a) { return a.case + ' \u00B7 ' + a.gender + ' ' + a.number; }
    function shortLabel(a) { return a.case + ' \u00B7 ' + a.gender + ' ' + (a.number === 'Plural' ? 'Pl.' : 'Sg.'); }
    function sameParse(a, b) { return a.form === b.form && a.case === b.case && a.number === b.number; }
    function parsingsOf(a) { return FORMS.filter(function (x) { return x.form === a.form; }); }
    function uniqueForms(list) {
      var seen = {};
      return list.filter(function (a) { if (seen[a.form]) return false; seen[a.form] = true; return true; });
    }
    function slotsOf(form) {
      var seen = {}, out = [];
      FORMS.forEach(function (a) {
        if (a.form !== form) return;
        var k = a.case + '|' + a.number;
        if (!seen[k]) { seen[k] = true; out.push({ case: a.case, number: a.number }); }
      });
      return out;
    }
    function cell(num, gen, cs) {
      for (var i = 0; i < FORMS.length; i++) {
        var a = FORMS[i];
        if (a.number === num && a.gender === gen && a.case === cs) return a;
      }
      return null;
    }

    /* ---------- state ---------- */
    var MODES = [
      { id: 'flashcard', label: 'Flashcards', num: 'I', render: renderFlash },
      { id: 'quiz', label: 'Quiz', num: 'II', render: renderQuiz },
      { id: 'browse', label: 'Paradigm', num: 'III', render: renderBrowse },
      { id: 'match', label: 'Match', num: 'IV', render: renderMatch }
    ];
    var mode = 'flashcard';
    var timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    var flash = { deck: shuffle(FORMS), index: 0, flipped: false, direction: 'form-first' };
    var quiz = { direction: 'form-to-label', q: null, choices: [], picked: null, correct: 0, total: 0 };
    var match = null;
    var ui = {}; // live references for the active mode (card element etc.)

    /* ---------- frame: tabs + panel ---------- */
    var tabsEl = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Study modes' });
    var panelHost = h('div', { id: 'panel-host' });
    root.appendChild(tabsEl);
    root.appendChild(panelHost);

    function renderTabs() {
      tabsEl.innerHTML = '';
      MODES.forEach(function (m) {
        var selected = m.id === mode;
        tabsEl.appendChild(h('button', {
          class: 'tab', type: 'button', role: 'tab', id: 'tab-' + m.id,
          'aria-selected': String(selected), 'aria-controls': 'panel-host',
          tabindex: selected ? '0' : '-1',
          onclick: function () { setMode(m.id); },
          onkeydown: function (e) {
            var i = MODES.indexOf(m), n = null;
            if (e.key === 'ArrowRight') n = MODES[(i + 1) % MODES.length];
            else if (e.key === 'ArrowLeft') n = MODES[(i - 1 + MODES.length) % MODES.length];
            else if (e.key === 'Home') n = MODES[0];
            else if (e.key === 'End') n = MODES[MODES.length - 1];
            if (n) { e.preventDefault(); setMode(n.id); document.getElementById('tab-' + n.id).focus(); }
          }
        }, [h('span', { class: 'tab-num', 'aria-hidden': 'true' }, [m.num]), m.label]));
      });
    }

    function setMode(id) {
      if (id === mode && panelHost.firstChild) return;
      mode = id;
      clearTimers();
      ui = {};
      renderTabs();
      draw();
    }

    function draw() {
      var m = MODES.filter(function (x) { return x.id === mode; })[0];
      panelHost.setAttribute('role', 'tabpanel');
      panelHost.setAttribute('aria-labelledby', 'tab-' + mode);
      m.render();
    }

    function frame(title, meta, content) {
      var metaEl = h('div', { class: 'panel-meta', 'aria-live': 'polite' }, [meta]);
      var panel = h('section', { class: 'panel' }, [
        h('div', { class: 'panel-header' }, [h('h2', { class: 'panel-title' }, [title]), metaEl]),
        content
      ]);
      panelHost.innerHTML = '';
      panelHost.appendChild(panel);
      return metaEl;
    }

    function hint(html) { return h('p', { class: 'kbd-hint', html: html }); }

    /* ---------- I. flashcards ---------- */
    function parseBlock(a) {
      return h('span', { class: 'fc-prompt' }, [h('em', null, [a.case]), h('br'), a.gender + ' \u00B7 ' + a.number]);
    }

    function fillFaces() {
      var c = flash.deck[flash.index];
      var formFirst = flash.direction === 'form-first';
      var form = function () { return h('span', { class: 'fc-form', lang: lang }, [c.form]); };

      var front = [formFirst ? form() : parseBlock(c), h('span', { class: 'fcard-hint' }, ['Tap to reveal'])];
      var back;
      if (formFirst) {
        back = [parseBlock(c)];
        if (c.translit) back.push(h('span', { class: 'fc-translit' }, [c.translit]));
        back.push(h('span', { class: 'fc-gloss' }, [c.gloss]));
        var others = parsingsOf(c).filter(function (p) {
          return !(p.case === c.case && p.gender === c.gender && p.number === c.number);
        });
        if (others.length) {
          back.push(h('span', { class: 'fc-small' }, ['Also: ' + others.map(function (p) {
            return p.case.slice(0, 3) + '. ' + p.gender[0] + '. ' + p.number.slice(0, 2) + '.';
          }).join(' / ')]));
        }
      } else {
        back = [form()];
        if (c.translit) back.push(h('span', { class: 'fc-translit' }, [c.translit]));
        if (c.variant) back.push(h('span', { class: 'fc-small' }, ['variant: ' + c.variant]));
        back.push(h('span', { class: 'fc-gloss' }, [c.gloss]));
      }
      ui.front.innerHTML = '';
      ui.back.innerHTML = '';
      front.forEach(function (n) { ui.front.appendChild(n); });
      back.forEach(function (n) { ui.back.appendChild(n); });
      ui.meta.textContent = 'Card ' + (flash.index + 1) + ' of ' + flash.deck.length;
    }

    function setFlipped(v) {
      flash.flipped = v;
      ui.card.classList.toggle('is-flipped', v);
      ui.front.setAttribute('aria-hidden', String(v));
      ui.back.setAttribute('aria-hidden', String(!v));
      ui.reveal.textContent = v ? 'Hide' : 'Reveal';
    }

    function flashStep(d) {
      var go = function () {
        flash.index = (flash.index + d + flash.deck.length) % flash.deck.length;
        fillFaces();
      };
      if (flash.flipped) { setFlipped(false); clearTimers(); later(go, 280); } else go();
    }

    function renderFlash() {
      ui.front = h('div', { class: 'fcard-face' });
      ui.back = h('div', { class: 'fcard-face fcard-face--back' });
      ui.card = h('div', {
        class: 'fcard', role: 'button', tabindex: '0',
        'aria-label': 'Flashcard. Press Space or Enter to flip.',
        onclick: function () { setFlipped(!flash.flipped); },
        onkeydown: function (e) {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(!flash.flipped); }
        }
      }, [h('div', { class: 'fcard-inner' }, [ui.front, ui.back])]);

      ui.reveal = h('button', { type: 'button', class: 'btn btn--primary', onclick: function () { setFlipped(!flash.flipped); } }, ['Reveal']);
      function segButton(label, value) {
        return h('button', {
          type: 'button', 'data-dir': value,
          'aria-pressed': String(flash.direction === value),
          onclick: function () {
            if (flash.direction === value) return;
            clearTimers();
            flash.direction = value;
            setFlipped(false);
            fillFaces();
            Array.prototype.forEach.call(dirSeg.children, function (b) {
              b.setAttribute('aria-pressed', String(b.getAttribute('data-dir') === value));
            });
          }
        }, [label]);
      }
      var dirSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Card direction' }, [
        segButton(cfg.langLabel + ' \u2192 Label', 'form-first'),
        segButton('Label \u2192 ' + cfg.langLabel, 'label-first')
      ]);

      var content = h('div', { class: 'stage' }, [
        dirSeg,
        ui.card,
        h('div', { class: 'btn-row' }, [
          h('button', { type: 'button', class: 'btn', onclick: function () { flashStep(-1); } }, ['\u2039 Previous']),
          ui.reveal,
          h('button', { type: 'button', class: 'btn', onclick: function () { flashStep(1); } }, ['Next \u203A'])
        ]),
        h('div', { class: 'btn-row' }, [
          h('button', {
            type: 'button', class: 'btn btn--gold',
            onclick: function () { clearTimers(); flash.deck = shuffle(FORMS); flash.index = 0; setFlipped(false); fillFaces(); }
          }, ['Reshuffle Deck'])
        ]),
        hint('<kbd>Space</kbd> flips the card \u00B7 <kbd>\u2190</kbd> <kbd>\u2192</kbd> move between cards')
      ]);

      ui.meta = frame('Flashcards', '', content);
      setFlipped(flash.flipped);
      fillFaces();
    }

    /* ---------- II. quiz ---------- */
    function newQuestion() {
      var dir = quiz.direction;
      var answer = FORMS[Math.floor(Math.random() * FORMS.length)];
      var pool = FORMS.filter(function (a) { return a.form !== answer.form; });
      var options;
      if (dir === 'form-to-label') {
        var seen = {};
        seen[fullLabel(answer)] = true;
        var distractors = [];
        shuffle(pool).forEach(function (a) {
          var k = fullLabel(a);
          if (distractors.length < 3 && !seen[k]) { distractors.push(a); seen[k] = true; }
        });
        options = shuffle([answer].concat(distractors));
      } else {
        options = shuffle([answer].concat(uniqueForms(shuffle(pool)).slice(0, 3)));
      }
      quiz.q = answer;
      quiz.choices = options;
      quiz.picked = null;
    }

    function isRight(c) {
      return quiz.direction === 'form-to-label' ? sameParse(c, quiz.q) : c.form === quiz.q.form;
    }

    function feedbackText() {
      var q = quiz.q, right = isRight(quiz.picked);
      var quoted = '\u201C' + q.form + '\u201D';
      if (right) {
        if (quiz.direction === 'form-to-label') {
          var genders = parsingsOf(q).filter(function (p) { return p.case === q.case && p.number === q.number; })
            .map(function (p) { return p.gender; });
          if (genders.length > 1) return [cfg.praise, ' ' + quoted + ' is ' + q.case + ' ' + q.number + ', valid for ' + genders.join(', ') + '.'];
        }
        return [cfg.praise, ' ' + quoted + ' \u2014 ' + q.case + ', ' + q.gender + ', ' + q.number + (q.translit ? ' (' + q.translit + ')' : '') + '.'];
      }
      if (quiz.direction === 'form-to-label') {
        var desc = slotsOf(q.form).map(function (s) {
          var g = parsingsOf(q).filter(function (p) { return p.case === s.case && p.number === s.number; })
            .map(function (p) { return p.gender[0]; }).join('/');
          return s.case + ' ' + s.number + ' (' + g + ')';
        }).join(' or ');
        return ['Not quite.', ' ' + quoted + ' can be parsed as ' + desc + '.'];
      }
      return ['Not quite.', ' The form for ' + q.case + ' ' + q.gender + ' ' + q.number + ' is ' + quoted + '.'];
    }

    function choose(i) {
      if (quiz.picked || !quiz.choices[i]) return;
      quiz.picked = quiz.choices[i];
      quiz.total += 1;
      if (isRight(quiz.picked)) quiz.correct += 1;
      renderQuiz(true);
    }

    function setQuizDir(d) {
      if (quiz.direction === d) return;
      quiz.direction = d;
      newQuestion();
      renderQuiz(true);
    }

    function renderQuiz(keepQuestion) {
      if (!keepQuestion || !quiz.q) newQuestion();
      var f2l = quiz.direction === 'form-to-label';
      var pct = quiz.total ? Math.round(quiz.correct / quiz.total * 100) : 0;

      var stats = h('div', { class: 'stats' }, [
        h('span', { class: 'is-good' }, ['Correct', h('strong', null, [String(quiz.correct)])]),
        h('span', null, ['Asked', h('strong', null, [String(quiz.total)])]),
        h('span', { class: 'is-gold' }, ['Accuracy', h('strong', null, [pct + '%'])])
      ]);

      var dirRow = h('div', { class: 'btn-row mb-1' }, [
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Question direction' }, [
          h('button', { type: 'button', 'aria-pressed': String(f2l), onclick: function () { setQuizDir('form-to-label'); } }, ['Form \u2192 Identify']),
          h('button', { type: 'button', 'aria-pressed': String(!f2l), onclick: function () { setQuizDir('label-to-form'); } }, ['Identify \u2192 Form'])
        ]),
        h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: function () { quiz.correct = 0; quiz.total = 0; renderQuiz(true); } }, ['Reset Score'])
      ]);

      var q = quiz.q;
      var prompt = f2l
        ? h('div', { class: 'prompt' }, ['Parse this ' + cfg.formName + ':', h('span', { class: 'big', lang: lang }, [q.form])])
        : h('div', { class: 'prompt' }, ['Give the form for ', h('em', null, [q.case + ' ' + q.gender + ' ' + q.number])]);

      var options = h('div', { class: 'options', role: 'group', 'aria-label': 'Answer choices' }, quiz.choices.map(function (c, i) {
        var cls = 'option' + (f2l ? '' : ' option--italic');
        if (quiz.picked) {
          if (isRight(c)) cls += ' is-correct';
          else if (c === quiz.picked) cls += ' is-wrong';
        }
        var text = f2l ? fullLabel(c) : c.form;
        return h('button', { type: 'button', class: cls, disabled: !!quiz.picked, onclick: function () { choose(i); } }, [
          h('span', { class: 'option-key', 'aria-hidden': 'true' }, [String(i + 1)]),
          h('span', { class: 'option-text', lang: f2l ? null : lang }, [text])
        ]);
      }));

      var kids = [stats, dirRow, prompt, options];
      var next = null;
      if (quiz.picked) {
        var right = isRight(quiz.picked);
        var fb = feedbackText();
        kids.push(h('div', { class: 'feedback ' + (right ? 'is-correct' : 'is-wrong'), role: 'status' }, [h('strong', null, [fb[0]]), fb[1]]));
        next = h('button', { type: 'button', class: 'btn btn--primary', onclick: function () { newQuestion(); renderQuiz(true); } }, ['Next Question \u203A']);
        kids.push(h('div', { class: 'btn-row mt-1' }, [next]));
      } else {
        kids.push(h('div', { class: 'feedback', role: 'status' }));
      }
      kids.push(hint('Press <kbd>1</kbd>\u2013<kbd>4</kbd> to answer'));

      frame('Quiz', 'Multiple choice \u00B7 advances with Next', h('div', null, kids));
      if (next) next.focus();
    }

    /* ---------- III. paradigm tables ---------- */
    function renderBrowse() {
      var tables = NUMBERS.map(function (num) {
        var head = h('tr', null, [h('th', { class: 'row-head', scope: 'col' }, ['Case'])].concat(
          GENDERS.map(function (g) { return h('th', { scope: 'col' }, [g]); })));
        var rows = CASES.map(function (cs) {
          var cells = GENDERS.map(function (g) {
            var c = cell(num, g, cs);
            if (!c) return h('td', { class: 'is-empty', 'aria-label': 'no form' }, ['\u2014']);
            var kids = [h('span', { class: 'cell-form', lang: lang }, [c.form])];
            if (c.translit) kids.push(h('span', { class: 'cell-sub' }, [c.translit]));
            if (c.variant) kids.push(h('span', { class: 'cell-sub' }, ['or ' + c.variant]));
            return h('td', null, kids);
          });
          return h('tr', null, [h('th', { class: 'row-head', scope: 'row' }, [cs])].concat(cells));
        });
        return h('div', null, [
          h('div', { class: 'table-label' }, [num]),
          h('div', { class: 'table-wrap' }, [h('table', { class: 'table' }, [h('thead', null, [head]), h('tbody', null, rows)])])
        ]);
      });
      var notes = (cfg.notes || []).map(function (n) { return h('p', { class: 'panel-note', html: n }); });
      frame('Paradigm', 'The full declension at a glance', h('div', null, tables.concat(notes)));
    }

    /* ---------- IV. matching ---------- */
    function buildRound() {
      var picks = uniqueForms(shuffle(FORMS)).slice(0, ROUND_SIZE).map(function (p, i) {
        return Object.assign({ id: i }, p);
      });
      match = {
        formTiles: shuffle(picks), labelTiles: shuffle(picks),
        matched: {}, matchedCount: 0, selForm: null, selLabel: null,
        attempts: 0, wrong: 0, flash: { ids: [], kind: null }
      };
    }

    function pick(side, id) {
      if (match.flash.kind || match.matched[id]) return;
      if (side === 'form') match.selForm = id; else match.selLabel = id;
      if (match.selForm === null || match.selLabel === null) { renderMatch(true); return; }
      match.attempts += 1;
      if (match.selForm === match.selLabel) {
        match.flash = { ids: [match.selForm], kind: 'correct' };
        renderMatch(true);
        later(function () {
          match.matched[match.selForm] = true;
          match.matchedCount += 1;
          match.selForm = match.selLabel = null;
          match.flash = { ids: [], kind: null };
          renderMatch(true);
        }, 400);
      } else {
        match.wrong += 1;
        match.flash = { ids: [match.selForm, match.selLabel], kind: 'wrong' };
        renderMatch(true);
        later(function () {
          match.selForm = match.selLabel = null;
          match.flash = { ids: [], kind: null };
          renderMatch(true);
        }, 600);
      }
    }

    function renderMatch(keepRound) {
      if (!keepRound || !match) buildRound();
      var done = match.matchedCount === ROUND_SIZE;
      var focusKey = document.activeElement && document.activeElement.getAttribute && document.activeElement.getAttribute('data-key');

      function tile(t, side) {
        var cls = 'tile' + (side === 'form' ? ' tile--form' : '');
        var sel = side === 'form' ? match.selForm : match.selLabel;
        if (match.matched[t.id]) cls += ' is-matched';
        else if (sel === t.id) cls += ' is-selected';
        if (match.flash.ids.indexOf(t.id) !== -1) cls += match.flash.kind === 'correct' ? ' is-correct' : ' is-wrong';
        return h('button', {
          type: 'button', class: cls,
          'data-key': side + t.id,
          disabled: !!match.matched[t.id],
          'aria-pressed': String(sel === t.id),
          onclick: function () { pick(side, t.id); }
        }, [side === 'form' ? h('span', { lang: lang }, [t.form]) : shortLabel(t)]);
      }

      var stats = h('div', { class: 'stats' }, [
        h('span', null, ['Attempts', h('strong', null, [String(match.attempts)])]),
        h('span', { class: 'is-bad' }, ['Errors', h('strong', null, [String(match.wrong)])])
      ]);
      var board = h('div', { class: 'match-board' }, [
        h('div', null, [h('div', { class: 'match-col-label' }, [cfg.langLabel]), h('div', { class: 'match-list' }, match.formTiles.map(function (t) { return tile(t, 'form'); }))]),
        h('div', null, [h('div', { class: 'match-col-label' }, ['Parsing']), h('div', { class: 'match-list' }, match.labelTiles.map(function (t) { return tile(t, 'label'); }))])
      ]);

      var kids = [stats, board];
      if (done) {
        kids.push(h('div', { class: 'results' }, [
          h('h2', null, [cfg.victory]),
          h('p', null, ['Round complete in ' + match.attempts + ' attempts (' + match.wrong + (match.wrong === 1 ? ' error' : ' errors') + ').']),
          h('div', { class: 'btn-row' }, [h('button', { type: 'button', class: 'btn btn--primary', onclick: function () { renderMatch(false); } }, ['New Round \u203A'])])
        ]));
      } else {
        kids.push(h('div', { class: 'btn-row mt-2' }, [h('button', { type: 'button', class: 'btn btn--gold', onclick: function () { clearTimers(); renderMatch(false); } }, ['Restart Round'])]));
      }
      frame('Match', 'Pair ' + cfg.langLabel + ' forms with their grammatical labels \u00B7 ' + match.matchedCount + ' / ' + ROUND_SIZE, h('div', null, kids));
      if (focusKey) {
        var again = panelHost.querySelector('[data-key="' + focusKey + '"]');
        if (again && !again.disabled) again.focus();
      }
    }

    /* ---------- keyboard shortcuts ---------- */
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      var inTablist = !!(t && t.getAttribute && t.getAttribute('role') === 'tab');
      var onBody = t === document.body || t === root || (t && t.id === 'panel-host');
      if (mode === 'flashcard' && ui.card) {
        if (inTablist) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); flashStep(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); flashStep(-1); }
        else if (e.key === ' ' && onBody) { e.preventDefault(); setFlipped(!flash.flipped); }
      } else if (mode === 'quiz' && /^[1-9]$/.test(e.key) && !(t && /^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName))) {
        choose(parseInt(e.key, 10) - 1);
      }
    });

    /* ---------- boot ---------- */
    renderTabs();
    draw();
  }

  L.paradigmTrainer = trainer;
})();
