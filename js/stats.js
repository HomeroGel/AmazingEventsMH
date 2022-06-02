let events;
async function obtenerDatos(){
    await fetch("https://amazing-events.herokuapp.com/api/events")
    .then(res => res.json())
    .then(json => datosApi = json) //Eventos seria mi data.js

    events = datosApi.events;
    console.log(events);

    let fecha = datosApi.currentDate;
    console.log(fecha);
    let arrayPast = events.filter((e) => fecha > e.date)
    console.log(arrayPast); //30
    let arrayFuture = events.filter((e) => fecha < e.date)
    console.log(arrayFuture); //20

    //PRIMER 
    //TABLA

    let porcentajes = [];
    
    arrayPast.map(eventos => { //Obtento un array que tiene el nombre del evento y su porcentaje de asistencia.
        porcentajes.push({
            eventos: eventos.name,
            porcAssist: ((eventos.assistance * 100) / eventos.capacity).toFixed(2)
        })
    })
    console.log(porcentajes);

    let max = porcentajes.sort((a,b) => b.porcAssist - a.porcAssist)[0] //me da el maximo porcentaje de assist
    console.log(max);
    let min = porcentajes.sort((a,b) => a.porcAssist - b.porcAssist)[0] //me da el min porcentaje de assist
    console.log(min);
    let largerCapacity = events.filter(e => e.capacity).sort((a,b) => b.capacity - a.capacity)[0] //ordeno de mayor a menor y me quedo con el primero (mayor capacidad)
    console.log(largerCapacity);

    //EVENTOS FUTUROS (2da tabla)

    let catFuturas = arrayFuture.map(eventos => eventos.category) //guardo categorias futuras
    let setCatFuturas = new Set(catFuturas); //al estar repetidas las seteo.
    let arrayCatFuturas = [...setCatFuturas]
    

    let categoryFut = []; //queda un array de 6 objetos, con 2 prop, category (nombre de cat) y evento (array del nombre de los eventos de esa cat)
    arrayCatFuturas.map(cat =>
        categoryFut.push({
        category: cat,
        evento: arrayFuture.filter(evento => evento.category === cat)
    }))
    console.log(categoryFut);

    let estimateCapFuture = [];
    categoryFut.map(datos => {
        console.log(datos.evento);
        estimateCapFuture.push({
            category: datos.category,
            estimate: datos.evento.map(cadaItem => cadaItem.estimate),
            capacity: datos.evento.map(cadaItem => cadaItem.capacity),
            estimateRevenue: datos.evento.map(cadaItem => cadaItem.estimate * cadaItem.price)
        })
    })
    console.log(estimateCapFuture);


    estimateCapFuture.forEach(cat => {
        let totalEstimado = 0;
        cat.estimate.forEach(estimate => totalEstimado += Number(estimate)) //Me queda la suma de asistencia
        cat.estimate = totalEstimado;


        let totalCapFutura = 0;
        cat.capacity.forEach(cap => totalCapFutura += Number(cap)) //me queda la suma de capacidad
        cat.capacity = totalCapFutura;

        let totalIngresosEstimados = 0;
        cat.estimateRevenue.forEach(estRev => totalIngresosEstimados += Number(estRev)) //me queda la suma de ingresos
        cat.estimateRevenue = totalIngresosEstimados;

        cat.porcentajeAttendace = ((totalEstimado * 100) / totalCapFutura).toFixed(2) //agrego una nueva propiedad, que seria el calculo de % asistencia por cat
    })
    console.log(estimateCapFuture);

    //EVENTOS PASADOS  (3er tabla)

    let catPasadas = arrayPast.map(e => e.category)
    let setPasadas = new Set(catPasadas);
    let setCatPasadas = [...setPasadas]
    console.log(setCatPasadas);

    let categoryPast = [] //Me queda las categorias que tienen adentro los eventos pasados.
    setCatPasadas.map(category =>
        categoryPast.push({
            category: category,
            evento: arrayPast.filter(evento => evento.category === category)
        })
    )
    console.log(categoryPast);

    let asistYCapPast = []; //devuelve un array de obj con prop cat asist cap y rev
    categoryPast.map(datos =>{
        asistYCapPast.push({
            category: datos.category,
            assistance: datos.evento.map(cadaItem => cadaItem.assistance),
            capacity: datos.evento.map(cadaItem => cadaItem.capacity),
            revenue: datos.evento.map(cadaItem => cadaItem.assistance * cadaItem.price)
        })
    })
    console.log(asistYCapPast);

    //Ahora sumo todos los elementos de cada prop entre si(asist, cap, rev)

    asistYCapPast.forEach(category =>{
        let totalAssist = 0
        category.assistance.forEach(assistance => totalAssist += Number(assistance)) //suma de asistencia
        category.assistance = totalAssist;

        let totalCapacity = 0;
        category.capacity.forEach(capacity => totalCapacity += Number(capacity)) //suma de cap
        category.capacity = totalCapacity

        let totalRevPast = 0; 
        category.revenue.forEach(revenue => totalRevPast += Number(revenue))//suma de rev
        category.revenue = totalRevPast;

        category.porcentaje = ((totalAssist * 100) / totalCapacity).toFixed(2) //prop %asistencia total por cat
    })
    console.log(asistYCapPast);


    //Impresion tablas

    function imprimirTablaUno(){
        let contenedor1 = `<td scope="row"><b>${max.eventos}:</b> ${max.porcAssist}%</td>
        <td><b>${min.eventos}:</b> ${min.porcAssist}%</td>
        <td><b>${largerCapacity.name}:</b> ${largerCapacity.capacity}</td>`
        document.getElementById("primerTabla").innerHTML = contenedor1
    }

    imprimirTablaUno();

    function imprimirTablaDos(){
        let contenedor2 = `<tr>
            <td scope="row" colspan="4"><b>Categories</b></td>
            <td colspan="4"><b>Estimated</b></td>
            <td colspan="4"><b>Percentage of estimated attendance</b></td>
        </tr>`
        estimateCapFuture.forEach(e => {
            e.estimateCapFuture
            contenedor2 += `<tr>
                <td colspan="4"> ${e.category}</td>
                <td colspan="4"> $${e.estimateRevenue}</td>
                <td colspan="4"> ${e.porcentajeAttendace}%</td>
            </tr>`
        })
        document.getElementById("tablaUp").innerHTML = contenedor2;
    }

    imprimirTablaDos()

    function imprimirTablaTres(){
        let contenedor3 = `<tr>
            <td scope="row" colspan="4"><b>Categories</b></td>
            <td colspan="4"><b>Revenue</b></td>
            <td colspan="4"><b>Percentage of attendance</b></td>
        </tr>`
        asistYCapPast.forEach(e => {
            e.asistYCapPast
            contenedor3 += `<tr>
                <td colspan="4">${e.category}</td>
                <td colspan="4">$${e.revenue}</td>
                <td colspan="4">${e.porcentaje}%</td>
            </tr>`
        })
        document.getElementById("tablaPast").innerHTML = contenedor3;
    }

    imprimirTablaTres();
}

obtenerDatos()