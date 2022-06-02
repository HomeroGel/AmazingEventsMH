var cartasFuturas = document.getElementById("contenedor-cartas");
var elementCheckeado = [];
var buscador = "";

//Funcion asincronica donde con fetch busco a la api y trabajo con ella. Dentro de la funcion, llamo a mis demas funciones.

async function obtenerDatos(){
    await fetch("https://amazing-events.herokuapp.com/api/events")
    .then(res => res.json())
    .then(json => eventos = json) //Eventos seria mi data.js

    cargarCategorias();
    reconocerInput();
    reconocerBox();
    combinacionInputCheckbox()
}

obtenerDatos();

//Siguiente paso, darle funcionalidades a los checkbox
function cargarCategorias() {
    var checkbox = document.getElementById("contenedor-cat");
    var templateHTML = "";

    //Tengo que hacer que no se repitan las categorias

    var categorias = eventos.events.map(e => e.category)
    var setCat = new Set(categorias);
    var arrayCat = [...setCat];

    //Recorro el arrayCat y le imprimo en el html.  

    arrayCat.forEach((elemento) => {
        templateHTML += `<div class="form-check form-check-inline">
                        
                        <label class="form-check-label">${elemento}
                        <input class="form-check-input" type="checkbox" value="${elemento}"/>
                        </label>
                    </div>`    
    }); checkbox.innerHTML = templateHTML;
}


//Funcion que agrega funcion a los checkboxes

function reconocerBox() {
    //Primero, agarro todos los checkboxes
    let checkboxes = document.querySelectorAll('input[type=checkbox]')

    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("click", (box) => { //Le agrego un evento al click en la checkbox
            if (box.target.checked) { //Si la box esta checkeada, pusheo el elemento al nuevo array
                elementCheckeado.push(box.target.value)
                combinacionInputCheckbox()
            } else {
                elementCheckeado = elementCheckeado.filter(uncheck => uncheck !== box.target.value) //Me trae el elemento con valor diferente al que descheckeo. 
                                                                                    //Devuelve los elementos que sean diferentes al elemento que fue deschequeado.
                combinacionInputCheckbox()
            }
        })
    }
}

//Funcion que agrega funcion al buscador

function reconocerInput() {
    var inputSearch = document.getElementById("search"); //agarro el input del buscador
    inputSearch.addEventListener("keyup", evento => { //aplico el evento keyup, y le asigno el valor a la variable buscador
        buscador = evento.target.value;
        combinacionInputCheckbox()
    })
}

//Hago una funcion que combine los check con el buscador y vaya mostrando las cartas dinamicamente

function combinacionInputCheckbox() {
    let displayArray = [];

    if (elementCheckeado.length > 0 && buscador !== "") {
        elementCheckeado.map(cat => {
            displayArray.push(...eventos.events.filter(evento => evento.name.toLowerCase().includes(buscador.trim().toLowerCase()) &&
                evento.category == cat))
        })
    } else if (elementCheckeado.length > 0 && buscador === "") {
        elementCheckeado.map(cat => {
            displayArray.push(...eventos.events.filter(evento => evento.category == cat))
        })
    } else if (elementCheckeado.length == 0 && buscador !== "") { 
        displayArray.push(...eventos.events.filter(evento => evento.name.toLowerCase().includes(buscador.trim().toLowerCase())))
    } else {
        displayArray.push(...eventos.events); 
    }

    creacionCartasPasadas(displayArray);
}


//Funcion que me genera las cartas de Eventos Pasados
function creacionCartasPasadas(array){
    var template = ""
    var carta = document.getElementById("contenedor-cartas");
    var fecha = eventos.currentDate;
    
    if(array.length != 0){

        for (var i = 0; i < array.length; i++) {
            
            if(fecha > array[i].date){
                template += `<div class="cartas card hover-rotate" style="width: 20rem; height: 28rem;">
                                        <img src="${array[i].image}" class="card-img-top img" alt="cine">
                                        <div class="card-body">
                                            <h5 class="card-title titulo-card">${array[i].name}</h5>
                                            <p class="card-text fecha">${array[i].date}</p>
                                            <p class="card-text">${array[i].description}</p>
                                            <div class="d-flex justify-content-around align-items-center">
                                                <a href="details.html?id=${array[i]._id}" class="boton-cartas">See More</a>
                                                <p class="card-text">$ ${array[i].price}</p>
                                            </div>
                                    </div>
                                    </div>`
            }
            
        }carta.innerHTML = template;
    }else{
        carta.innerHTML = `<h2>Not Found! 😣</h2>`
    }
}