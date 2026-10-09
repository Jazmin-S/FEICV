
import { useState } from "react";
import {
  ClipboardCheck,
  ChartNoAxesCombined,
  Target,
  TrendingUp,
  CalendarDays,
  BookOpen,
  Info,
} from "lucide-react";
import "./Resultados.css";

const CLAVE = "feicv_diagnosticos";

function obtenerDiagnosticos() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(datos)
      ? datos.filter((dato) => Array.isArray(dato.resultados))
      : [];
  } catch {
    return [];
  }
}

// Clasificación orientativa de la escala 1 a 5
function obtenerNivel(valor) {
  if (valor >= 4) return "Alto";
  if (valor >= 3) return "Medio";
  return "En desarrollo";
}

function fechaLegible(fecha) {
  if (!fecha) return "Fecha no disponible";

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Tarjetas de indicadores
function Indicador({ titulo, valor, descripcion, Icono }) {
  return (
    <article className="resultado-indicador">
      <div className="resultado-indicador-icono">
        <Icono size={24} />
      </div>

      <div>
        <p>{titulo}</p>
        <h2>{valor}</h2>
        <span>{descripcion}</span>
      </div>
    </article>
  );
}

// Gráfica de barras horizontales
function GraficaCompetencias({ competencias }) {
  return (
    <article className="resultado-panel">
      <h3>Nivel por competencia</h3>
      <p>Puntuación obtenida en la autoevaluación</p>

      <div className="resultado-lista-barras">
        {competencias.map((competencia) => {
          const puntuacion = Number(competencia.puntuacion) || 0;
          const nivel = obtenerNivel(puntuacion);

          return (
            <div
              className="resultado-competencia"
              key={competencia.id}
            >
              <div className="resultado-barra-info">
                <span>{competencia.nombre}</span>
                <strong>{puntuacion}/5</strong>
              </div>

              <div
                className="resultado-barra-fondo"
                role="progressbar"
                aria-label={competencia.nombre}
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={puntuacion}
              >
                <div
                  className={`resultado-barra-relleno ${
                    nivel === "Alto"
                      ? "alto"
                      : nivel === "Medio"
                      ? "medio"
                      : "bajo"
                  }`}
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, puntuacion * 20)
                    )}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

// Gráfica circular de distribución
function GraficaDistribucion({ competencias }) {
  const alto = competencias.filter(
    (item) => obtenerNivel(Number(item.puntuacion)) === "Alto"
  ).length;

  const medio = competencias.filter(
    (item) => obtenerNivel(Number(item.puntuacion)) === "Medio"
  ).length;

  const bajo = competencias.filter(
    (item) =>
      obtenerNivel(Number(item.puntuacion)) === "En desarrollo"
  ).length;

  const total = competencias.length || 1;

  const altoPorcentaje = (alto / total) * 100;
  const medioPorcentaje = (medio / total) * 100;

  return (
    <article className="resultado-panel">
      <h3>Distribución de niveles</h3>
      <p>Clasificación de las competencias evaluadas</p>

      <div className="resultado-dona-contenedor">
        <div
          className="resultado-dona"
          role="img"
          aria-label={`${alto} competencias altas, ${medio} medias y ${bajo} en desarrollo`}
          style={{
            background: `conic-gradient(
              #077b44 0% ${altoPorcentaje}%,
              #69aec0 ${altoPorcentaje}%
                ${altoPorcentaje + medioPorcentaje}%,
              #e5a37d ${altoPorcentaje + medioPorcentaje}% 100%
            )`,
          }}
        >
          <div className="resultado-dona-centro">
            <strong>{competencias.length}</strong>
            <small>Competencias</small>
          </div>
        </div>

        <div className="resultado-leyenda">
          <div>
            <span className="resultado-punto alto" />
            Nivel alto <strong>{alto}</strong>
          </div>

          <div>
            <span className="resultado-punto medio" />
            Nivel medio <strong>{medio}</strong>
          </div>

          <div>
            <span className="resultado-punto bajo" />
            En desarrollo <strong>{bajo}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}

// Gráfica de evolución entre diagnósticos
function GraficaEvolucion({ diagnosticos }) {
  const historial = [...diagnosticos]
    .filter((item) => Number.isFinite(Number(item.promedio)))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(-8);

  const ancho = 500;
  const alto = 200;
  const margen = 35;

  const puntos = historial.map((item, index) => {
    const x =
      margen +
      (index * (ancho - margen * 2)) /
        Math.max(historial.length - 1, 1);

    const y =
      alto -
      margen -
      (Math.max(0, Math.min(5, Number(item.promedio))) / 5) *
        (alto - margen * 2);

    return { x, y, ...item };
  });

  const linea = puntos
    .map((punto) => `${punto.x},${punto.y}`)
    .join(" ");

  return (
    <article className="resultado-panel">
      <h3>Evolución del diagnóstico</h3>
      <p>Comparación de los promedios registrados</p>

      {historial.length < 2 ? (
        <div className="resultado-sin-grafica">
          <TrendingUp size={30} />
          <p>
            Realiza al menos dos diagnósticos para
            visualizar tu evolución.
          </p>
        </div>
      ) : (
        <div className="resultado-grafica-linea">
          <svg
            viewBox={`0 0 ${ancho} ${alto}`}
            role="img"
            aria-label="Evolución de promedios entre diagnósticos"
          >
            {[1, 2, 3, 4, 5].map((valor) => {
              const y =
                alto -
                margen -
                (valor / 5) * (alto - margen * 2);

              return (
                <g key={valor}>
                  <line
                    x1={margen}
                    x2={ancho - margen}
                    y1={y}
                    y2={y}
                    stroke="#dce8ef"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="12"
                    y={y + 4}
                    fontSize="12"
                    fill="#698095"
                  >
                    {valor}
                  </text>
                </g>
              );
            })}

            <polyline
              points={linea}
              fill="none"
              stroke="#087b44"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {puntos.map((punto, index) => (
              <g key={punto.id || index}>
                <circle
                  cx={punto.x}
                  cy={punto.y}
                  r="5"
                  fill="#087b44"
                />

                <text
                  x={punto.x}
                  y={punto.y - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#17324a"
                >
                  {Number(punto.promedio).toFixed(1)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </article>
  );
}

// Evidencias declaradas por el estudiante
function ListaEvidencias({ competencias }) {
  const evidencias = competencias.filter(
    (item) => item.evidencia?.trim()
  );

  return (
    <article className="resultado-panel">
      <h3>Evidencias registradas</h3>
      <p>Experiencias descritas durante la evaluación</p>

      {evidencias.length === 0 ? (
        <p className="resultado-vacio-texto">
          No se registraron evidencias en este diagnóstico.
        </p>
      ) : (
        <div className="resultado-evidencias">
          {evidencias.map((item) => (
            <div key={item.id}>
              <strong>{item.nombre}</strong>
              <p>{item.evidencia}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

// Componente principal
export default function Resultados({ onIrEvaluacion }) {
  const [diagnosticos] = useState(obtenerDiagnosticos);
  const [seleccionado, setSeleccionado] = useState(0);

  const ordenados = [...diagnosticos].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  const actual = ordenados[seleccionado];

  if (!actual) {
    return (
      <section className="resultados-pagina">
        <header className="resultados-encabezado">
          <h1>Resultados de la evaluación</h1>
          <p>
            Consulta los resultados de acuerdo con las
            evaluaciones presentadas.
          </p>
        </header>

        <div className="resultados-sin-datos">
          <ClipboardCheck size={55} />
          <h2>Aún no tienes resultados</h2>
          <p>
            Primero necesitas completar una evaluación
            diagnóstica para consultar tus competencias.
          </p>

          {onIrEvaluacion && (
            <button
              className="resultados-boton"
              onClick={onIrEvaluacion}
            >
              Realizar evaluación
            </button>
          )}
        </div>
      </section>
    );
  }

  const competencias = Array.isArray(actual.resultados)
    ? actual.resultados
    : [];

  const promedio = Number(actual.promedio) || 0;

  const altas = competencias.filter(
    (item) => Number(item.puntuacion) >= 4
  ).length;

  return (
    <section className="resultados-pagina">
      <header className="resultados-encabezado">
        <div>
          <h1>Resultados de la evaluación</h1>
          <p>
            Consulta los resultados de acuerdo con las
            evaluaciones presentadas.
          </p>
        </div>

        <div className="resultados-filtro">
          <label htmlFor="diagnostico-select">
            Diagnóstico
          </label>

          <select
            id="diagnostico-select"
            value={seleccionado}
            onChange={(e) =>
              setSeleccionado(Number(e.target.value))
            }
          >
            {ordenados.map((item, index) => (
              <option key={item.id || index} value={index}>
                {fechaLegible(item.fecha)} — #{ordenados.length - index}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Indicadores principales */}
      <div className="resultados-indicadores">
        <Indicador
          titulo="Diagnósticos realizados"
          valor={diagnosticos.length}
          descripcion="Evaluaciones registradas"
          Icono={ClipboardCheck}
        />

        <Indicador
          titulo="Promedio general"
          valor={`${promedio.toFixed(1)}/5`}
          descripcion="Percepción de competencias"
          Icono={ChartNoAxesCombined}
        />

        <Indicador
          titulo="Competencias evaluadas"
          valor={competencias.length}
          descripcion="Áreas del diagnóstico"
          Icono={BookOpen}
        />

        <Indicador
          titulo="Competencias nivel alto"
          valor={altas}
          descripcion="Puntuación de 4 o 5"
          Icono={Target}
        />
      </div>

      {/* Gráficas principales */}
      <div className="resultados-grid">
        <GraficaCompetencias competencias={competencias} />
        <GraficaDistribucion competencias={competencias} />
        <GraficaEvolucion diagnosticos={diagnosticos} />
        <ListaEvidencias competencias={competencias} />
      </div>

      {/* Información del diagnóstico */}
      <div className="resultados-pie">
        <CalendarDays size={17} />
        <span>
          Diagnóstico seleccionado: {fechaLegible(actual.fecha)}
        </span>
      </div>

      <div className="resultados-aviso">
        <Info size={19} />
        <p>
          Estos resultados corresponden a una autoevaluación.
          Las puntuaciones muestran la percepción del
          estudiante y no constituyen una certificación
          oficial de competencias.
        </p>
      </div>
    </section>
  );
}
