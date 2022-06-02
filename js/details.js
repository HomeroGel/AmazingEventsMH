async function obtenerDatos(){
    await fetch("https://amazing-events.herokuapp.com/api/events")
    .then(res => res.json())
    .then(json => e = json)
    

    recoleccionDatos();
}

obtenerDatos();



function recoleccionDatos(){
    var id = location.search.split("?id=");
    var idSeleccionado = id[1];
    var event = e.events.find(evento => evento._id == idSeleccionado);
    console.log(e.events)
    

    var template = `<div class="cartas card hover-rotate" style="width: 25rem; height: 28rem;">
    <img src="${event.image}" class="card-img-top img" alt="cine">
    <div class="card-body">
        <h5 class="card-title titulo-card">${event.name}</h5>
        <p class="card-text fecha">${event.date}</p>
        <p class="card-text text-center">${event.description}</p>
        <div class="d-flex justify-content-around">
            <p class="card-text"><b>Category:</b> <em>${event.category}</em> </p>
            <p class="card-text"><b>Place:</b> <em>${event.place}</em> </p>
        </div>
        
        <p class="card-text text-center"> <b>Price:</b> $ ${event.price}</p>
        
    </div>
    </div>`

    document.querySelector("#contenedor-details").innerHTML = template;
}



