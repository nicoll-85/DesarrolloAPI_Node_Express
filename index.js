const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { apiCallPersonajes } = require("./request/personajes");
const { apiCallPersonaje } = require("./request/personaje");

require("./request/personajes");
require("./database");
app.use(express.json());

const personajesSchema = new mongoose.Schema({
  name: String,
  height: String,
  mass: String,
  hair_color: String,
  skin_color: String,
  eye_color: String,
  birth_year: String,
  gender: String,
  homeworld: String,
  films: Array,
  vehicles: Array,
  starships: Array,
  created: String,
  edited: String,
  url: String,
  id: String,
});

const Personaje = mongoose.model("Personaje", personajesSchema);

// 1.Obtener los datos de los personajes de la API externa
app.get("/personajes-disponibles", async (req, res) => {
  try {
    const personajes = await apiCallPersonajes();
    const personajesConId = personajes.results.map((x) => {
      const url = x.url.split("/");
      const id = url[url.length - 2];
      return { id: id, ...x };
    });
    res.send(personajesConId);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 2. Agregar personajes a la lista de favoritos de BD
app.post("/personajes-favoritos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // llamada a la API externa para obtener los datos del personaje
    const personajesConId = await apiCallPersonaje(id);
    console.log(personajesConId);

    if (!personajesConId) {
      return res.status(404).send({ message: "Personaje no encontrado" });
    }

    const personajeFavorito = new Personaje({ ...personajesConId, id: id });
    await personajeFavorito.save();

    res.status(201).send(personajeFavorito);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 3. Obtener el personaje favorito de la BD
app.get("/personajes-favoritos/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const personajeFavoritoBd = await Personaje.find({ id: id });
    res.json(personajeFavoritoBd);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 4.Obtener la lista de personajes favoritos de la BD
app.get("/personajes-favoritos", async (req, res) => {
  try {
    const personajesFavoritosBd = await Personaje.find();
    res.json(personajesFavoritosBd);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 5. Eliminar un personaje
app.delete("/personajes-favoritos/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const personajeFavoritoBd = await Personaje.findOneAndDelete({ id: id });
    res.json(personajeFavoritoBd);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 6. Actualizar el nombre de uno de mis personajes favoritos
app.put("/personajes-favoritos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const personajeFavoritoBd = await Personaje.findOneAndUpdate(
      { id: id },
      { ...body }
    );
    res.json(personajeFavoritoBd);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log(
    "Servidor escuchando mis personajes favoritos de Starwars en http://localhost:3001"
  );
});
