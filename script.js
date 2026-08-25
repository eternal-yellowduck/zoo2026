// 渲染动物卡片
const grid = document.getElementById("animalGrid");
const heroEmoji = document.getElementById("heroEmoji");

ANIMALS.forEach((animal, index) => {
  const li = document.createElement("li");
  li.className = "animal-card";
  li.tabIndex = 0;
  li.setAttribute("role", "button");
  li.setAttribute("aria-label", `${animal.name}，查看小秘密`);
  li.innerHTML = `
    <div class="card-emoji">${animal.emoji}</div>
    <p class="card-name">${animal.name}</p>
    <p class="card-hint">点我看秘密 ✨</p>
  `;
  const open = () => openModal(animal);
  li.addEventListener("click", open);
  li.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });
  grid.appendChild(li);
});

// 英雄区随机切换表情
const heroPool = ANIMALS.map((a) => a.emoji);
let heroIndex = 0;
heroEmoji.addEventListener("click", () => {
  heroIndex = (heroIndex + 1) % heroPool.length;
  heroEmoji.textContent = heroPool[heroIndex];
});

// 弹窗逻辑
const modal = document.getElementById("modal");
const modalEmoji = document.getElementById("modalEmoji");
const modalName = document.getElementById("modalName");
const modalFact = document.getElementById("modalFact");
const modalClose = document.getElementById("modalClose");

function openModal(animal) {
  modalEmoji.textContent = animal.emoji;
  modalName.textContent = animal.name;
  modalFact.textContent = animal.fact;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
