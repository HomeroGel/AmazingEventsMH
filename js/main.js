var elementCheckeado = []; //declaro un array vacio donde voy a ir pusheando los elementos que se checkean
var buscador = ""; //declaro un string vacio donde se van a ir poniendo las cadenas que se ponen en el buscador


async function obtenerDatos(){
    await fetch("https://mindhub-xj03.onrender.com/api/amazing")
    .then(res => res.json())
    .then(json => eventos = json) //Eventos seria mi data.js

    cargarCategorias();
    reconocerBox();
    combinacionInputCheckbox()
    reconocerInput();
}


obtenerDatos();

//Asi muestro las categorias

function cargarCategorias() {
    var checkbox = document.getElementById("contenedor-cat");
    var templateHTML = "";

    //Tengo que hacer que no se repitan las categorias

    var categorias = eventos.events.map(e => e.category)
    var setCat = new Set(categorias);
    var arrayCat = [...setCat];

    //Recorro el arrayCat y le imprimo en el html.  

    arrayCat.forEach((elemento, indice) => {
        templateHTML += `<div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id=${indice} value="${elemento}">
                        <label class="form-check-label" for="${indice}" >${elemento}</label>
                    </div>`
        checkbox.innerHTML = templateHTML;
    })
}


//Funcion que le da funcionalidades a los checkboxes

function reconocerBox() {
    //Primero, agarro todos los checkboxes
    let checkboxes = document.querySelectorAll('input[type=checkbox]')
    console.log(checkboxes)

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

//Funcion que le da funcionalidad al buscador.

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

        console.log(displayArray)
    } else if (elementCheckeado.length > 0 && buscador === "") {
        elementCheckeado.map(cat => {
            displayArray.push(...eventos.events.filter(evento => evento.category == cat))
        })
    } else if (elementCheckeado.length == 0 && buscador !== "") { 
        displayArray.push(...eventos.events.filter(evento => evento.name.toLowerCase().includes(buscador.trim().toLowerCase())))
    } else {
        displayArray.push(...eventos.events); 
    }
    creacionCartas(displayArray);
}


//Asi muestro las cartas

function creacionCartas(arrayGen) {
    var template = ""
    var carta = document.getElementById("contenedor-cartas");
    if(arrayGen.length != 0){
        for (var i = 0; i < arrayGen.length; i++) {
            template += `<div class="cartas card hover-rotate" style="width: 20rem; height: 28rem;">
                                        <img src="${arrayGen[i].image}" class="card-img-top img" alt="cine">
                                        <div class="card-body">
                                            <h5 class="card-title titulo-card">${arrayGen[i].name}</h5>
                                            <p class="card-text fecha">${arrayGen[i].date}</p>
                                            <p class="card-text">${arrayGen[i].description}</p>
                                            <div class="d-flex justify-content-around align-items-center">
                                                <a href="details.html?id=${arrayGen[i]._id}" class="boton-cartas">See More</a>
                                                <p class="card-text">$ ${arrayGen[i].price}</p>
                                            </div>
                                    </div>
                                    </div>`
        }
        carta.innerHTML = template;
    }else{
        carta.innerHTML = `<h2>Not Found! 😣</h2>`
    }
    
}