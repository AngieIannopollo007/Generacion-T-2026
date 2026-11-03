const contenedor = document.getElementById("contenedor");
const buscador = document.getElementById("buscador");
const mensaje = document.getElementById("mensaje");

let pokemones = [];
let favoritosGuardados =
    JSON.parse(localStorage.getItem("favoritos")) || [];

async function cargarPokemones() {
    mensaje.textContent = "Cargando Pokémon...";

    try {
        const respuesta = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=50"
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los Pokémon");
        }

        const datos = await respuesta.json();

        for (const pokemon of datos.results) {
            const respuestaPokemon = await fetch(pokemon.url);
            const detalle = await respuestaPokemon.json();

            pokemones.push(detalle);
        }

        mensaje.textContent = "";
        mostrarPokemones(pokemones);

    } catch (error) {
        mensaje.textContent =
            "Ocurrió un error al cargar los Pokémon.";
    }
}

function mostrarPokemones(lista) {
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron Pokémon.</p>";
        return;
    }

    lista.forEach(pokemon => {
        const esFavorito = favoritosGuardados.includes(pokemon.id);

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}"
                 alt="${pokemon.name}">
            <p>Tipo: ${pokemon.types[0].type.name}</p>
            <button onclick="cambiarFavorito(${pokemon.id})">
                ${esFavorito ? "Quitar favorito" : "Agregar favorito"}
            </button>
        `;

        contenedor.appendChild(card);
    });
}

function cambiarFavorito(id) {
    if (favoritosGuardados.includes(id)) {
        favoritosGuardados =
            favoritosGuardados.filter(favorito => favorito !== id);
    } else {
        favoritosGuardados.push(id);
    }

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritosGuardados)
    );

    mostrarPokemones(pokemones);
}

buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();

    const resultado = pokemones.filter(pokemon =>
        pokemon.name.includes(texto)
    );

    mostrarPokemones(resultado);
});

document.getElementById("todos").addEventListener("click", () => {
    mostrarPokemones(pokemones);
});

document.getElementById("favoritos").addEventListener("click", () => {
    const resultado = pokemones.filter(pokemon =>
        favoritosGuardados.includes(pokemon.id)
    );

    mostrarPokemones(resultado);
});

cargarPokemones();