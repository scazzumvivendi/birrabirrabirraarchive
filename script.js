allBirre = null;

async function loadBirraToTable() {
  sessionStorage.removeItem("sort");
  const response = await fetch("birra.json?v=" + new Date().getTime());
  const data = await response.json();
  allBirre = data;
  addTable(data);
  sortHeader("dataVideo", "desc");
}

const headersMap = {
  nomeBirra: "Nome birra",
  prezzo: "Prezzo",
  posizione: "Posto",
  dataVideo: "Data video",
  linkVideo: "Video",
  note: "Note",
};

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
    const headerRow = document.createElement("tr");
    Object.entries(headersMap).forEach(([jsonKey, header]) => {
      const th = document.createElement("th");
      th.textContent = header;
      th.scope = "col";
      th.addEventListener("click", () => {
        const existingSort = JSON.parse(sessionStorage.getItem("sort"));
        let order;
        if (existingSort?.length && existingSort[0] === jsonKey) {
          order = existingSort[1] === "asc" ? "desc" : "asc";
        } else {
          order = "asc";
        }
        sessionStorage.setItem("sort", JSON.stringify([jsonKey, order]));
        sortHeader(jsonKey, order);
      });
      if (sessionStorage.getItem("sort")) {
        const existingSort = JSON.parse(sessionStorage.getItem("sort"));
        if (existingSort[0] === jsonKey) {
          th.appendChild(document.createElement("span")).textContent =
            existingSort[1] === "asc" ? " ▲" : " ▼";
        }
      }
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    data.forEach((item) => {
      const row = document.createElement("tr");
      Object.values(headersMap).forEach((header) => {
        row.appendChild(createHTMLElementByHeader(header, item));
      });
      tbody.appendChild(row);
    });
  }
  table.appendChild(tbody);
  divWrapper.id = "birraTable";
  divWrapper.appendChild(table);
  document.body.appendChild(divWrapper);
}

loadBirraToTable();

function createHTMLElementByHeader(header, item) {
  const td = document.createElement("td");
  if (header === "Prezzo") {
    td.classList.add("col-1");
    if (typeof item.prezzo === "number") {
      td.textContent = "€ " + item.prezzo.toFixed(2).replace(".", ",");
    } else {
      td.textContent = item.prezzo;
    }
  } else if (header === "Nome birra") {
    td.classList.add("col-2");
    td.textContent = item.nomeBirra;
  } else if (header === "Posto") {
    td.classList.add("col-1");
    td.textContent = item.posizione;
  } else if (header === "Note") {
    td.classList.add("col-3");
    td.textContent = item.note;
  } else if (header === "Data video") {
    td.classList.add("col-2");
    td.textContent = new Date(item.dataVideo).toLocaleDateString();
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
    (birra) =>
      birra.nomeBirra.toLowerCase().indexOf(searchValue) > -1 ||
      birra.titoloVideo.toLowerCase().indexOf(searchValue) > -1 ||
      birra.note.toLowerCase().indexOf(searchValue) > -1,
  );

  addTable(filteredBirre);
}

function sortHeader(header, order) {
  document.getElementById("birraTable").remove();

  const sortedBirre = allBirre.sort((birra1, birra2) => {
    element1 = birra1[header];
    element2 = birra2[header];

    if (element1 == element2) {
      return birra1.posizione > birra2.posizione;
    }

    if (order == "asc") return element1 < element2 ? -1 : 1;
    else return element1 < element2 ? 1 : -1;
  });

  addTable(sortedBirre);
}
