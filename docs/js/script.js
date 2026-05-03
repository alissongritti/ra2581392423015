// Carregar projetos do JSON
let projetos = [];

fetch("projetos.json")
  .then((response) => response.json())
  .then((data) => {
    projetos = data;
    renderizarProjetos();
  })
  .catch((error) => {
    console.error("Erro ao carregar projetos:", error);
    document.getElementById("projetos-container").innerHTML =
      "<p>Erro ao carregar projetos.</p>";
  });

const habilidades = [
  "JavaScript",
  "TypeScript",
  "HTML/CSS",
  "React",
  "React Native",
  "Node.js",
  "PostgreSQL",
  "Git",
  "Docker",
  "Figma",
];

// Guarda o índice atual de cada carrossel: { projetoId: indiceAtual }
const carrosselState = {};

function renderizarCarrossel(projeto) {
  const imagens = projeto.imagens || [];
  const temCarrossel = imagens.length > 1;
  const idCarrossel = `carrossel-${projeto.id}`;

  if (!temCarrossel) {
    const src = imagens[0] || "img/projetos/placeholder.png";
    return `
      <div class="carrossel-wrapper">
        <img src="${src}" alt="Imagem do projeto ${projeto.titulo}"
             class="projeto-imagem"
             data-imagem-grande="${src}"
             onerror="this.src='img/projetos/placeholder.png'; this.onerror=null;" />
      </div>
    `;
  }

  // Inicializa estado do carrossel
  if (carrosselState[projeto.id] === undefined) {
    carrosselState[projeto.id] = 0;
  }

  const dots = imagens
    .map(
      (_, i) =>
        `<span class="carrossel-dot ${i === 0 ? "active" : ""}" data-id="${projeto.id}" data-index="${i}"></span>`,
    )
    .join("");

  const imgs = imagens
    .map(
      (src, i) =>
        `<img src="${src}" alt="Imagem ${i + 1} do projeto ${projeto.titulo}"
              class="projeto-imagem carrossel-slide ${i === 0 ? "active" : ""}"
              data-imagem-grande="${src}"
              data-carrossel-id="${projeto.id}"
              data-slide-index="${i}"
              onerror="this.src='img/projetos/placeholder.png'; this.onerror=null;" />`,
    )
    .join("");

  return `
    <div class="carrossel-wrapper" id="${idCarrossel}">
      ${imgs}
      <button class="carrossel-btn carrossel-prev" data-id="${projeto.id}" aria-label="Anterior">&#8249;</button>
      <button class="carrossel-btn carrossel-next" data-id="${projeto.id}" aria-label="Próximo">&#8250;</button>
      <div class="carrossel-dots">${dots}</div>
    </div>
  `;
}

function mudarSlide(projetoId, direcao) {
  const projeto = projetos.find((p) => p.id === projetoId);
  if (!projeto) return;

  const total = projeto.imagens.length;
  const atual = carrosselState[projetoId] || 0;
  const novo = (atual + direcao + total) % total;
  carrosselState[projetoId] = novo;

  // Atualiza imagens visíveis
  const slides = document.querySelectorAll(
    `[data-carrossel-id="${projetoId}"]`,
  );
  slides.forEach((img) => img.classList.remove("active"));
  const slideAtivo = document.querySelector(
    `[data-carrossel-id="${projetoId}"][data-slide-index="${novo}"]`,
  );
  if (slideAtivo) slideAtivo.classList.add("active");

  // Atualiza dots
  const dots = document.querySelectorAll(
    `.carrossel-dot[data-id="${projetoId}"]`,
  );
  dots.forEach((d) => d.classList.remove("active"));
  const dotAtivo = document.querySelector(
    `.carrossel-dot[data-id="${projetoId}"][data-index="${novo}"]`,
  );
  if (dotAtivo) dotAtivo.classList.add("active");
}

