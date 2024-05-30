import "../../../../public/css/proyectos.css"

function Proyectos(){
    return(
        <div className="container">
            <h1 className="tit">Registro a Proyectos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Profesor</th>
                        <th>Proyecto</th>
                        <th>Horario</th>
                        <th>Alumnos Registrados</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Profesor 1</td>
                        <td>Proyecto reconocimiento facial</td>
                        <td>Lunes 9:00 - 11:00</td>
                        <td><a href="http://localhost:3000/Paginas/registro/registrados">Integrantes</a></td>
                    </tr>
                    <tr>
                        <td>Profesor 2</td>
                        <td>Proyecto IA</td>
                        <td>Miércoles 14:00 - 16:00</td>
                        <td><a href="http://localhost:3000/Paginas/registro/registrados">Integrantes</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Proyectos
