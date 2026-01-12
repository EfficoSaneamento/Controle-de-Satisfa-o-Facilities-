const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzszaQ3oi9jzsCUkoHKv4OBxcW6Bs65Zx7vFv4jtgQZD03sUdX6rjPMuzVHe7hGXWalAg/exec";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("perguntas-container");
  const form = document.getElementById("nps-form");
  const statusBox = document.getElementById("status");

  const perguntas = [
    {
      titulo: "Avaliação Geral",
      pergunta: "De forma geral, como você avalia a área de Facilities?",
      name: "avaliacao_geral",
    },
    {
      titulo: "Ambiente de Trabalho",
      pergunta: "Os serviços de Facilities contribuem para um ambiente de trabalho adequado e produtivo?",
      name: "ambiente_trabalho",
    },
    {
      titulo: "Limpeza",
      pergunta: "Como você avalia a limpeza e conservação dos ambientes?",
      name: "limpeza",
    },
    {
      titulo: "Manutenção",
      pergunta: "Como você avalia a manutenção predial (elétrica, hidráulica, ar-condicionado etc.)?",
      name: "manutencao",
    },
    {
      titulo: "Atendimento",
      pergunta: "A equipe de Facilities é acessível e cordial?",
      name: "atendimento",
    }
  ];

  perguntas.forEach((p, index) => {
    const section = document.createElement("section");
    section.className = "question";
    section.style.display = index === 0 ? "block" : "none";

    section.innerHTML = `
      <h2>${p.titulo}</h2>

      <label>${p.pergunta}</label>

      <div class="nps-scale">
        ${Array.from({ length: 11 }, (_, i) => `
          <label>
            ${i}
            <input type="radio" name="${p.name}" value="${i}" required>
          </label>
        `).join("")}
      </div>

      <div class="justificativa" style="display:none;">
        <label>Por favor, justifique sua nota:</label>
        <textarea name="${p.name}_justificativa"></textarea>
      </div>
    `;

    container.appendChild(section);

    const radios = section.querySelectorAll(`input[type="radio"]`);
    const justificativa = section.querySelector(".justificativa");

    radios.forEach(radio => {
      radio.addEventListener("change", () => {
        const valor = Number(radio.value);

        // Mostra justificativa se nota <= 3
        if (valor <= 3) {
          justificativa.style.display = "block";
          justificativa.querySelector("textarea").required = true;
        } else {
          justificativa.style.display = "none";
          justificativa.querySelector("textarea").required = false;
        }

        // Mostra próxima pergunta
        const proxima = container.children[index + 1];
        if (proxima) {
          proxima.style.display = "block";
          proxima.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  });

  // ENVIO DO FORMULÁRIO
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusBox.textContent = "Enviando sua avaliação...";
    statusBox.className = "";

    const formData = new FormData(form);
    const body = new URLSearchParams(formData);

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: body.toString()
      });

      const data = await response.json();

      if (data.ok) {
        statusBox.textContent = "Avaliação enviada com sucesso!";
        statusBox.className = "success";
        form.reset();
      } else {
        statusBox.textContent = "Erro ao enviar avaliação.";
        statusBox.className = "error";
      }

    } catch (err) {
      statusBox.textContent = "Erro ao enviar. Tente novamente.";
      statusBox.className = "error";
    }
  });
});

