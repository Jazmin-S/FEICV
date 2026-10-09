
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
} from "lucide-react";
import "./Evaluacion.css";

const CLAVE = "feicv_diagnosticos";

// Competencias que se evaluarán
const COMPETENCIAS = [
  {
    id: "analisis",
    nombre: "Análisis y resolución de problemas",
    descripcion:
      "Identificar necesidades y proponer soluciones justificadas.",
  },
  {
    id: "tecnica",
    nombre: "Aplicación de conocimientos técnicos",
    descripcion:
      "Utilizar herramientas y conocimientos en situaciones prácticas.",
  },
  {
    id: "comunicacion",
    nombre: "Comunicación",
    descripcion:
      "Explicar ideas, decisiones y resultados con claridad.",
  },
  {
    id: "colaboracion",
    nombre: "Trabajo colaborativo",
    descripcion:
      "Coordinar tareas, escuchar y contribuir a objetivos compartidos.",
  },
  {
    id: "autonomia",
    nombre: "Aprendizaje autónomo",
    descripcion:
      "Investigar, adaptarse y mejorar a partir de la experiencia.",
  },
];

// Generación de las preguntas
const PREGUNTAS = COMPETENCIAS.map((competencia) => ({
  ...competencia,
  texto: `¿Con qué frecuencia has demostrado ${competencia.nombre.toLowerCase()} en tus actividades académicas?`,
}));

// Escala de evaluación
const OPCIONES = [
  { valor: 1, texto: "Nunca o casi nunca" },
  { valor: 2, texto: "Pocas veces" },
  { valor: 3, texto: "Algunas veces" },
  { valor: 4, texto: "Frecuentemente" },
  { valor: 5, texto: "De manera consistente" },
];

