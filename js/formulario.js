const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyvfjsPVf7W2tM0HLJ6VeJuDElcbTKQGLPyoFJ6KNBEGlt2AFfmXe3HW1UloJBVctol_Q/exec";

// 🔹 Tokens válidos
const TOKEN_MAP = {
  "FACILITIES": "FACILITIES",
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script carregado");

  const qs = new URLSearchParams(window.location.search);
  const token = qs.get("token")
    ?.trim()
    .toUpperCase()
    .replace(/[()|]/g, "")
    .replace(/\s+/g, "") || "";

  console.log("🔑 Token recebido:", token);

  const departamento = TOKEN_MAP[token];
  if (!departamento) {
    alert("Token inválido. Verifique o link de acesso.");
    return;
  }

  const form = document.getElementById("nps-form");
  const statusBox = document.getElementById("status");
  const container = document.getElementById("perguntas-container");

  // Campo oculto
  document.getElementById("token").value = token;

  // 🔹 Geração do formulário
  const section = document.createElement("section");
  section.innerHTML = `
    <h2 style="font-size: 1.6rem; margin-bottom: 1rem;">
      Avaliação da Equipe de Facilities
    </h2>

    <!-- Pergunta NPS -->
    <label style="font-weight:600;">
      1. Em uma escala de 0 a 10, o quanto você recomendaria a equipe de Facilities para um colega de trabalho?
    </label>

    <div class="nps-scale" style="display:flex; flex-wrap:wrap; justify-content:space-between; margin:1rem 0;">
      ${Array.from({ length: 11 }, (_, i) => `
        <label style="flex:1 0 8%; text-align:center;">
          ${i}<br>
          <input type="radio" name="nps_facilities" value="${i}" required>
        </label>
      `).join("")}
    </div>

    <!-- Motivo da nota -->
    <label style="font-weight:600;">
      2. O que mais influenciou a nota que você deu?
    </label>
    <textarea
      name="motivo_nota"
      placeholder="Explique o motivo da sua avaliação"
      style="width:100%; min-height:110px; margin-top:6px; padding:10px;"
      required
    ></textarea>

    <!-- Pontos fortes -->
    <label style="font-weight:600; margin-top:1rem;">
      3. Quais são os principais pontos fortes da equipe de Facilities?
    </label>
    <textarea
      name="pontos_fortes"
      placeholder="Ex.: agilidade, cordialidade, organização..."
      style="width:100%; min-height:110px; margin-top:6px; padding:10px;"
    ></textarea>

    <!-- Oportunidades de melhoria -->
    <label style="font-weight:600; margin-top:1rem;">
      4. O que a equipe de Facilities poderia melhorar?
    </label>
    <textarea
      name="oportunidades_melhoria"
      placeholder="Sua sugestão é muito importante"
      style="width:100%; min-height:110px; margin-top:6px; padding:10px;"
    ></textarea>

    <!-- Comentário final -->
    <label style="font-weight:600; margin-top:1rem;">
      5. Deseja deixar algum comentário, sugestão ou elogio adicional?
    </label>
    <textarea
      name="comentario_final"
      placeholder="Espaço livre para comentários"
      style="width:100%; min-height:110px; margin-top:6px; padding:10px;"
    ></textarea>
  `;

  container.appendChild(section);

  // 🔹 Envio do formulário
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
      console.log("📨 Resposta:", data);

      if (data.ok) {
        window.location.href = "agradecimento.html";
      } else {
        statusBox.textContent = "⚠️ Erro: " + (data.error || "Erro desconhecido");
        statusBox.className = "error";
      }

    } catch (err) {
      console.error("❌ Erro:", err);
      statusBox.textContent = "❌ Falha ao enviar. Tente novamente.";
      statusBox.className = "error";
    }
  });
});

