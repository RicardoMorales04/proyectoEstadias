import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="navbar-brand">
            <img src="/imagenes/menu.png" alt="Menú"></img>
          </div>
          <div className="navbar-brand-logo">
            <a href="http://localhost:3000"><img src="/imagenes/logo_blanco.jpg" alt="Logo"></img></a>
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
            <li><a href="http://localhost:3000/Paginas/blog">BLOG</a></li>
            <li><a href="http://localhost:3000/Paginas/proyectos">PROYECTOS</a></li>
            <li><a href="http://localhost:3000/Paginas/login">LOGIN</a></li>
          </ul>
        </div>

        {children}
        <footer>
            <div className="contenedor-mapa">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8518.983113962704!2d-100.01360384677483!3d20.36759990579274!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x16daa5dc56c8c592!2sUniversidad%20Tecnol%C3%B3gica%20de%20San%20Juan%20del%20R%C3%ADo!5e0!3m2!1ses!2smx!4v1657510541631!5m2!1ses!2smx"
                    style={{ border: 0, width: '600px', height: '450px', borderRadius: '20px' }} // Aquí está el objeto de estilo
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa de ubicación"
                ></iframe>
            </div>
            <div className="direccion">
                <p>Av. La Palma No. 125, Col. Vista Hermosa | San Juan del Río, Qro. | Tel. (427) 129 20 00 | C.P. 76800</p>
            </div>
            <div  className="aviso-privacidad">
                <a href="/docs/avisoprivacidad.pdf" target="_blank">Aviso de privacidad</a>
            </div>
            </footer>
      </body>
    </html>
  );
}
