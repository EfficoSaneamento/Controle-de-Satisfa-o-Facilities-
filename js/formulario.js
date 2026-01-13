const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzszaQ3oi9jzsCUkoHKv4OBxcW6Bs65Zx7vFv4jtgQZD03sUdX6rjPMuzVHe7hGXWalAg/exec";

const perguntas = [
  { titulo: "Avaliação Geral", texto: "Como você avalia a área de Facilities?", nome: "avaliacao_geral" },
  { titulo: "Ambiente", texto: "Os serviços contribuem para um ambiente produtivo?", nome: "ambiente" },
  { titulo: "Limpeza", texto: "Como avalia a limpeza dos ambientes?", nome: "limpeza" },
  { titulo: "Manutenção", texto: "Como avalia a manutenção predial?", nome: "manutencao" },
  { titulo: "Atendimento", texto: "A equipe é acessível e cordial?", nome: "atendimento" }
];

const container = document.getElementById("perguntas-container");
const form = document.getElementById("nps-form");
const statusBox = document.getElementById("status");

perguntas.forEach((p, index) => {
  const section = document.createElement("section");

  section.innerHTML = `
    <h2>${p.titulo}</h2>
    <label>${p.texto}</label>

    <div class="nps-scale">
      ${[1,2,3,4,5].map(v => `
        <label>
          ${v}
          <input type="radio" name="${p.nome}" value="${v}" required>
        </label>
      `).join("")}
    </div>

    <div class="justificativa">
      <label>Por favor, justifique sua avaliação:</label>
      <textarea name="${p.nome}_justificativa"></textarea>
    </div>
  `;

  container.appendChild(section);
  if (index === 0) section.style.display = "block";

  const radios = section.querySelectorAll("input[type=radio]");
  const justificativa = section.querySelector(".justificativa");
  const textarea = justificativa.querySelector("textarea");

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      const nota = Number(radio.value);

      if (nota < 3) {
        justificativa.style.display = "block";
        textarea.required = true;
        textarea.addEventListener("input", liberarProxima);
      } else {
        justificativa.style.display = "none";
        textarea.required = false;
        liberarProxima();
      }

      function liberarProxima() {
        if (nota >= 3 || textarea.value.trim().length > 5) {
          const proxima = container.children[index + 1];
          if (proxima) {
            proxima.style.display = "block";
            proxima.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    });
  });
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  statusBox.textContent = "Enviando...";

  const data = new URLSearchParams(new FormData(form));

  try {
    await fetch(WEB_APP_URL, {
      method: "POST",
      body: data
    });

    statusBox.textContent = "Pesquisa enviada com sucesso!";
  } catch {
    statusBox.textContent = "Erro ao enviar. Tente novamente.";
  }
});


