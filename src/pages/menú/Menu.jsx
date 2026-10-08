import Catalogo from "../catalogo/Catalogo";
import Perfil from "../perfilacademico/Perfil";
import { useState } from "react";
import {
  LayoutDashboard,
  UserRound,
  Server,
  Grid2X2,
  ClipboardList,
  Menu as MenuIcon,
  X,
  GraduationCap,
} from "lucide-react";
import "./Menu.css";

const opcionesMenu = [
  { id: "inicio", nombre: "Menú Principal", icono: LayoutDashboard },
  { id: "perfil", nombre: "Perfil Académico", icono: UserRound },
  { id: "catalogo", nombre: "Catálogo de EE", icono: Server },
  { id: "resultados", nombre: "Resultados de la evaluación", icono: Grid2X2 },
  { id: "cv", nombre: "Descarga CV", icono: ClipboardList },
];

// Información
const estudiante = {
  nombre: "Jazmin Viveros Sarmiento",
  correo: "zs23014159@estudiantes.uv.mx",
  carrera: "Ing. Sistemas y Tecnologías de la Información",
  semestre: "Séptimo semestre",
  avance: 68,
  promedio: 9.3,
  creditos: 240,
  totalCreditos: 360,
  diagnosticos: 1,
  totalDiagnosticos: 2,
};

function Tarjeta({ titulo, valor, detalle, color }) {
  return (
    <article className="menu-tarjeta">
      <h3>{titulo}</h3>
      <strong className={`menu-tarjeta-valor ${color}`}>
        {valor}
      </strong>
      <p>{detalle}</p>
    </article>
  );
}

function GraficoAvance() {
  return (
    <article className="menu-grafico menu-grafico-avance">
      <h3>Avance Curricular Global</h3>
      <p>Progreso Semestral</p>

      <div
        className="menu-dona"
        style={{ "--porcentaje": `${estudiante.avance}%` }}
      >
        <div className="menu-dona-centro">
          {estudiante.avance}%
        </div>
      </div>

      <div className="menu-leyenda">
        <span>
          <i className="menu-punto azul" />
          {estudiante.avance}% completado
        </span>
        <span>
          <i className="menu-punto gris" />
          {100 - estudiante.avance}% restante
        </span>
      </div>
    </article>
  );
}

function GraficoPromedios() {
  const promedios = [8.9, 9.0, 9.1, 9.2, 9.2, 9.3];

  const puntos = promedios.map((valor, indice) => {
    const x = 30 + indice * 54;
    const y = 125 - (valor - 8.5) * 100;
    return `${x},${y}`;
  });

  return (
    <article className="menu-grafico">
      <h3>Historial de Promedios</h3>
      <p>GPA (Ponderación de 9.3)</p>

      <svg viewBox="0 0 330 165" className="menu-linea">
        {[45, 75, 105, 135].map((y) => (
          <line
            key={y}
            x1="25"
            x2="310"
            y1={y}
            y2={y}
            stroke="#d9e5f0"
            strokeDasharray="4 4"
          />
        ))}

        <polyline
          points={puntos.join(" ")}
          fill="none"
          stroke="#2878a8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {promedios.map((valor, indice) => {
          const x = 30 + indice * 54;
          const y = 125 - (valor - 8.5) * 100;

          return (
            <g key={indice}>
              <circle cx={x} cy={y} r="4" fill="#2878a8" />
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                fontSize="12"
                fill="#28445c"
              >
                {valor.toFixed(1)}
              </text>
              <text
                x={x}
                y="155"
                textAnchor="middle"
                fontSize="10"
                fill="#637b90"
              >
                {indice + 1}°
              </text>
            </g>
          );
        })}
      </svg>

      <div className="menu-grafico-pie">
        <span className="menu-estado-excelente">Excelente</span>
      </div>
    </article>
  );
}

function GraficoCreditos() {
  const porcentaje =
    (estudiante.creditos / estudiante.totalCreditos) * 100;

  return (
    <article className="menu-grafico">
      <h3>Créditos Académicos</h3>
      <p>Estado de Créditos</p>

      <div className="menu-creditos-contenido">
        <div className="menu-barra-creditos">
          <div
            className="menu-barra-completada"
            style={{ width: `${porcentaje}%` }}
          >
            {estudiante.creditos}
          </div>
          <div className="menu-barra-restante">
            {estudiante.totalCreditos - estudiante.creditos}
          </div>
        </div>

        <div className="menu-leyenda">
          <span><i className="menu-punto azul" /> Acumulados</span>
          <span><i className="menu-punto gris" /> Restantes</span>
        </div>

        <strong className="menu-porcentaje">
          {porcentaje.toFixed(1)}% completado
        </strong>
      </div>
    </article>
  );
}

