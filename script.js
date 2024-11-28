const formularzZadanie = document.getElementById('formularz-zadanie');
const listaZadan = document.getElementById('zadania');
const pozostalyCzasElement = document.getElementById('pozostaly-czas');
const postepElement = document.getElementById('postep');
const procentZadanElement = document.getElementById('procent-zadan');
const ustawieniaFormularz = document.getElementById('formularz-ustawienia');
const ustawionyCzasElement = document.getElementById('ustawiony-czas');

let pozostalyCzas = 480;
let ustawionyCzas = 480;
let zadania = [];

function wczytajDane() {
    const zapisaneZadania = JSON.parse(localStorage.getItem('zadania')) || [];
    const zapisanyCzas = parseInt(localStorage.getItem('ustawionyCzas')) || 480;

    zadania = zapisaneZadania;
    ustawionyCzas = zapisanyCzas;
    pozostalyCzas = ustawionyCzas - zadania.reduce((suma, zadanie) => suma + zadanie.czas, 0);

    ustawionyCzasElement.value = ustawionyCzas;
    pozostalyCzasElement.textContent = pozostalyCzas;

    aktualizujListeZadan();
    obliczDostepnyCzas();
}

function zapiszDane() {
    localStorage.setItem('zadania', JSON.stringify(zadania));
    localStorage.setItem('ustawionyCzas', ustawionyCzas.toString());
}

formularzZadanie.addEventListener('submit', (e) => {
    e.preventDefault();
    const nazwa = document.getElementById('nazwa-zadania').value;
    const czas = parseInt(document.getElementById('czas-trwania').value);
    const priorytet = document.getElementById('priorytet-zadania').value;

    zadania.push({ nazwa, czas, priorytet, zrealizowane: false });

    zapiszDane();
    aktualizujListeZadan();
    obliczDostepnyCzas();
    formularzZadanie.reset();
});

ustawieniaFormularz.addEventListener('submit', (e) => {
    e.preventDefault();
    ustawionyCzas = parseInt(ustawionyCzasElement.value);
    pozostalyCzas = ustawionyCzas - zadania.reduce((suma, zadanie) => suma + zadanie.czas, 0);

    zapiszDane();
    obliczDostepnyCzas();
});

function aktualizujListeZadan() {
    listaZadan.innerHTML = '';
    zadania.forEach((zadanie, indeks) => {
        const li = document.createElement('li');
        li.className = zadanie.priorytet;
        li.innerHTML = `
            <span>${zadanie.nazwa} - ${zadanie.czas} min (${zadanie.priorytet})</span>
            <button onclick="oznaczJakoZrealizowane(${indeks})" ${zadanie.zrealizowane ? 'disabled' : ''}>
                ${zadanie.zrealizowane ? 'Zrealizowane' : 'Oznacz jako zrealizowane'}
            </button>
            <button onclick="usunZadanie(${indeks})">Usuń</button>
        `;
        listaZadan.appendChild(li);
    });
}

function oznaczJakoZrealizowane(indeks) {
    zadania[indeks].zrealizowane = true;
    zapiszDane();
    aktualizujListeZadan();
    obliczDostepnyCzas();
}

function usunZadanie(indeks) {
    zadania.splice(indeks, 1);
    zapiszDane();
    aktualizujListeZadan();
    obliczDostepnyCzas();
}

function obliczDostepnyCzas() {
    const wykorzystanyCzas = zadania.reduce((suma, zadanie) => suma + zadanie.czas, 0);
    pozostalyCzas = ustawionyCzas - wykorzystanyCzas;

    pozostalyCzasElement.textContent = Math.max(pozostalyCzas, 0);
    const postep = Math.max((pozostalyCzas / ustawionyCzas) * 100, 0);
    postepElement.style.width = `${postep}%`;

    const zrealizowaneZadania = zadania.filter(zadanie => zadanie.zrealizowane).length;
    const efektywnosc = Math.round((zrealizowaneZadania / zadania.length) * 100) || 0;
    procentZadanElement.textContent = efektywnosc;
}

wczytajDane();
