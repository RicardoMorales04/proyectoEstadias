import "../../../../public/css/registro.css"

function Registro(){
    return(
        <div class="container">
            <h1>Registro de Talleres</h1>
            <table>
                <thead>
                    <tr>
                        <th>Profesor</th>
                        <th>Proyecto</th>
                        <th>Horario</th>
                        <th>Formulario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Profesor 1</td>
                        <td>Proyecto reconocimiento facial</td>
                        <td>Lunes 9:00 - 11:00</td>
                        <td><a href="http://localhost:3000/Paginas/registro/formulario">Registrarse</a></td>
                    </tr>
                    <tr>
                        <td>Profesor 2</td>
                        <td>Proyecto IA</td>
                        <td>Miércoles 14:00 - 16:00</td>
                        <td><a href="http://localhost:3000/Paginas/registro/formulario">Registrarse</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Registro
