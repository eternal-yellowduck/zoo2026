(function () {
  "use strict";

  var ANIMAL_ROUTE = /^#\/animal\/([a-z0-9-]+)$/;
  var FAV_KEY = "cuteZoo.favorites";
  var THEME_KEY = "cuteZoo.theme";
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

  // ---------- localStorage 安全封装 ----------
  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* 存储不可用（如无痕模式）时静默降级 */
    }
  }

  // ---------- 收藏（localStorage，跨会话保留） ----------
  function loadFavorites() {
    var raw = readStorage(FAV_KEY);
    if (!raw) return {};
    try {
      var arr = JSON.parse(raw);
      var map = {};
      if (Array.isArray(arr)) {
        arr.forEach(function (id) {
          if (typeof id === "string") map[id] = true;
        });
      }
      return map;
    } catch (e) {
      return {};
    }
  }

  var favorites = loadFavorites();

  function saveFavorites() {
    var ids = Object.keys(favorites).filter(function (id) {
      return favorites[id];
    });
    ids.sort();
    writeStorage(FAV_KEY, JSON.stringify(ids));
  }

  function isFavorite(id) {
    return !!favorites[id];
  }

  function toggleFavorite(id) {
    if (favorites[id]) delete favorites[id];
    else favorites[id] = true;
    saveFavorites();
    refreshFavButtons();
    applyFilters();
  }

  var byId = {};
  ANIMALS.forEach(function (a) {
    byId[a.id] = a;
  });

  var defaultTitle = document.title;

  // ---------- 卡片渲染（createElement + textContent） ----------
  var grid = $("animalGrid");
  var items = [];

  function syncFavButton(btn, animal) {
    var faved = isFavorite(animal.id);
    btn.textContent = faved ? "♥" : "♡";
    btn.classList.toggle("is-faved", faved);
    btn.setAttribute("aria-pressed", faved ? "true" : "false");
    btn.setAttribute("aria-label", (faved ? "取消收藏 " : "收藏 ") + animal.name);
  }

  function refreshFavButtons() {
    items.forEach(function (item) {
      var btn = item.li.querySelector(".fav-btn");
      if (btn) syncFavButton(btn, item.animal);
    });
    if (currentAnimal) syncFavButton(modalFav, currentAnimal);
  }

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

    var favBtn = el("button", "fav-btn");
    favBtn.type = "button";
    favBtn.addEventListener("click", function () {
      toggleFavorite(animal.id);
    });
    syncFavButton(favBtn, animal);

    li.appendChild(card);
    li.appendChild(favBtn);
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
    var defs = [
      { value: "all", label: "全部" },
      { value: "fav", label: "♥ 收藏" },
    ].concat(
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
        activeCategory === "all" ||
        (activeCategory === "fav"
          ? isFavorite(a.id)
          : a.category === activeCategory);
      var show = matchQuery && matchCategory;
      item.li.hidden = !show;
      if (show) visible++;
    });
    if (visible === 0 && activeCategory === "fav" && !q) {
      emptyTip.textContent = "还没有收藏的小动物，点卡片右上角的小心心收一只吧～";
    } else {
      emptyTip.textContent = "没有找到匹配的小动物，换个关键词试试吧～";
    }
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
  var modalFav = $("modalFav");
  var lastTrigger = null;
  var currentAnimal = null;

  function stopModalAudio() {
    Array.prototype.forEach.call(
      modalMedia.querySelectorAll("audio"),
      function (audio) {
        try {
          audio.pause();
        } catch (e) {
          /* 忽略暂停失败 */
        }
      }
    );
  }

  function renderDetail(animal) {
    currentAnimal = animal;
    stopModalAudio();
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
      audio.preload = "none";
      audio.src = animal.soundUrl;
      audio.setAttribute("aria-label", animal.name + "的叫声");
      modalMedia.appendChild(audio);
    }
    modalMedia.hidden = !modalMedia.childElementCount;

    syncFavButton(modalFav, animal);
  }

  function openDialog(animal, trigger) {
    renderDetail(animal);
    lastTrigger = trigger || document.activeElement;
    document.title = animal.name + " · 可爱动物园";
    if (!dialog.open) dialog.showModal();
  }

  function leaveAnimalRoute() {
    stopModalAudio();
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

  modalFav.addEventListener("click", function () {
    if (currentAnimal) toggleFavorite(currentAnimal.id);
  });

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

  // ---------- 深色模式：跟随系统 + 手动切换，持久化偏好 ----------
  var themeToggle = $("themeToggle");
  var schemeMedia =
    window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "切换到浅色模式" : "切换到深色模式"
    );
  }

  applyTheme(currentTheme());

  themeToggle.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    writeStorage(THEME_KEY, next);
    applyTheme(next);
  });

  if (schemeMedia) {
    var onSchemeChange = function (e) {
      var stored = readStorage(THEME_KEY);
      if (stored !== "light" && stored !== "dark") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };
    if (typeof schemeMedia.addEventListener === "function") {
      schemeMedia.addEventListener("change", onSchemeChange);
    } else if (typeof schemeMedia.addListener === "function") {
      schemeMedia.addListener(onSchemeChange);
    }
  }

  // ---------- 每日一动物：按日期确定性选取 ----------
  var DAY_MS = 86400000;
  var dailySection = $("dailySection");
  var dailyEmoji = $("dailyEmoji");
  var dailyName = $("dailyName");
  var dailyFact = $("dailyFact");
  var dailyOpen = $("dailyOpen");
  var now = new Date();
  var dayNumber = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS
  );
  var dailyAnimal = ANIMALS[((dayNumber % ANIMALS.length) + ANIMALS.length) % ANIMALS.length];

  dailyEmoji.textContent = dailyAnimal.emoji;
  dailyName.textContent = dailyAnimal.name;
  dailyFact.textContent =
    (dailyAnimal.facts && dailyAnimal.facts[0]) || "";
  dailySection.hidden = false;
  dailyOpen.setAttribute(
    "aria-label",
    "查看今日动物" + dailyAnimal.name + "的详情"
  );
  dailyOpen.addEventListener("click", function () {
    location.hash = "#/animal/" + dailyAnimal.id;
  });
})();
