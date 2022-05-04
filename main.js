"use strict";

const openModal = () =>
	document.getElementById("modal").classList.add("active");

const closeModal = () => {
	clearFields();
	document.getElementById("modal").classList.remove("active");
};

const getLocalStorage = () =>
	JSON.parse(localStorage.getItem("db_sancao")) ?? [];

const setLocalStorage = (dbSancao) =>
	localStorage.setItem("db_sancao", JSON.stringify(dbSancao));

//CRUD DELETE
const deleteSancao = (index) => {
	const dbSancao = readSancao();
	dbSancao.splice(index, 1);
	setLocalStorage(dbSancao);
};

//CRUD UPDATE
const updateSancao = (index, sancao) => {
	const dbSancao = readSancao();
	dbSancao[index] = sancao;
	setLocalStorage(dbSancao);
};

//CRUD READ
const readSancao = () => getLocalStorage();

// CRUD CREATE
const createSancao = (sancao) => {
	const dbSancao = getLocalStorage();
	dbSancao.push(sancao);
	setLocalStorage(dbSancao);
};

const isValidFields = () => {
	return document.getElementById("form").reportValidity();
};

//interações com layout
const clearFields = () => {
	const fields = document.querySelectorAll(".clear");
	fields.forEach((field) => (field.value = ""));
};
const saveSancao = () => {
	if (isValidFields()) {
		let selectTipo = document.getElementById("tipo");
		let selectMotivo = document.getElementById("motivo");
		let selectData = document.getElementById("data");
		const sancao = {
			nome: document.getElementById("nome").value,
			tipo: selectTipo.options[selectTipo.selectedIndex].text,
			motivo: selectMotivo.options[selectMotivo.selectedIndex].text,
			data: selectData.value,
		};
		const index = document.getElementById("nome").dataset.index;
		if (index == "new") {
			createSancao(sancao);
			updateTable();
			closeModal();
		} else {
			updateSancao(index, sancao);
			updateTable();
			closeModal();
		}
	}
};

const createRow = (sancao, index) => {
	const newRow = document.createElement("tr");
	newRow.innerHTML = `
        <td id="aplicaSancao">${sancao.nome}</td> 
        <td class="td">${sancao.tipo}</td>
        <td class="td">${sancao.motivo}</td>
        <td class="td">${sancao.data}</td>
        <td>
            <button type="button" class="button blue" id="aplicar-${index}">Aplicar</button>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `;

	document.querySelector("#tbSancao>tbody").appendChild(newRow);
};

const cleatTable = () => {
	const rows = document.querySelectorAll("#tbSancao>tbody tr");
	rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
	const dbSancao = readSancao();
	cleatTable();
	dbSancao.forEach(createRow);
};

const fillFields = (sancao) => {
	document.getElementById("nome").value = sancao.nome;
	document.getElementById("tipo").text = sancao.tipo;
	document.getElementById("motivo").text = sancao.motivo;
	document.getElementById("data").value = sancao.data;
	document.getElementById("nome").dataset.index = sancao.index;
};

const editSancao = (index) => {
	const sancao = readSancao()[index];
	sancao.index = index;
	fillFields(sancao);
	openModal();
};

const editDelete = (event) => {
	if (event.target.type == "button") {
		const [action, index] = event.target.id.split("-");

		if (action == "edit") {
			editSancao(index);
		} else if (action == "delete") {
			const sancao = readSancao()[index];
			const response = confirm(
				`Deseja realmente excluir a sanção de ${sancao.nome}?`
			);
			if (response) {
				deleteSancao(index);
				updateTable();
			}
		}
	}
};

updateTable();

//eventos
document.getElementById("cadastrarSancao").addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveSancao);

document.querySelector("#tbSancao>tbody").addEventListener("click", editDelete);
