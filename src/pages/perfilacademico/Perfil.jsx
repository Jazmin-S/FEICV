
import { useState } from "react";
import "./Perfil.css";

const datosIniciales = {
  nombre: "Jazmin Viveros Sarmiento",
  matricula: "s23014159",
  semestre: "7",
  carrera: "Ing. Sistemas computacionales y Tocologías de la información",
  habilidades: [
    "Trabajo en equipo",
    "Pensamiento crítico",
    "Resolución de problemas",
    "Liderazgo",
    "Aprendizaje continuo",
    "Adaptabilidad",
  ],
  tecnologias: [
    "React",
    "SQL Server",
    "Ciberseguridad",
    "Desarrollo web",
    "Scrum",
    "Git",
  ],
};

function Etiquetas({ titulo, elementos, onAgregar, onEliminar }) {
  const [agregando, setAgregando] = useState(false);
  const [nuevoElemento, setNuevoElemento] = useState("");

  const agregarElemento = () => {
    const valor = nuevoElemento.trim();

    if (!valor) return;

    const existe = elementos.some(
      (elemento) => elemento.toLowerCase() === valor.toLowerCase()
    );

    if (existe) {
      alert("Este elemento ya se encuentra registrado.");
      return;
    }

    onAgregar(valor);
    setNuevoElemento("");
    setAgregando(false);
  };

  return (
    <div className="perfil-grupo-etiquetas">
      <h3>{titulo}</h3>

      <div className="perfil-etiquetas">
        {elementos.map((elemento) => (
          <span className="perfil-etiqueta" key={elemento}>
            {elemento}
            <button
              type="button"
              className="perfil-eliminar"
              onClick={() => onEliminar(elemento)}
              aria-label={`Eliminar ${elemento}`}
            >
              ×
            </button>
          </span>
        ))}

        {!agregando ? (
          <button
            type="button"
            className="perfil-agregar"
            onClick={() => setAgregando(true)}
          >
            + Añadir
          </button>
        ) : (
          <div className="perfil-nueva-etiqueta">
            <input
              type="text"
              value={nuevoElemento}
              placeholder="Nuevo elemento"
              autoFocus
              onChange={(e) => setNuevoElemento(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") agregarElemento();

                if (e.key === "Escape") {
                  setAgregando(false);
                  setNuevoElemento("");
                }
              }}
            />

            <button type="button" onClick={agregarElemento}>
              Añadir
            </button>

            <button
              type="button"
              onClick={() => {
                setAgregando(false);
                setNuevoElemento("");
              }}
              aria-label="Cancelar"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Perfil() {
  const [datosGuardados, setDatosGuardados] = useState(() => ({
    ...datosIniciales,
    habilidades: [...datosIniciales.habilidades],
    tecnologias: [...datosIniciales.tecnologias],
  }));

  const [perfil, setPerfil] = useState(() => ({
    ...datosIniciales,
    habilidades: [...datosIniciales.habilidades],
    tecnologias: [...datosIniciales.tecnologias],
  }));

  const [mensaje, setMensaje] = useState("");

  const actualizarCampo = (campo, valor) => {
    setPerfil((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
    setMensaje("");
  };

  const agregarEtiqueta = (tipo, valor) => {
    setPerfil((anterior) => ({
      ...anterior,
      [tipo]: [...anterior[tipo], valor],
    }));
    setMensaje("");
  };

  const eliminarEtiqueta = (tipo, valor) => {
    setPerfil((anterior) => ({
      ...anterior,
      [tipo]: anterior[tipo].filter((item) => item !== valor),
    }));
    setMensaje("");
  };

  const guardarPerfil = (e) => {
    e.preventDefault();

    if (
      !perfil.nombre.trim() ||
      !perfil.matricula.trim() ||
      !perfil.carrera.trim() ||
      !perfil.semestre
    ) {
      setMensaje("Completa todos los campos obligatorios.");
      return;
    }

    const copia = {
      ...perfil,
      habilidades: [...perfil.habilidades],
      tecnologias: [...perfil.tecnologias],
    };

    setDatosGuardados(copia);
    setMensaje("Perfil actualizado correctamente.");
  };

  const descartarCambios = () => {
    setPerfil({
      ...datosGuardados,
      habilidades: [...datosGuardados.habilidades],
      tecnologias: [...datosGuardados.tecnologias],
    });

    setMensaje("Los cambios fueron descartados.");
  };

  return (
    <div className="perfil-contenedor">
      <header className="perfil-encabezado">
        <h1>Perfil Académico</h1>
        <p>
          Actualiza tu información oficial para una mejor personalización
          del plan de estudios.
        </p>
      </header>

      <form className="perfil-formulario" onSubmit={guardarPerfil}>
        <div className="perfil-grid">
          <div className="perfil-campo">
            <label htmlFor="perfil-nombre">NOMBRE COMPLETO</label>
            <input
              id="perfil-nombre"
              type="text"
              value={perfil.nombre}
              onChange={(e) =>
                actualizarCampo("nombre", e.target.value)
              }
              required
            />
          </div>

          <div className="perfil-campo">
            <label htmlFor="perfil-matricula">MATRÍCULA / ID</label>
            <input
              id="perfil-matricula"
              type="text"
              value={perfil.matricula}
              onChange={(e) =>
                actualizarCampo("matricula", e.target.value)
              }
              required
            />
          </div>

          <div className="perfil-campo">
            <label htmlFor="perfil-semestre">SEMESTRE ACTUAL</label>
            <select
              id="perfil-semestre"
              value={perfil.semestre}
              onChange={(e) =>
                actualizarCampo("semestre", e.target.value)
              }
              required
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(
                (numero) => (
                  <option key={numero} value={numero}>
                    {numero}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="perfil-campo">
            <label htmlFor="perfil-carrera">CARRERA</label>
            <textarea
              id="perfil-carrera"
              rows="2"
              value={perfil.carrera}
              onChange={(e) =>
                actualizarCampo("carrera", e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="perfil-separador" />

        <Etiquetas
          titulo="Habilidades destacadas"
          elementos={perfil.habilidades}
          onAgregar={(valor) => agregarEtiqueta("habilidades", valor)}
          onEliminar={(valor) => eliminarEtiqueta("habilidades", valor)}
        />

        <Etiquetas
          titulo="Tecnologías destacadas"
          elementos={perfil.tecnologias}
          onAgregar={(valor) => agregarEtiqueta("tecnologias", valor)}
          onEliminar={(valor) => eliminarEtiqueta("tecnologias", valor)}
        />

        {mensaje && (
          <p
            className="perfil-mensaje"
            role="status"
            aria-live="polite"
          >
            {mensaje}
          </p>
        )}

        <div className="perfil-acciones">
          <button
            type="button"
            className="perfil-btn-descartar"
            onClick={descartarCambios}
          >
            Descartar Cambios
          </button>

          <button type="submit" className="perfil-btn-guardar">
            Guardar Perfil
          </button>
        </div>
      </form>
    </div>
  );
}
