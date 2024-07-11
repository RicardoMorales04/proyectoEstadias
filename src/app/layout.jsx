"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import "./globals.css";

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get('user');
    setIsLoggedIn(!!userCookie);
  }, []);

  const handleLogout = () => {
    Cookies.remove('user');
    setIsLoggedIn(false);
    router.push('/pages/login');
  };

  const handleLogin = () => {
    router.push('/pages/login');
  };

  const toggleMenu = () => {
    document.querySelector('.mostrar').classList.toggle('open');
  };

  const closeMenu = () => {
    document.querySelector('.mostrar').classList.remove('open');
  };

  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="navbar-brand" onClick={toggleMenu}>
            <img src="/imagenes/menu.png" alt="Menú" />
          </div>

          <nav className="mostrar">
            <div className="mostrar_flex mostrar-nav">
              <div onClick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16">
                  <path fill="currentColor" fillRule="evenodd" d="m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884L7.116 8z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>

            <div className="mostrar-header">
              <img src="/imagenes/actitudLobo.png" alt="Actitud Lobo" />
            </div>

            <div className="accesos_principales">
              <ul id="accordion2" className="accordion2">
                <li className="first">
                  <a href="/index.php">
                    <div className="link2">Inicio</div>
                  </a>
                </li>
                <li className="link_r">
                  <div className="link2">
                    Datos Institucionales<i className="fa fa-chevron-down"></i>
                  </div>
                  <ul className="submenu2 scroll-normatividad">
                    <li><a href="/datos_institucionales.php#quienes">¿Quiénes Somos?</a></li>
                    <li><a href="/datos_institucionales.php#filosofia">Filosofía Institucional</a></li>
                    <li><a href="/modeloEducativo.php">Modelo Educativo</a></li>
                    <li><a href="/directorio.php">Directorio</a></li>
                    <li><a href="/ubicacion.php">Ubicación</a></li>
                    <li><a href="/datos_institucionales.php#uaj">Unidad Académica de Jalpan</a></li>
                  </ul>
                </li>
                <li className="link_r">
                  <div className="link2">
                    Vinculación<i className="fa fa-chevron-down"></i>
                  </div>
                  <ul className="submenu2 scroll-normatividad">
                    <li><a href="/vinculacion/serviciosTecnologicos.php">Servicios Tecnológicos</a></li>
                    <li><a href="/vinculacion/incubadora.php">Incubadora de Negocios</a></li>
                    <li><a href="/vinculacion/practicasEstadias.php">Prácticas y Estadías</a></li>
                    <li><a href="/vinculacion/ciut.php">Centro de Idiomas CIUT</a></li>
                    <li><a href="/vinculacion/bolsaDeTrabajo.php">Bolsa de Trabajo</a></li>
                    <li><a href="/vinculacion/servicioSocial.php">Servicio Social</a></li>
                    <li><a href="/vinculacion/seguimientoEgresados.php">Seguimiento de Egresados</a></li>
                    <li><a href="http://200.188.14.50/cursos_educacion_continua/jsp/muestra_curso.jsp" target="_blank">Educación Continua</a></li>
                  </ul>
                </li>
                <li>
                  <a href="/investigacion.php">
                    <div className="link2">Investigación</div>
                  </a>
                </li>
                <li className="link_r">
                  <div className="link2">
                    Normatividad<i className="fa fa-chevron-down"></i>
                  </div>
                  <ul className="submenu2 scroll-normatividad2">
                    <li><a href="/avisos_privacidad.php">Avisos de Privacidad</a></li>
                    <li><a href="/organizacional/organiza.php">Equidad de Género</a></li>
                    <li><a href="http://administrativos.utsjr.edu.mx/p/jsp/transparencia/archivos_transparencia_nacional.jsp" target="_blank">Unidad de Transparencia UTSJR - Estatal </a></li>
                    <li><a href="https://www.plataformadetransparencia.org.mx/" target="_blank">Plataforma Nacional de Transparencia</a></li>
                    <li><a href="/contGuber.php">Ley General de Contabilidad Gubernamental</a></li>
                    <li><a href="/contraloriaSocial.php">Contraloría Social</a></li>
                    <li><a href="http://administrativos.utsjr.edu.mx/p/jsp/gestion_de_los_recursos/proy_penzio/penzionez.jsp" target="_blank">Pensiones</a></li>
                    <li><a href="http://administrativos.utsjr.edu.mx/p/jsp/gestion_de_los_recursos/proy_jubila/jubilazion.jsp" target="_blank">Jubilaciones</a></li>
                    <li><a href="/docs/docs-codigos/codigo_etica.pdf" target="_blank">Código de Ética</a></li>
                    <li><a href="/docs/docs-codigos/codigo_conducta.pdf" target="_blank">Código de Conducta</a></li>
                    <li><a href="/docs/docs-codigos/ley_trasparencia.pdf" target="_blank">Ley de Transparencia y Acceso a la Información Pública del Estado de Querétaro</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
          
          <div className="navbar-brand-logo">
            <a href="/">
              <img src="/imagenes/logo_blanco.jpg" alt="Logo" />
            </a>
          </div>
          <div className="navbar-search">
            <input type="text" className="search-input" placeholder="Buscar" />
            <button type="submit" className="search-button"></button>
          </div>
          <button className="arrow-button">
            <div className="ellipse"></div>
          </button>
        </nav>

        <div className="mini-menu">
          <ul>
            <li><a href="/">INICIO</a></li>
            <li><a href="/pages/blog">BLOG</a></li>
            <li><a href="/pages/proyectos">PROYECTOS</a></li>
            {isLoggedIn ? (
              <li><a href="#" onClick={handleLogout}>CERRAR SESIÓN</a></li>
            ) : (
              <li><a href="#" onClick={handleLogin}>INICIAR SESIÓN</a></li>
            )}
          </ul>
        </div>

        {children}

        <footer>
          <div className="contenedor-mapa">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8518.983113962704!2d-100.01360384677483!3d20.36759990579274!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x16daa5dc56c8c592!2sUniversidad%20Tecnol%C3%B3gica%20de%20San%20Juan%20del%20R%C3%ADo!5e0!3m2!1ses!2smx!4v1657510541631!5m2!1ses!2smx"
              style={{ border: 0, width: '600px', height: '450px', borderRadius: '20px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            ></iframe>
          </div>
          <div className="direccion">
            <p>Av. La Palma No. 125, Col. Vista Hermosa | San Juan del Río, Qro. | Tel. (427) 129 20 00 | C.P. 76800</p>
          </div>
          <div className="aviso-privacidad">
            <a href="/docs/avisoprivacidad.pdf" target="_blank">Aviso de privacidad</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
