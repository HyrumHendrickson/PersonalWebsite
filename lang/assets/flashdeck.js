/* ==========================================================================
   Flashcard deck
   --------------------------------------------------------------------------
   A reusable flashcard widget: a 3-D flip card, progress bar, previous /
   reveal / next buttons, shuffle and reset, and keyboard support.

   Requires assets/lingua.js.

   var deck = Lingua.flashDeck({
     root:        '#deck',               mount point (element or selector)
     items:       [ ... ],               any objects
     renderFront: function (item) {...}  return a Node, an array of Nodes, or an HTML string
     renderBack:  function (item) {...}
     tall:        false                  taller card for content-heavy backs
   });

   deck.refresh()          re-render the current faces (after a mode or font change)
   deck.setItems(items)    replace the deck and go back to the first card
   ========================================================================== */
(function () {
  'use strict';

  var L = window.Lingua;
  var h = L.h;

  function flashDeck(cfg) {
    var root = typeof cfg.root === 'string' ? document.querySelector(cfg.root) : cfg.root;
    var items = cfg.items.slice();
    var order = items.slice();
    var index = 0;
    var flipped = false;
    var timer = null;

    var counter = h('span');
    var fill = h('div', { class: 'progress-fill' });
    var front = h('div', { class: 'fcard-face' });
    var back = h('div', { class: 'fcard-face fcard-face--back' });
    var card = h('div', {
      class: 'fcard' + (cfg.tall ? ' fcard--tall' : ''),
      role: 'button', tabindex: '0',
      'aria-label': 'Flashcard. Press Space or Enter to flip.',
      onclick: function () { setFlipped(!flipped); },
      onkeydown: function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(!flipped); }
      }
    }, [h('div', { class: 'fcard-inner' }, [front, back])]);

    var reveal = h('button', { type: 'button', class: 'btn btn--primary', onclick: function () { setFlipped(!flipped); } }, ['Reveal']);

    function put(target, content) {
      target.innerHTML = '';
      var list = Array.isArray(content) ? content : [content];
      list.forEach(function (c) {
        if (c === null || c === undefined) return;
        if (typeof c === 'string') target.insertAdjacentHTML('beforeend', c);
        else target.appendChild(c);
      });
    }

    function draw() {
      var item = order[index];
      put(front, [cfg.renderFront(item), h('span', { class: 'fcard-hint' }, ['Tap to reveal'])]);
      put(back, cfg.renderBack(item));
      counter.textContent = 'Card ' + (index + 1) + ' of ' + order.length;
      fill.style.width = ((index + 1) / order.length * 100) + '%';
    }

    function setFlipped(v) {
      flipped = v;
      card.classList.toggle('is-flipped', v);
      front.setAttribute('aria-hidden', String(v));
      back.setAttribute('aria-hidden', String(!v));
      reveal.textContent = v ? 'Hide' : 'Reveal';
    }

    function step(d) {
      var go = function () { index = (index + d + order.length) % order.length; draw(); };
      clearTimeout(timer);
      if (flipped) { setFlipped(false); timer = setTimeout(go, 280); } else go();
    }

    function restart(newOrder) {
      clearTimeout(timer);
      order = newOrder;
      index = 0;
      setFlipped(false);
      draw();
    }

    root.innerHTML = '';
    root.appendChild(h('div', { class: 'stage' }, [
      h('div', { style: 'width:100%;max-width:30rem' }, [
        h('div', { class: 'progress-meta' }, [counter]),
        h('div', { class: 'progress-bar', 'aria-hidden': 'true' }, [fill])
      ]),
      card,
      h('div', { class: 'btn-row' }, [
        h('button', { type: 'button', class: 'btn', onclick: function () { step(-1); } }, ['\u2039 Previous']),
        reveal,
        h('button', { type: 'button', class: 'btn', onclick: function () { step(1); } }, ['Next \u203A'])
      ]),
      h('div', { class: 'btn-row' }, [
        h('button', { type: 'button', class: 'btn btn--gold btn--sm', onclick: function () { restart(L.shuffle(items)); } }, ['Shuffle']),
        h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: function () { restart(items.slice()); } }, ['Reset Order'])
      ]),
      h('p', { class: 'kbd-hint', html: '<kbd>Space</kbd> flips the card \u00B7 <kbd>\u2190</kbd> <kbd>\u2192</kbd> move between cards' })
    ]));

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && /^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === ' ' && t === document.body) { e.preventDefault(); setFlipped(!flipped); }
    });

    setFlipped(false);
    draw();

    return {
      refresh: draw,
      setItems: function (next) { items = next.slice(); restart(items.slice()); }
    };
  }

  L.flashDeck = flashDeck;
})();
