allBirre = null;

async function loadBirraToTable() {
  const response = await fetch("birra.json");
  const data = await response.json();
  allBirre = data;
  addTable(data);
}

const headers = [
  "Nome birra",
  "Prezzo",
  "Posto",
  "Data video",
  "Video",
  "Note",
];

function addTable(data) {
  const divWrapper = document.createElement("div");
  divWrapper.classList.add("table-responsive");
  const table = document.createElement("table");
  table.classList.add("table");
  table.classList.add("table-hover");
  table.classList.add("table-striped");
  table.classList.add("table-responsive");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  if (data.length > 0) {
    data.sort((birra1, birra2) => {
      if (birra1.dataVideo == birra2.dataVideo) {
        return birra1.posizione > birra2.posizione;
      }

      return birra1.dataVideo < birra2.dataVideo ? 1 : -1;
    });

    // Create table headers
    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      th.scope = "col";
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // Create table rows
    data.forEach((item) => {
      const row = document.createElement("tr");
      headers.forEach((header) => {
        row.appendChild(createHTMLElementByHeader(header, item));
      });
      tbody.appendChild(row);
    });
  }
  table.appendChild(tbody);
  table.id = "birraTable";
  divWrapper.appendChild(table);
  document.body.appendChild(divWrapper);
}

loadBirraToTable();

function createHTMLElementByHeader(header, item) {
  const td = document.createElement("td");
  if (header === "Prezzo") {
    td.classList.add("col-1");
    td.textContent = "€ " + item.prezzo;
  } else if (header === "Nome birra") {
    td.classList.add("col-2");
    const a = document.createElement("a");
    a.href = item.linkUfficiale;
    a.text = item.nomeBirra;
    a.target = "_blank";
    td.appendChild(a);
  } else if (header === "Posto") {
    td.classList.add("col-1");
    td.textContent = item.posizione;
  } else if (header === "Note") {
    td.classList.add("col-3");
    td.textContent = item.note;
  } else if (header === "Data video") {
    td.classList.add("col-2");
    td.textContent = item.dataVideo;
  } else if (header === "Video") {
    td.classList.add("col-3");
    const a = document.createElement("a");
    a.href = item.linkVideo;
    a.text = item.titoloVideo;
    a.target = "_blank";
    td.appendChild(a);
  }
  return td;
}

function searchBirra() {
  document.getElementById("birraTable").remove();

  const searchValue = document
    .getElementById("ricerca-birra")
    .value.toLowerCase();

  const filteredBirre = allBirre.filter(
    (birra) => birra.nomeBirra.toLowerCase().indexOf(searchValue) > -1,
  );

  addTable(filteredBirre);
}
