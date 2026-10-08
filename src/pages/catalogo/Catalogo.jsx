
import { useState } from "react";
import {
  Search,
  Plus,
  X,
  FolderKanban,
  BrainCircuit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import "./Catalogo.css";

const experiencias = [
  {
    id: "arquitectura",
    nombre: "Arquitectura de Software",
    tipo: "Obligatoria",
    estado: "En Curso",
  },
  {
    id: "servidores",
    nombre: "Servidores",
    tipo: "Obligatoria",
    estado: "Próximo",
  },
  {
    id: "evaluacion",
    nombre: "Evaluación de Usuario",
    tipo: "Optativa",
    estado: "Disponible",
  },
  {
    id: "ciberseguridad",
    nombre: "Ciber Seguridad",
    tipo: "Obligatoria",
    estado: "Disponible",
  },
];

const leerDatos = (clave) => {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};

const nuevoProyecto = {
  nombre: "",
  descripcion: "",
  tecnologias: "",
  experienciaId: "",
  enlace: "",
};

const nuevoConocimiento = {
  nombre: "",
  nivel: "Intermedio",
  descripcion: "",
  experienciaId: "",
};

const obtenerNombreEE = (id) =>
  experiencias.find((ee) => ee.id === id)?.nombre ||
  "Sin experiencia asociada";

function SelectorEE({ value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="">Seleccionar experiencia educativa</option>
      {experiencias.map((ee) => (
        <option value={ee.id} key={ee.id}>
          {ee.nombre}
        </option>
      ))}
    </select>
  );
}

export default function Catalogo({ onEvaluar }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todas");

  const [proyectos, setProyectos] = useState(() =>
    leerDatos("feicv_proyectos")
  );

  const [conocimientos, setConocimientos] = useState(() =>
    leerDatos("feicv_conocimientos")
  );

  const [formulario, setFormulario] = useState(null);
  const [proyecto, setProyecto] = useState(nuevoProyecto);
  const [conocimiento, setConocimiento] =
    useState(nuevoConocimiento);

  const experienciasFiltradas = experiencias.filter((ee) => {
    const coincideBusqueda = ee.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideFiltro =
      filtro === "Todas" || ee.tipo === filtro;

    return coincideBusqueda && coincideFiltro;
  });

  const guardarProyecto = (e) => {
    e.preventDefault();

    const registro = {
      ...proyecto,
      id: crypto.randomUUID(),
    };

    const actualizados = [...proyectos, registro];

    setProyectos(actualizados);
    localStorage.setItem(
      "feicv_proyectos",
      JSON.stringify(actualizados)
    );

    setProyecto(nuevoProyecto);
    setFormulario(null);
  };

  const guardarConocimiento = (e) => {
    e.preventDefault();

    const registro = {
      ...conocimiento,
      id: crypto.randomUUID(),
    };

    const actualizados = [...conocimientos, registro];

    setConocimientos(actualizados);
    localStorage.setItem(
      "feicv_conocimientos",
      JSON.stringify(actualizados)
    );

    setConocimiento(nuevoConocimiento);
    setFormulario(null);
  };

  const eliminarProyecto = (id) => {
    if (!window.confirm("¿Eliminar este proyecto?")) return;

    const actualizados = proyectos.filter((p) => p.id !== id);
    setProyectos(actualizados);
    localStorage.setItem(
      "feicv_proyectos",
      JSON.stringify(actualizados)
    );
  };

  const eliminarConocimiento = (id) => {
    if (!window.confirm("¿Eliminar este conocimiento?")) return;

    const actualizados = conocimientos.filter((c) => c.id !== id);
    setConocimientos(actualizados);
    localStorage.setItem(
      "feicv_conocimientos",
      JSON.stringify(actualizados)
    );
  };

  return (
    <div className="catalogo-contenedor">
      <header className="catalogo-encabezado">
        <h1>Plan de Experiencias Educativas</h1>
        <p>
          Consulta y gestiona las asignaturas correspondientes
          a tus habilidades a evaluar.
        </p>
      </header>

      {/* Búsqueda y filtros */}
      <div className="catalogo-herramientas">
        <div className="catalogo-buscador">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar por nombre o tema..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar experiencias educativas"
          />
        </div>

        <select
          className="catalogo-filtro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          aria-label="Filtrar experiencias educativas"
        >
          <option value="Todas">Filtrar: Todas</option>
          <option value="Obligatoria">Obligatorias</option>
          <option value="Optativa">Optativas</option>
        </select>
      </div>

      {/* Experiencias educativas */}
      <section className="catalogo-grid">
        {experienciasFiltradas.map((ee) => (
          <article className="catalogo-tarjeta" key={ee.id}>
            <span
              className={`catalogo-estado ${
                ee.estado === "En Curso"
                  ? "en-curso"
                  : ee.estado === "Próximo"
                  ? "proxima"
                  : "disponible"
              }`}
            >
              {ee.estado}
            </span>

            <div className="catalogo-tarjeta-info">
              <h3>{ee.nombre}</h3>
              <p>{ee.tipo}</p>
            </div>

            <div className="catalogo-tarjeta-footer">
              <button
                type="button"
                onClick={() => onEvaluar?.(ee)}
              >
                Evaluación →
              </button>
            </div>
          </article>
        ))}

        {experienciasFiltradas.length === 0 && (
          <p className="catalogo-vacio">
            No se encontraron experiencias educativas.
          </p>
        )}
      </section>

      {/* Evidencias de aprendizaje */}
      <section className="catalogo-evidencias">
        <div className="catalogo-seccion-titulo">
          <h2>Mis evidencias para evaluación</h2>
          <p>
            Registra proyectos y conocimientos adquiridos previamente
            que puedan servir como evidencia de tus competencias.
          </p>
        </div>

        <div className="catalogo-opciones-evidencia">
          <article className="catalogo-evidencia-opcion">
            <FolderKanban size={25} />
            <h3>Proyectos anteriores</h3>
            <p>
              Registra proyectos académicos o personales que
              demuestren tus habilidades y experiencia.
            </p>
            <button
              type="button"
              onClick={() =>
                setFormulario(
                  formulario === "proyecto" ? null : "proyecto"
                )
              }
            >
              <Plus size={16} /> Agregar proyecto
            </button>
          </article>

          <article className="catalogo-evidencia-opcion">
            <BrainCircuit size={25} />
            <h3>Conocimientos previos</h3>
            <p>
              Agrega tecnologías, herramientas o conocimientos
              que ya dominas y deseas considerar para tu evaluación.
            </p>
            <button
              type="button"
              onClick={() =>
                setFormulario(
                  formulario === "conocimiento"
                    ? null
                    : "conocimiento"
                )
              }
            >
              <Plus size={16} /> Agregar conocimiento
            </button>
          </article>
        </div>

        {/* Formulario para proyectos */}
        {formulario === "proyecto" && (
          <form
            className="catalogo-formulario"
            onSubmit={guardarProyecto}
          >
            <div className="catalogo-formulario-titulo">
              <h3>Registrar proyecto anterior</h3>
              <button
                type="button"
                onClick={() => setFormulario(null)}
                aria-label="Cerrar formulario"
              >
                <X size={19} />
              </button>
            </div>

            <div className="catalogo-form-grid">
              <label>
                Nombre del proyecto
                <input
                  required
                  maxLength={120}
                  placeholder="Ej. Sistema de inventarios"
                  value={proyecto.nombre}
                  onChange={(e) =>
                    setProyecto({
                      ...proyecto,
                      nombre: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Tecnologías utilizadas
                <input
                  placeholder="Ej. React, Node.js, SQL Server"
                  value={proyecto.tecnologias}
                  onChange={(e) =>
                    setProyecto({
                      ...proyecto,
                      tecnologias: e.target.value,
                    })
                  }
                />
              </label>

              <label className="catalogo-campo-completo">
                Descripción del proyecto
                <textarea
                  required
                  rows={3}
                  placeholder="Explica qué desarrollaste, tu participación y las habilidades utilizadas..."
                  value={proyecto.descripcion}
                  onChange={(e) =>
                    setProyecto({
                      ...proyecto,
                      descripcion: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Experiencia educativa relacionada
                <SelectorEE
                  value={proyecto.experienciaId}
                  onChange={(e) =>
                    setProyecto({
                      ...proyecto,
                      experienciaId: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Enlace del proyecto (opcional)
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={proyecto.enlace}
                  onChange={(e) =>
                    setProyecto({
                      ...proyecto,
                      enlace: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="catalogo-form-acciones">
              <button
                type="button"
                className="catalogo-cancelar"
                onClick={() => setFormulario(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="catalogo-confirmar">
                Guardar proyecto
              </button>
            </div>
          </form>
        )}

        {/* Formulario para conocimientos */}
        {formulario === "conocimiento" && (
          <form
            className="catalogo-formulario"
            onSubmit={guardarConocimiento}
          >
            <div className="catalogo-formulario-titulo">
              <h3>Registrar conocimiento previo</h3>
              <button
                type="button"
                onClick={() => setFormulario(null)}
                aria-label="Cerrar formulario"
              >
                <X size={19} />
              </button>
            </div>

            <div className="catalogo-form-grid">
              <label>
                Conocimiento o habilidad
                <input
                  required
                  maxLength={120}
                  placeholder="Ej. Programación en Java"
                  value={conocimiento.nombre}
                  onChange={(e) =>
                    setConocimiento({
                      ...conocimiento,
                      nombre: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Nivel de dominio
                <select
                  value={conocimiento.nivel}
                  onChange={(e) =>
                    setConocimiento({
                      ...conocimiento,
                      nivel: e.target.value,
                    })
                  }
                >
                  <option>Básico</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>
              </label>

              <label>
                Experiencia educativa relacionada
                <SelectorEE
                  value={conocimiento.experienciaId}
                  onChange={(e) =>
                    setConocimiento({
                      ...conocimiento,
                      experienciaId: e.target.value,
                    })
                  }
                />
              </label>

              <label className="catalogo-campo-completo">
                ¿Cómo adquiriste este conocimiento?
                <textarea
                  rows={3}
                  required
                  placeholder="Ej. Lo aprendí desarrollando una aplicación web..."
                  value={conocimiento.descripcion}
                  onChange={(e) =>
                    setConocimiento({
                      ...conocimiento,
                      descripcion: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="catalogo-form-acciones">
              <button
                type="button"
                className="catalogo-cancelar"
                onClick={() => setFormulario(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="catalogo-confirmar">
                Guardar conocimiento
              </button>
            </div>
          </form>
        )}

        {/* Registros guardados */}
        <div className="catalogo-registros">
          <div className="catalogo-lista">
            <h3>Proyectos registrados ({proyectos.length})</h3>

            {proyectos.length === 0 && (
              <p className="catalogo-sin-registros">
                Todavía no has agregado proyectos.
              </p>
            )}

            {proyectos.map((item) => (
              <article className="catalogo-registro" key={item.id}>
                <div className="catalogo-registro-cabecera">
                  <strong>{item.nombre}</strong>
                  <button
                    type="button"
                    onClick={() => eliminarProyecto(item.id)}
                    aria-label={`Eliminar ${item.nombre}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p>{item.descripcion}</p>
                {item.tecnologias && (
                  <span>Tecnologías: {item.tecnologias}</span>
                )}
                <small>
                  EE: {obtenerNombreEE(item.experienciaId)}
                </small>

                {/^https?:\/\//i.test(item.enlace) && (
                  <a
                    href={item.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver proyecto <ExternalLink size={13} />
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="catalogo-lista">
            <h3>
              Conocimientos registrados ({conocimientos.length})
            </h3>

            {conocimientos.length === 0 && (
              <p className="catalogo-sin-registros">
                Todavía no has agregado conocimientos.
              </p>
            )}

            {conocimientos.map((item) => (
              <article className="catalogo-registro" key={item.id}>
                <div className="catalogo-registro-cabecera">
                  <strong>{item.nombre}</strong>
                  <button
                    type="button"
                    onClick={() => eliminarConocimiento(item.id)}
                    aria-label={`Eliminar ${item.nombre}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <span>Nivel: {item.nivel}</span>
                <p>{item.descripcion}</p>
                <small>
                  EE: {obtenerNombreEE(item.experienciaId)}
                </small>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
