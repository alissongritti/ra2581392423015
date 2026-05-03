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

const habilidades = ["JavaScript", "HTML/CSS", "React", "PostgreSQL", "Git"];

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
      <img src="${projeto.imagem}" alt="Imagem do projeto ${projeto.titulo}"
           class="projeto-imagem" data-imagem-grande="${projeto.imagem}" />
      <h3>${projeto.titulo}</h3>
      <p class="projeto-meta"><strong>Disciplina:</strong> ${
        projeto.disciplina
      }</p>
      <p class="projeto-desc">${projeto.descricao}</p>
      <div class="projeto-tags">
        ${projeto.tecnologias
          .map((tech) => `<span class="projeto-tag">${tech}</span>`)
          .join("")}
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

function setupBackToTop() {
  const backToTopButton = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTopButton.style.display = window.pageYOffset > 300 ? "flex" : "none";
  });
  backToTopButton.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
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

// Setup lightbox
function setupLightbox() {
  const modal = document.getElementById("modal-imagem");
  const modalImg = document.getElementById("modal-conteudo");
  const closeBtn = document.getElementById("modal-fechar");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("projeto-imagem")) {
      modalImg.src = e.target.getAttribute("data-imagem-grande");
      modal.style.display = "block";
    }
  });

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
  setupBackToTop();
  atualizarAno();
  setupSmoothScrolling();
  setupLightbox();
  console.log("Portfólio carregado com sucesso!");
});
