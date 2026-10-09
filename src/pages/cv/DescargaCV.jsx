
import { useRef, useState } from "react";
import {
  Pencil,
  Download,
  Sparkles,
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Check,
  X,
  FileText,
} from "lucide-react";
import "./DescargaCV.css";

const STORAGE_KEY = "feicv_cv_borrador";

const CV_INICIAL = {
  nombre: "",
  carrera: "",
  correo: "",
  telefono: "",
  ubicacion: "",
  universidad: "Universidad Veracruzana",
  periodo: "",
  perfil: "",
  habilidades: "",
  proyectos: [],
};

function cargarCV() {
  try {
    const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (guardado && typeof guardado === "object") {
      return {
        ...CV_INICIAL,
        ...guardado,
        proyectos: Array.isArray(guardado.proyectos)
          ? guardado.proyectos
          : [],
      };
    }
  } catch {
    // Si no existe información guardada, crear un CV vacío.
  }

  return { ...CV_INICIAL, proyectos: [] };
}

function nuevoProyecto() {
  return {
    id: crypto.randomUUID(),
    nombre: "",
    descripcion: "",
  };
}

export default function DescargaCV() {
  const [cv, setCv] = useState(cargarCV);
  const [editando, setEditando] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [sugerencia, setSugerencia] = useState(null);

  const documentoRef = useRef(null);

  function actualizarCampo(campo, valor) {
    setCv((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
    setSugerencia(null);
  }

  function actualizarProyecto(id, campo, valor) {
    setCv((anterior) => ({
      ...anterior,
      proyectos: anterior.proyectos.map((proyecto) =>
        proyecto.id === id
          ? { ...proyecto, [campo]: valor }
          : proyecto
      ),
    }));
    setSugerencia(null);
  }

  function agregarProyecto() {
    setCv((anterior) => ({
      ...anterior,
      proyectos: [...anterior.proyectos, nuevoProyecto()],
    }));
  }

  function eliminarProyecto(id) {
    setCv((anterior) => ({
      ...anterior,
      proyectos: anterior.proyectos.filter(
        (proyecto) => proyecto.id !== id
      ),
    }));
  }

  function guardarCV() {
    setError("");

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
      setMensaje("Borrador guardado correctamente.");
      setEditando(false);
    } catch {
      setError("No se pudo guardar el CV en este navegador.");
    }
  }

  // Solicita al backend una propuesta de redacción.
  async function mejorarConIA() {
    setGenerando(true);
    setError("");
    setMensaje("");
    setSugerencia(null);

    try {
      const urlBase = (
        import.meta.env.VITE_API_URL ||
        "http://localhost:4000/api"
      ).replace(/\/$/, "");

      const respuesta = await fetch(`${urlBase}/cv/mejorar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          perfil: cv.perfil,
          carrera: cv.carrera,
          habilidades: cv.habilidades,
          proyectos: cv.proyectos,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error || "No se pudo mejorar el CV."
        );
      }

      setSugerencia(datos);
      setMensaje(
        "La IA preparó una propuesta. Revísala antes de aplicarla."
      );
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor.");
    } finally {
      setGenerando(false);
    }
  }

  // La IA nunca reemplaza información sin aprobación.
  function aceptarSugerencia() {
    if (!sugerencia) return;

    setCv((anterior) => ({
      ...anterior,
      perfil: sugerencia.perfil || anterior.perfil,
      proyectos: anterior.proyectos.map((proyecto) => {
        const propuesta = sugerencia.proyectos?.find(
          (item) => item.id === proyecto.id
        );

        return propuesta
          ? {
              ...proyecto,
              descripcion:
                propuesta.descripcion || proyecto.descripcion,
            }
          : proyecto;
      }),
    }));

    setSugerencia(null);
    setMensaje(
      "Redacción aplicada. Puedes continuar editando antes de guardar."
    );
  }

  async function descargarPDF() {
    if (!documentoRef.current) return;

    setDescargando(true);
    setError("");

    try {
      const modulo = await import("html2pdf.js");
      const html2pdf = modulo.default || modulo;

      const nombreArchivo = (cv.nombre || "Curriculum")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "_");

      await html2pdf()
        .set({
          margin: 0,
          filename: `CV_${nombreArchivo}.pdf`,
          image: {
            type: "jpeg",
            quality: 0.98,
          },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "legacy"],
          },
        })
        .from(documentoRef.current)
        .save();

      setMensaje("Se generó el archivo PDF.");
    } catch {
      setError("No fue posible generar el PDF.");
    } finally {
      setDescargando(false);
    }
  }

  return (
    <main className="cv-pagina">
      {/* Encabezado */}
      <header className="cv-encabezado">
        <div>
          <h1>Vista Previa Final y Descarga</h1>
          <p>
            Revisa el documento generado antes de exportarlo
            en formato PDF de alta calidad.
          </p>
        </div>

        <div className="cv-botones-superiores">
          <button
            className="cv-boton cv-boton-editar"
            onClick={() => {
              setEditando(!editando);
              setError("");
            }}
          >
            <Pencil size={17} />
            {editando ? "Vista previa" : "Editar CV"}
          </button>

          <button
            className="cv-boton cv-boton-ia"
            onClick={mejorarConIA}
            disabled={generando}
          >
            <Sparkles size={17} />
            {generando ? "Redactando..." : "Mejorar con IA"}
          </button>

          <button
            className="cv-boton cv-boton-descargar"
            onClick={descargarPDF}
            disabled={descargando}
          >
            <Download size={17} />
            {descargando ? "Generando..." : "Descargar PDF"}
          </button>
        </div>
      </header>

      {error && (
        <p className="cv-mensaje cv-mensaje-error" role="alert">
          {error}
        </p>
      )}

      {mensaje && (
        <p className="cv-mensaje cv-mensaje-exito" role="status">
          {mensaje}
        </p>
      )}

      {/* Propuesta generada por IA */}
      {sugerencia && (
        <section className="cv-sugerencia">
          <div className="cv-sugerencia-titulo">
            <Sparkles size={21} />
            <h2>Propuesta de redacción con IA</h2>
          </div>

          <p>
            Revisa los textos sugeridos. La IA puede cometer
            errores y no debe añadir experiencia que no tengas.
          </p>

          <h3>Perfil profesional sugerido</h3>
          <p>{sugerencia.perfil || "Sin propuesta de perfil."}</p>

          {sugerencia.proyectos?.map((proyecto) => (
            <div key={proyecto.id} className="cv-propuesta-proyecto">
              <strong>{proyecto.nombre}</strong>
              <p>{proyecto.descripcion}</p>
            </div>
          ))}

          <div className="cv-sugerencia-acciones">
            <button
              className="cv-boton cv-boton-aceptar"
              onClick={aceptarSugerencia}
            >
              <Check size={17} />
              Aplicar propuesta
            </button>

            <button
              className="cv-boton cv-boton-cancelar"
              onClick={() => setSugerencia(null)}
            >
              <X size={17} />
              Descartar
            </button>
          </div>
        </section>
      )}

      {/* Formulario de edición */}
      {editando && (
        <section className="cv-editor">
          <div className="cv-editor-encabezado">
            <h2>Editar información profesional</h2>
            <p>
              Los cambios se reflejan en la vista previa.
            </p>
          </div>

          <div className="cv-form-grid">
            {[
              ["nombre", "Nombre completo"],
              ["carrera", "Carrera profesional"],
              ["correo", "Correo electrónico"],
              ["telefono", "Teléfono"],
              ["ubicacion", "Ubicación"],
              ["universidad", "Universidad"],
              ["periodo", "Periodo académico"],
            ].map(([campo, titulo]) => (
              <label key={campo} className="cv-campo">
                <span>{titulo}</span>
                <input
                  type="text"
                  value={cv[campo]}
                  onChange={(e) =>
                    actualizarCampo(campo, e.target.value)
                  }
                  placeholder={titulo}
                />
              </label>
            ))}
          </div>

          <label className="cv-campo">
            <span>Perfil profesional</span>
            <textarea
              rows={5}
              value={cv.perfil}
              onChange={(e) =>
                actualizarCampo("perfil", e.target.value)
              }
              placeholder="Describe tus conocimientos, capacidades y objetivos profesionales."
            />
          </label>

          <label className="cv-campo">
            <span>Habilidades y competencias</span>
            <textarea
              rows={3}
              value={cv.habilidades}
              onChange={(e) =>
                actualizarCampo("habilidades", e.target.value)
              }
              placeholder="JavaScript, React, trabajo en equipo..."
            />
          </label>

          <div className="cv-editor-proyectos-titulo">
            <h3>Proyectos académicos</h3>

            <button
              className="cv-boton cv-boton-agregar"
              onClick={agregarProyecto}
            >
              <Plus size={16} />
              Agregar proyecto
            </button>
          </div>

          {cv.proyectos.map((proyecto) => (
            <div className="cv-editor-proyecto" key={proyecto.id}>
              <label className="cv-campo">
                <span>Nombre del proyecto</span>
                <input
                  value={proyecto.nombre}
                  onChange={(e) =>
                    actualizarProyecto(
                      proyecto.id,
                      "nombre",
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="cv-campo">
                <span>Descripción y logros</span>
                <textarea
                  rows={3}
                  value={proyecto.descripcion}
                  onChange={(e) =>
                    actualizarProyecto(
                      proyecto.id,
                      "descripcion",
                      e.target.value
                    )
                  }
                />
              </label>

              <button
                className="cv-boton-eliminar"
                onClick={() => eliminarProyecto(proyecto.id)}
              >
                <Trash2 size={16} />
                Eliminar proyecto
              </button>
            </div>
          ))}

          <button className="cv-boton cv-boton-guardar" onClick={guardarCV}>
            <Save size={17} />
            Guardar cambios
          </button>
        </section>
      )}

      {/* Barra de herramientas */}
      <div className="cv-barra-herramientas">
        <div className="cv-barra-izquierda">
          <span>A4</span>
          <small>Formato profesional</small>
        </div>

        <div className="cv-barra-derecha">
          <FileText size={16} />
          <strong>Vista previa del documento</strong>
        </div>
      </div>

      {/* Hoja de CV exportable */}
      <div className="cv-vista-contenedor">
        <article className="cv-documento" ref={documentoRef}>
          <div className="cv-documento-encabezado">
            <h1>{cv.nombre || "Nombre del estudiante"}</h1>

            {cv.carrera && (
              <p className="cv-documento-carrera">{cv.carrera}</p>
            )}

            <div className="cv-documento-contacto">
              {[cv.correo, cv.telefono, cv.ubicacion]
                .filter(Boolean)
                .join("  |  ")}
            </div>
          </div>

          {cv.perfil && (
            <section className="cv-documento-seccion">
              <h2>PERFIL PROFESIONAL</h2>
              <p>{cv.perfil}</p>
            </section>
          )}

          <section className="cv-documento-seccion">
            <h2>EDUCACIÓN</h2>

            <div className="cv-documento-fila">
              <strong>{cv.universidad}</strong>
              <span>{cv.periodo}</span>
            </div>

            <p>{cv.carrera}</p>
          </section>

          {cv.proyectos.length > 0 && (
            <section className="cv-documento-seccion">
              <h2>PROYECTOS DESTACADOS</h2>

              {cv.proyectos.map((proyecto) => (
                <div
                  key={proyecto.id}
                  className="cv-documento-proyecto"
                >
                  <strong>{proyecto.nombre}</strong>
                  <p>{proyecto.descripcion}</p>
                </div>
              ))}
            </section>
          )}

          {cv.habilidades && (
            <section className="cv-documento-seccion">
              <h2>HABILIDADES Y COMPETENCIAS</h2>
              <p>{cv.habilidades}</p>
            </section>
          )}
        </article>
      </div>

      <footer className="cv-pie">
        <ArrowLeft size={16} />
        <span>
          Revisa cuidadosamente los datos antes de descargar.
        </span>
      </footer>
    </main>
  );
}