function GraficoDiagnosticos() {
  return (
    <article className="menu-grafico menu-grafico-diagnosticos">
      <h3>Diagnósticos de Competencias</h3>
      <p>Evaluación de Competencias</p>

      <div className="menu-diagnosticos-contenido">
        <svg viewBox="0 0 220 180" className="menu-radar">
          <polygon
            points="110,15 195,60 175,150 45,150 25,60"
            fill="none"
            stroke="#bed3e4"
            strokeWidth="2"
          />
          <polygon
            points="110,48 161,75 149,130 71,130 59,75"
            fill="none"
            stroke="#bed3e4"
            strokeWidth="1.5"
          />
          <polygon
            points="110,35 169,82 145,128 75,119 49,81"
            fill="#4389b5"
            fillOpacity="0.7"
            stroke="#2878a8"
            strokeWidth="2"
          />

          {[
            [110, 15], [195, 60], [175, 150],
            [45, 150], [25, 60],
          ].map(([x, y], i) => (
            <line
              key={i}
              x1="110"
              y1="95"
              x2={x}
              y2={y}
              stroke="#bed3e4"
              strokeWidth="1"
            />
          ))}
        </svg>

        <div className="menu-diagnosticos-info">
          <strong>
            {estudiante.diagnosticos} de{" "}
            {estudiante.totalDiagnosticos}
          </strong>
          <span>Completados</span>
          <span className="menu-estado">En proceso</span>
          <small>Diagnóstico 2 pendiente</small>
        </div>
      </div>
    </article>
  );
}

export default function Menu() {
  const [opcionActiva, setOpcionActiva] = useState("inicio");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const seleccionarOpcion = (id) => {
    setOpcionActiva(id);
    setMenuAbierto(false);
  };

  return (
    <div className="menu-pagina">
      <button
        className="menu-boton-movil"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Abrir o cerrar menú"
      >
        {menuAbierto ? <X size={23} /> : <MenuIcon size={23} />}
      </button>

      {menuAbierto && (
        <div
          className="menu-overlay"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <div className="menu-layout">
        <aside className={`menu-sidebar ${menuAbierto ? "abierto" : ""}`}>
          <div className="menu-sidebar-superior">
            <span className="menu-nombre-corto">
              {estudiante.nombre}
            </span>
            <h2>{estudiante.carrera}</h2>
          </div>

          <nav className="menu-navegacion" aria-label="Menú principal">
            {opcionesMenu.map((opcion, indice) => {
              const Icono = opcion.icono;
              return (
                <button
                  key={opcion.id}
                  type="button"
                  className={`menu-opcion ${
                    opcionActiva === opcion.id ? "activa" : ""
                  } ${indice === 2 ? "separador" : ""}`}
                  onClick={() => seleccionarOpcion(opcion.id)}
                >
                  <Icono size={19} strokeWidth={2} />
                  <span>{opcion.nombre}</span>
                </button>
              );
            })}
          </nav>

          <div className="menu-usuario">
            <div className="menu-avatar">
              <UserRound size={23} />
            </div>
            <div className="menu-usuario-info">
              <strong>{estudiante.nombre}</strong>
              <span>{estudiante.correo}</span>
            </div>
          </div>
        </aside>

        <main className="menu-contenido">
          {opcionActiva === "inicio" ? (
            <>
              <header className="menu-encabezado">
                <h1>Bienvenid@ de vuelta, Jazmin</h1>
              </header>

              <section className="menu-estadisticas">
                <Tarjeta
                  titulo="AVANCE CURRICULAR"
                  valor={`${estudiante.avance}%`}
                  detalle={estudiante.semestre}
                  color="violeta"
                />
                <Tarjeta
                  titulo="PROMEDIO GENERAL"
                  valor={estudiante.promedio}
                  detalle="+0.4 este periodo"
                  color="verde"
                />
                <Tarjeta
                  titulo="CRÉDITOS ACUMULADOS"
                  valor={`${estudiante.creditos} / ${estudiante.totalCreditos}`}
                  detalle={`${
                    estudiante.totalCreditos - estudiante.creditos
                  } restantes`}
                  color="naranja"
                />
                <Tarjeta
                  titulo="DIAGNÓSTICOS LISTOS"
                  valor={`${estudiante.diagnosticos} / ${estudiante.totalDiagnosticos}`}
                  detalle="EE evaluadas"
                  color="oscuro"
                />
              </section>

              <section className="menu-graficos">
                <GraficoAvance />
                <GraficoPromedios />
                <GraficoCreditos />
                <GraficoDiagnosticos />
              </section>
            </>
                    ) : opcionActiva === "perfil" ? (
            <Perfil />
          ) : opcionActiva === "catalogo" ? (
            <Catalogo />
          ) : (
            <section className="menu-vista-secundaria">
              <GraduationCap size={42} />
              <h1>
                {opcionesMenu.find(
                  (opcion) => opcion.id === opcionActiva
                )?.nombre}
              </h1>
              <p>Seleccionaste esta sección del sistema.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
