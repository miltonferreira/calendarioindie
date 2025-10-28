const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfHOQtt3_7NqBgFy5QO8w2-p7dn6iWH79NM-bpcGV67wey_w0L0778o431lFFMOBGweAwiPsBvwoDx/pub?output=csv"; // link público do Google Sheets CSV
let allData = [];

const estadoFilter = document.getElementById('estadoFilter');
const cidadeFilter = document.getElementById('cidadeFilter');
const tbody = document.querySelector('#calendar tbody');

async function loadCSV() {
    const response = await fetch(csvUrl);
    const data = await response.text();

    const rows = data.split('\n').slice(1); // remove cabeçalho
    allData = rows
        .map(row => row.split(','))
        .filter(row => row.length === 5)
        .map(row => ({
            estado: row[0].trim(),
            cidade: row[1].trim(),
            data: new Date(row[2].trim()),
            descricao: row[3].trim(),
            valor: row[4].trim()
        }))
        .sort((a, b) => a.data - b.data); // ordena por data

    populateFilters();
    renderTable();
}

function populateFilters() {
    const estados = [...new Set(allData.map(d => d.estado))].sort();
    const cidades = [...new Set(allData.map(d => d.cidade))].sort();

    estados.forEach(e => {
        const option = document.createElement('option');
        option.value = e;
        option.textContent = e;
        estadoFilter.appendChild(option);
    });

    cidades.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        cidadeFilter.appendChild(option);
    });
}

function renderTable() {
    tbody.innerHTML = '';
    const estadoVal = estadoFilter.value;
    const cidadeVal = cidadeFilter.value;

    const filtered = allData.filter(d => 
        (estadoVal === '' || d.estado === estadoVal) &&
        (cidadeVal === '' || d.cidade === cidadeVal)
    );

    filtered.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.estado}</td>
            <td>${d.cidade}</td>
            <td>${d.data.toLocaleDateString('pt-BR')}</td>
            <td>${d.descricao}</td>
            <td>${d.valor}</td>
        `;
        tbody.appendChild(tr);
    });
}

estadoFilter.addEventListener('change', renderTable);
cidadeFilter.addEventListener('change', renderTable);


loadCSV();
