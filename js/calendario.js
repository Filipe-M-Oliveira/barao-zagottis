fetch('../data/copa_2026.json')

    .then(response => response.json())
    .then(jogos => {
        const container = document.getElementById("lista-jogos");
        // agrupar por data
        const jogosPorData = {};

        jogos.forEach(jogo => {
            const agora = new Date();
            const dataJogo = new Date(`${jogo.data}T${jogo.horario}`);
            // remove jogos passados
            const duracaoJogo = 2 * 60 * 60 * 1000; // 2 horas
            const fimJogo = new Date(dataJogo.getTime() + duracaoJogo);
            if (fimJogo < agora) return;
            if (!jogosPorData[jogo.data]) {
                jogosPorData[jogo.data] = [];
            }
            jogosPorData[jogo.data].push(jogo);
        });
        // criar HTML
        Object.keys(jogosPorData).forEach(data => {
            // ordena os jogos do dia
            jogosPorData[data].sort((a, b) =>
                b.horario.localeCompare(a.horario)
            );
            const divDia = document.createElement("div");
            divDia.classList.add("dia");

            const titulo = document.createElement("h3");
            titulo.textContent = formatarData(data);
            divDia.appendChild(titulo);

            jogosPorData[data].forEach(jogo => {
                const divJogo = document.createElement("div");
                divJogo.classList.add("jogo");
                const agora = new Date();
                // tempo de duas horas
                const duracaoJogo = 2 * 60 * 60 * 1000;
                const inicio = new Date(`${jogo.data}T${jogo.horario}`);
                const fim = new Date(inicio.getTime() + duracaoJogo);
                // se esta ao vivo
                if (agora >= inicio && agora <= fim) {
                    divJogo.classList.add("ao-vivo");
                }
                // destaque se tiver Brasil
                if (
                    jogo.time_casa.includes("Brasil") ||
                    jogo.time_fora.includes("Brasil")
                ) {
                    divJogo.classList.add("destaque");
                }
                divJogo.innerHTML = `
        <span class="hora">${jogo.horario}</span>
        ⚽ ${jogo.time_casa} vs ${jogo.time_fora}
        <span class="grupo">Grupo ${jogo.grupo}</span>
        `;
                divDia.appendChild(divJogo);
            });
            container.appendChild(divDia);
        });
    });

// função pra formatar data
function formatarData(dataISO) {
    const data = new Date(dataISO);

    return data.toLocaleDateString("pt-BR", {
        day: '2-digit',
        month: '2-digit',
        weekday: 'long'
    });
}