// Leer información almacenada en el navegador
function leerArreglo(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

// Generar los resultados del diagnóstico
function crearDiagnostico(respuestas, evidencias) {
  const resultados = PREGUNTAS.map(({ id, nombre }) => ({
    id,
    nombre,
    puntuacion: respuestas[id],
    evidencia: evidencias[id]?.trim() || "",
  }));

  const promedio =
    resultados.reduce(
      (total, item) => total + item.puntuacion,
      0
    ) / resultados.length;

  return {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    tipo: "autoevaluacion",
    version: 1,
    resultados,
    promedio: Number(promedio.toFixed(2)),
  };
}

// Componente principal
export default function Evaluacion({ experiencia = null }) {
  const [registros, setRegistros] = useState(() =>
    leerArreglo(CLAVE)
  );

  const [fase, setFase] = useState("inicio");
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [evidencias, setEvidencias] = useState({});
  const [ultimo, setUltimo] = useState(null);
  const [error, setError] = useState("");

  // Información académica registrada
  const proyectos = leerArreglo("feicv_proyectos");
  const conocimientos = leerArreglo("feicv_conocimientos");

  const pregunta = PREGUNTAS[indice];
  const respondidas = Object.keys(respuestas).length;

  // Iniciar o reiniciar la evaluación
  function comenzar() {
    setRespuestas({});
    setEvidencias({});
    setIndice(0);
    setUltimo(null);
    setError("");
    setFase("preguntas");
  }

  // Avanzar entre preguntas
  function avanzar() {
    if (!respuestas[pregunta.id]) {
      setError(
        "Selecciona una respuesta antes de continuar."
      );
      return;
    }

    setError("");

    if (indice < PREGUNTAS.length - 1) {
      setIndice((valor) => valor + 1);
      return;
    }

    // Cuando termina, generar el diagnóstico
    const registro = crearDiagnostico(
      respuestas,
      evidencias
    );

    const actualizados = [registro, ...registros];

    try {
      localStorage.setItem(
        CLAVE,
        JSON.stringify(actualizados)
      );

      setRegistros(actualizados);
      setUltimo(registro);
      setFase("resultado");
    } catch {
      setError(
        "No fue posible guardar el diagnóstico en este navegador. Libera espacio e inténtalo de nuevo."
      );
    }
  }

  return (
    <section className="evaluacion-pagina">
      {/* Encabezado */}
      <header className="evaluacion-cabecera">
        <span className="evaluacion-etiqueta">
          <ClipboardCheck size={17} />
          Diagnóstico de competencias
        </span>

        <h1>Evaluación diagnóstica</h1>

        <p>
          Reflexiona sobre las competencias que has
          desarrollado durante tu trayectoria académica.
          Los resultados son orientativos y se basan
          en tus respuestas.
        </p>

        {experiencia && (
          <p className="evaluacion-contexto">
            Desde el catálogo:{" "}
            <strong>{experiencia.nombre}</strong>.
            Esta primera evaluación es general.
          </p>
        )}
      </header>

      {/* ETAPA 1: Inicio */}
      {fase === "inicio" && (
        <div className="evaluacion-tarjeta">
          <h2>Antes de comenzar</h2>

          <p>
            Responderás {PREGUNTAS.length} preguntas,
            una por competencia. Selecciona con qué
            frecuencia has demostrado cada capacidad
            y describe, si lo deseas, un ejemplo concreto.
          </p>

          <div className="evaluacion-resumen">
            <span>
              <strong>{proyectos.length}</strong>
              {" "}proyectos registrados
            </span>

            <span>
              <strong>{conocimientos.length}</strong>
              {" "}conocimientos registrados
            </span>

            <span>
              <strong>{registros.length}</strong>
              {" "}diagnósticos guardados
            </span>
          </div>

          <p className="evaluacion-nota">
            Los proyectos y conocimientos del catálogo
            pueden servirte como evidencia; todavía
            no se califican automáticamente.
          </p>

          <button
            className="evaluacion-boton"
            onClick={comenzar}
          >
            Comenzar diagnóstico
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* ETAPA 2: Cuestionario */}
      {fase === "preguntas" && (
        <div className="evaluacion-tarjeta">
          <div className="evaluacion-progreso-texto">
            <span>
              Pregunta {indice + 1} de {PREGUNTAS.length}
            </span>

            <span>{respondidas} respondidas</span>
          </div>

          <div className="evaluacion-progreso">
            <div
              style={{
                width: `${
                  (respondidas / PREGUNTAS.length) * 100
                }%`,
              }}
            />
          </div>

          <h2>{pregunta.nombre}</h2>
          <p>{pregunta.descripcion}</p>

          <fieldset className="evaluacion-opciones">
            <legend>{pregunta.texto}</legend>

            {OPCIONES.map((opcion) => (
              <label
                key={opcion.valor}
                className={
                  respuestas[pregunta.id] === opcion.valor
                    ? "seleccionada"
                    : ""
                }
              >
                <input
                  type="radio"
                  name={`pregunta-${pregunta.id}`}
                  value={opcion.valor}
                  checked={
                    respuestas[pregunta.id] === opcion.valor
                  }
                  onChange={() => {
                    setRespuestas((actual) => ({
                      ...actual,
                      [pregunta.id]: opcion.valor,
                    }));

                    setError("");
                  }}
                />

                <span>{opcion.texto}</span>
              </label>
            ))}
          </fieldset>

          {/* Evidencia opcional */}
          <label
            className="evaluacion-evidencia"
            htmlFor="evidencia"
          >
            Ejemplo o evidencia (opcional)
          </label>

          <textarea
            id="evidencia"
            rows={3}
            maxLength={600}
            placeholder="Ejemplo: participé en un proyecto donde..."
            value={evidencias[pregunta.id] || ""}
            onChange={(e) =>
              setEvidencias((actual) => ({
                ...actual,
                [pregunta.id]: e.target.value,
              }))
            }
          />

          {error && (
            <p className="evaluacion-error" role="alert">
              {error}
            </p>
          )}

          {/* Navegación */}
          <div className="evaluacion-acciones">
            <button
              className="evaluacion-boton secundario"
              onClick={() =>
                indice === 0
                  ? setFase("inicio")
                  : setIndice((valor) => valor - 1)
              }
            >
              <ArrowLeft size={18} />
              Atrás
            </button>

            <button
              className="evaluacion-boton"
              onClick={avanzar}
            >
              {indice === PREGUNTAS.length - 1
                ? "Finalizar"
                : "Siguiente"}

              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 3: Resultados */}
      {fase === "resultado" && ultimo && (
        <div className="evaluacion-tarjeta">
          <div className="evaluacion-finalizado">
            <CheckCircle2 size={23} />
            Diagnóstico guardado
          </div>

          <h2>Resultados de tu autoevaluación</h2>

          <p>
            Promedio de percepción:{" "}
            <strong>
              {ultimo.promedio.toFixed(1)} de 5
            </strong>.
            Este número resume tus respuestas,
            no acredita formalmente una competencia.
          </p>

          <div className="evaluacion-resultados">
            {ultimo.resultados.map((resultado) => (
              <div
                key={resultado.id}
                className="evaluacion-resultado"
              >
                <div>
                  <strong>{resultado.nombre}</strong>
                  <span>
                    {resultado.puntuacion}/5
                  </span>
                </div>

                <div className="evaluacion-barra">
                  <div
                    style={{
                      width: `${
                        resultado.puntuacion * 20
                      }%`,
                    }}
                  />
                </div>

                {resultado.evidencia && (
                  <p>
                    Evidencia declarada:{" "}
                    {resultado.evidencia}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            className="evaluacion-boton"
            onClick={comenzar}
          >
            <RotateCcw size={17} />
            Realizar otro diagnóstico
          </button>
        </div>
      )}
    </section>
  );
}
