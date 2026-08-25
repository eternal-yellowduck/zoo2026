(function () {
  "use strict";

  var ANIMAL_ROUTE = /^#\/animal\/([a-z0-9-]+)$/;
  var CATEGORY_LABELS = {
    mammal: "哺乳动物",
    bird: "鸟类",
    reptile: "爬行动物",
    amphibian: "两栖动物",
    fish: "鱼类",
    other: "其他",
  };

  function $(id) {
    return document.getElementById(id);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  var byId = {};
  ANIMALS.forEach(function (a) {
    byId[a.id] = a;
  });

  var defaultTitle = document.title;

  // ---------- 卡片渲染（createElement + textContent） ----------
  var grid = $("animalGrid");
  var items = [];

  ANIMALS.forEach(function (animal) {
    var li = el("li", "animal-item");
    li.dataset.id = animal.id;

    var card = el("button", "animal-card");
    card.type = "button";
    card.setAttribute("aria-label", animal.name + "，查看详情");
    card.appendChild(el("span", "card-emoji", animal.emoji));
    card.appendChild(el("span", "card-name", animal.name));
    card.appendChild(el("span", "card-hint", "点我看秘密 ✨"));
    card.addEventListener("click", function () {
      location.hash = "#/animal/" + animal.id;
    });

    li.appendChild(card);
    grid.appendChild(li);
    items.push({ animal: animal, li: li });
  });

  // ---------- 搜索与分类筛选 ----------
  var searchInput = $("searchInput");
  var chipBar = $("chipBar");
  var emptyTip = $("emptyTip");
  var activeCategory = "all";

  function buildChips() {
    var seen = [];
    ANIMALS.forEach(function (a) {
      if (seen.indexOf(a.category) === -1) seen.push(a.category);
    });
    var defs = [{ value: "all", label: "全部" }].concat(
      seen.map(function (c) {
        return { value: c, label: CATEGORY_LABELS[c] || c };
      })
    );
    defs.forEach(function (def, i) {
      var chip = el("button", i === 0 ? "chip is-active" : "chip", def.label);
      chip.type = "button";
      chip.dataset.value = def.value;
      chip.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      chip.addEventListener("click", function () {
        activeCategory = def.value;
        Array.prototype.forEach.call(chipBar.children, function (c) {
          var on = c.dataset.value === def.value;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", on ? "true" : "false");
        });
        applyFilters();
      });
      chipBar.appendChild(chip);
    });
  }

  function applyFilters() {
    var q = searchInput.value.trim().toLowerCase();
    var visible = 0;
    items.forEach(function (item) {
      var a = item.animal;
      var matchQuery =
        !q ||
        a.name.indexOf(q) !== -1 ||
        (a.nameEn || "").toLowerCase().indexOf(q) !== -1;
      var matchCategory =
        activeCategory === "all" || a.category === activeCategory;
      var show = matchQuery && matchCategory;
      item.li.hidden = !show;
      if (show) visible++;
    });
    emptyTip.hidden = visible !== 0;
  }

  buildChips();
  searchInput.addEventListener("input", applyFilters);

  // ---------- 详情弹窗（原生 <dialog>：焦点圈闭 + Esc） ----------
  var dialog = $("modal");
  var modalEmoji = $("modalEmoji");
  var modalName = $("modalName");
  var modalNameEn = $("modalNameEn");
  var modalMeta = $("modalMeta");
  var modalFacts = $("modalFacts");
  var modalMedia = $("modalMedia");
  var modalClose = $("modalClose");
  var lastTrigger = null;

  function renderDetail(animal) {
    modalEmoji.textContent = animal.emoji;
    modalName.textContent = animal.name;
    modalNameEn.textContent = animal.nameEn || "";
    modalNameEn.hidden = !animal.nameEn;

    modalMeta.textContent = "";
    modalMeta.appendChild(
      el("span", "badge badge-cat", CATEGORY_LABELS[animal.category] || animal.category)
    );
    (animal.habitat || []).forEach(function (h) {
      modalMeta.appendChild(el("span", "badge badge-habitat", h));
    });
    if (animal.conservation) {
      modalMeta.appendChild(
        el("span", "badge badge-conservation", "保护级别：" + animal.conservation)
      );
    }

    modalFacts.textContent = "";
    (animal.facts || []).forEach(function (fact) {
      modalFacts.appendChild(el("li", null, fact));
    });

    modalMedia.textContent = "";
    if (animal.image) {
      var img = document.createElement("img");
      img.className = "modal-img";
      img.src = animal.image;
      img.alt = animal.name + "的照片";
      img.loading = "lazy";
      modalMedia.appendChild(img);
    }
    if (animal.soundUrl) {
      var audio = document.createElement("audio");
      audio.className = "modal-audio";
      audio.controls = true;
      audio.src = animal.soundUrl;
      modalMedia.appendChild(audio);
    }
    modalMedia.hidden = !modalMedia.childElementCount;
  }

  function openDialog(animal, trigger) {
    renderDetail(animal);
    lastTrigger = trigger || document.activeElement;
    document.title = animal.name + " · 可爱动物园";
    if (!dialog.open) dialog.showModal();
  }

  function leaveAnimalRoute() {
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    if (dialog.open) dialog.close();
  }

  function parseRoute() {
    var m = location.hash.match(ANIMAL_ROUTE);
    return m ? m[1] : null;
  }

  dialog.addEventListener("close", function () {
    document.title = defaultTitle;
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
    lastTrigger = null;
  });

  dialog.addEventListener("cancel", function (e) {
    e.preventDefault();
    leaveAnimalRoute();
  });

  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) leaveAnimalRoute();
  });

  modalClose.addEventListener("click", leaveAnimalRoute);

  // ---------- hash 路由 #/animal/:id ----------
  function parseRoute() {
    var m = location.hash.match(ANIMAL_ROUTE);
    return m ? m[1] : null;
  }

  window.addEventListener("hashchange", function () {
    var id = parseRoute();
    if (id && byId[id]) {
      if (!dialog.open) openDialog(byId[id]);
      else renderDetail(byId[id]);
    } else if (dialog.open) {
      leaveAnimalRoute();
    }
  });

  var initialId = parseRoute();
  if (initialId && byId[initialId]) {
    openDialog(byId[initialId]);
  } else if (initialId) {
    history.replaceState(null, "", location.pathname + location.search);
  }

  // ---------- 英雄区随机切换表情 ----------
  var heroEmoji = $("heroEmoji");
  var heroPool = ANIMALS.map(function (a) {
    return a.emoji;
  });
  var heroIndex = 0;
  heroEmoji.addEventListener("click", function () {
    heroIndex = (heroIndex + 1) % heroPool.length;
    heroEmoji.textContent = heroPool[heroIndex];
  });
})();
