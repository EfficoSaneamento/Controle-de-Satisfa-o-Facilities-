const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzszaQ3oi9jzsCUkoHKv4OBxcW6Bs65Zx7vFv4jtgQZD03sUdX6rjPMuzVHe7hGXWalAg/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nps-form");
  const container = document.getElementById("perguntas-container");
  const statusBox = document.getElementById("status");

  const escala15 = (name, na = false) => `
    <div style="display:flex; gap:12px; margin:8px 0; flex-wrap:wrap;">
      ${[1,2,3,4,5].map(v => `
        <label><input type="radio" name="${name}" value="${v}" required> ${v}</label>
      `).join("")}
      ${na ? `<label><input type="radio" name="${name}" value="NA"> Não se aplica</label>` : ""}
    </div>
  `;

  container.innerHTML = `
    <h2>Pesquisa de Satisfação – Área de Facilities</h2>

    <h3>1. Avaliação Geral</h3>
    <p>De forma geral, qual é o seu nível de satisfação com a área de Facilities?</p>
    ${escala15("geral")}
    <textarea name="geral_comentario" placeholder="Se sua nota foi 1, 2 ou 3, explique o motivo"
      style="width:100%; min-height:80px;"></textarea>

    <p>Os serviços de Facilities contribuem para que você realize seu trabalho com conforto e segurança?</p>
    ${escala15("conforto_seguranca")}

    <h3>2. Avaliação dos Serviços</h3>
    <p>Limpeza e conservação</p>${escala15("limpeza")}
    <p>Manutenção predial</p>${escala15("manutencao")}
    <p>Organização e conforto dos espaços</p>${escala15("organizacao")}
    <p>Infraestrutura</p>${escala15("infraestrutura")}
    <p>Copa / Refeitório</p>${escala15("copa", true)}
    <p>Segurança patrimonial</p>${escala15("seguranca", true)}

    <textarea name="servicos_comentario"
      placeholder="Explique se avaliou algum serviço com nota 1, 2 ou 3"
      style="width:100%; min-height:80px;"></textarea>

    <h3>3. Atendimento e Comunicação</h3>
    <p>Cordialidade da equipe</p>${escala15("cordialidade")}
    <p>Prazo de atendimento</p>${escala15("prazo")}
    <p>Clareza da comunicação</p>${escala15("comunicacao")}
    <p>Facilidade de acionamento</p>${escala15("facilidade")}

    <textarea name="atendimento_comentario"
      placeholder="Explique se avaliou algum item com nota 1, 2 ou 3"
      style="width:100%; min-height:80px;"></textarea>

    <h3>4. Prioridades</h3>
    <p>Selecione até 3 serviços mais críticos</p>
    ${["Limpeza","Manutenção","Infraestrutura","Segurança","Atendimento","Frota","Telefonia","Agendamento de Viagens"]
      .map(v => `<label><input type="checkbox" name="prioridades" value="${v}"> ${v}</label><br>`).join("")}

    <textarea name="area_melhoria" placeholder="Qual serviço mais precisa de melhorias?"
      style="width:100%; min-height:80px;"></textarea>

    <h3>5. Avaliação Final</h3>
    <textarea name="manter" placeholder="O que deveria ser mantido?"
      style="width:100%; min-height:80px;"></textarea>

    <textarea name="mudar" placeholder="Se pudesse mudar uma coisa, o que seria?"
      style="width:100%; min-height:80px;"></textarea>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusBox.textContent = "Enviando...";

    const body = new URLSearchParams(new FormData(form));
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });

    const data = await res.json();
    if (data.ok) window.location.href = "agradecimento.html";
    else statusBox.textContent = "Erro ao enviar";
  });
});