function irParaSlide(projetoId, index) {
  const atual = carrosselState[projetoId] || 0;
  const direcao = index - atual;
  // Usa mudarSlide com diferença direta, ou recalcula
  carrosselState[projetoId] = index;

  const slides = document.querySelectorAll(
    `[data-carrossel-id="${projetoId}"]`,
  );
  slides.forEach((img) => img.classList.remove("active"));
  const slideAtivo = document.querySelector(
    `[data-carrossel-id="${projetoId}"][data-slide-index="${index}"]`,
  );
  if (slideAtivo) slideAtivo.classList.add("active");

  const dots = document.querySelectorAll(
    `.carrossel-dot[data-id="${projetoId}"]`,
  );
  dots.forEach((d) => d.classList.remove("active"));
  const dotAtivo = document.querySelector(
    `.carrossel-dot[data-id="${projetoId}"][data-index="${index}"]`,
  );
  if (dotAtivo) dotAtivo.classList.add("active");
}

function renderizarProjetos(filter = "all") {
  const projetosContainer = document.getElementById("projetos-container");
  projetosContainer.innerHTML = "";

  const projetosFiltrados =
    filter === "all"
      ? projetos
      : projetos.filter((p) => p.categoria === filter);

  if (projetosFiltrados.length === 0) {
    projetosContainer.innerHTML =
      "<p>Nenhum projeto encontrado nesta categoria.</p>";
    return;
  }

  projetosFiltrados.forEach((projeto) => {
    const projetoElement = document.createElement("div");
    projetoElement.className = "projeto";
    projetoElement.innerHTML = `
      ${projeto.semestre ? `<span class="projeto-semestre">${projeto.semestre}</span>` : ""}
      ${renderizarCarrossel(projeto)}
      <h3>${projeto.titulo}</h3>
      <p class="projeto-meta"><strong>Disciplina:</strong> ${projeto.disciplina}</p>
      <p class="projeto-desc">${projeto.descricao}</p>
      <div class="projeto-tags">
        ${projeto.tecnologias.map((tech) => `<span class="projeto-tag">${tech}</span>`).join("")}
      </div>
      <a href="${projeto.link}" target="_blank" class="btn">Ver no GitHub</a>
    `;
    projetosContainer.appendChild(projetoElement);
  });
}

function renderizarHabilidades() {
  const skillsContainer = document.getElementById("skills-container");
  habilidades.forEach((habilidade) => {
    const skillElement = document.createElement("span");
    skillElement.className = "skill-item";
    skillElement.textContent = habilidade;
    skillsContainer.appendChild(skillElement);
  });
}

function setupFiltros() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderizarProjetos(button.getAttribute("data-filter"));
    });
  });
}

function setupCarrossel() {
  // Delegação de eventos no container para botões e dots
  document
    .getElementById("projetos-container")
    .addEventListener("click", (e) => {
      // Botão anterior
      if (e.target.classList.contains("carrossel-prev")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        mudarSlide(id, -1);
        return;
      }
      // Botão próximo
      if (e.target.classList.contains("carrossel-next")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        mudarSlide(id, 1);
        return;
      }
      // Dot de navegação
      if (e.target.classList.contains("carrossel-dot")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        const index = parseInt(e.target.getAttribute("data-index"));
        irParaSlide(id, index);
        return;
      }
      // Lightbox — abre imagem ativa
      if (e.target.classList.contains("projeto-imagem")) {
        const modal = document.getElementById("modal-imagem");
        const modalImg = document.getElementById("modal-conteudo");
        modalImg.src = e.target.getAttribute("data-imagem-grande");
        modal.style.display = "block";
      }
    });
}

function setupBackToTop() {
  const backToTopButton = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTopButton.style.display = window.pageYOffset > 300 ? "flex" : "none";
  });
  backToTopButton.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

function atualizarAno() {
  document.getElementById("current-year").textContent =
    new Date().getFullYear();
}

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const targetElement = document.querySelector(anchor.getAttribute("href"));
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 20,
          behavior: "smooth",
        });
        history.pushState(null, null, anchor.getAttribute("href"));
      }
    });
  });
}

function setupLightbox() {
  const modal = document.getElementById("modal-imagem");
  const closeBtn = document.getElementById("modal-fechar");
  closeBtn.onclick = () => (modal.style.display = "none");
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  renderizarProjetos();
  renderizarHabilidades();
  setupFiltros();
  setupCarrossel();
  setupBackToTop();
  atualizarAno();
  setupSmoothScrolling();
  setupLightbox();
  console.log("Portfólio carregado com sucesso!");
});
