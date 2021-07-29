// pulsanti
const pulsNewTodo = document.getElementById("newTodo");
const pulsDel = document.querySelector("#modalDel button.primary");
const pulsOk = document.querySelector("#modalWelcome button.primary");

// elementi HTML
const listaToDo = document.getElementsByClassName("todo")[0];
const listaToDoDone = document.getElementsByClassName("svolti")[0];
// modals avvisi
const modalNoInput = document.getElementById("modalNoInput");
const modalDel = document.getElementById("modalDel");
const modalWelcome = document.getElementById("modalWelcome");
// tooltips
const tooltipPending = document.getElementById("tooltip1");
const tooltipDone = document.getElementById("tooltip2");
// <input>
const tagInput = document.getElementById("newInput");
// variabili
var inputTesto;

// verifica se esiste già il file savato in locale
storedTodos = localStorage.getItem("todos");

if (storedTodos) {
	//^ se ESISTE 
	console.log("Trovato un file locale contenente l'array");
	// convertilo in array e assegnalo ad una variabile globale
	storedTodos = JSON.parse(localStorage.getItem("todos"));
	//^ se è VUOTO 
	if (storedTodos.todos.length === 0) {
		console.log("L'array trovato è vuoto, visualizzazione dei tooltip");
		tooltipPending.style.display = "block";
		tooltipDone.style.display = "block";
	} else {
		//^ NON è VUOTO
		console.log("Compilazione dell'interfaccia");
	}
} else {
	// ^ NON ESISTE 
	// crea l'array, assegna i valori di default e salvalo in locale
	compilaTodosDefault();
	localStorage.setItem('todos',JSON.stringify(storedTodos));
	console.log("L'array è stato creato e salvato in locale");
	// mostra il modal di benvenuto
	setTimeout(function(){ mostraModal(modalWelcome); }, 2000);
	pulsOk.addEventListener("click", () => {
		modalWelcome.classList.remove("animaz");
		setTimeout(function(){ modalWelcome.classList.add("hide"); }, 1000);
	})	
}

//* Compila l'interfaccia in base all'array salvato in locale
storedTodos.todos.forEach(compilaIntefaccia);

//* mostra i tooltip se una delle due liste è vuota
tooltipsShowHide();


// ^ CALLBACK -------------------------------------------------
//* compila i valori di default
function compilaTodosDefault() {
	return storedTodos = {
		todos:[
			{
				contenuto: "Segnami come svolto",
				done: false
			},{
				contenuto: "Crea un nuovo todo",
				done: false
			},{
				contenuto: "Elimina un todo esistente",
				done: false
			}
		]
	}
}
// * COMPILA L'INTERFACCIA
function compilaIntefaccia(val) {
	// crea un nuovo li
	var li = document.createElement("li");
	// se done=true mettilo dentro ul.todo svolti
	if (val.done) {
		listaToDoDone.appendChild(li);
	} else {
		// metti il nuovo li dentro ul.todo
		listaToDo.appendChild(li);
	}
	// crea il bottone per completare il todo e mettilo dentro li
	var btnDone = document.createElement("button");
	btnDone.classList.add("fa", "fa-check");
	li.appendChild(btnDone);
	// crea il p, aggiungi la classe e il contenuto
	var par = document.createElement("p");
	par.innerText = val.contenuto;
	// inserisci il p dentro li
	li.appendChild(par);
	// crea il bottone per cancellare e mettilo dentro li
	var btnTrash = document.createElement("button");
	li.appendChild(btnTrash);
	btnTrash.classList.add("fa", "fa-trash-o");
	// se li è presente nel gruppo dei todo svolti, assegnalo a quelli non svolti e viceversa
	btnDone.addEventListener("click", () => {
		if (isDone(li)) {
			val.done = false;
			localStorage.setItem('todos',JSON.stringify(storedTodos));
			listaToDo.appendChild(li);
		} else {
			val.done = true;
			localStorage.setItem('todos',JSON.stringify(storedTodos));
			listaToDoDone.appendChild(li);
		}
		tooltipsShowHide();
	})
	// elimina il todo
	btnTrash.addEventListener("click", () => {
		// visualizza il modal che chiede conferma
		mostraModal(modalDel);
		// assegna la classe selected in modo da sapere quale eliminare
		li.classList.add("selected");
		// trova l'indice corrispondente
		getIndex();
	})
}
//* aggiungi nuovo ToDo
pulsNewTodo.addEventListener("click", (e) => {
	e.preventDefault();
	inputTesto = tagInput.value;
	// se l'imput è vuoto interrompi l'esecuzione
	// e visualizza il modal
	if (inputTesto.lenght === 0 || !inputTesto.trim()) {
		mostraModal(modalNoInput);
		document.querySelector("#modalNoInput button").addEventListener("click", () => {
			modalNoInput.classList.remove("animaz");
			setTimeout(function(){ modalNoInput.classList.add("hide"); }, 1000);
		});
	} else {
		// altrimenti aggiungi un nuovo elemento all'array
		x = {
			contenuto: inputTesto,
			done: false
		}
		storedTodos.todos.push(x);
		//compila l'interfaccia e salva
		compilaIntefaccia(storedTodos.todos[storedTodos.todos.length - 1]);
		localStorage.setItem('todos',JSON.stringify(storedTodos));
	}
	// Resetta l'input e verifica se è necessario mostrare i tooltip
	tagInput.value = "";
	tooltipsShowHide();
});
// * ELIMINA TODO
// il bottone secondario chiude il modal senza confermare l'eliminazione e leva la classe selected
document.querySelector("#modalDel button.secondary").addEventListener("click", () => {
	modalDel.classList.remove("animaz");
	setTimeout(function(){ modalDel.classList.add("hide"); }, 1000);
	document.querySelector(".selected").classList.remove("selected");
});
// quello primario chiude il modal ma dopo aver confermato l'eliminazione
pulsDel.addEventListener("click", () => {
	let selected = document.querySelector(".selected");
	// ottieni indice dell'elemento in modo da eliminarlo dall'array
	storedTodos.todos.splice(index, 1);
	// aggiorna il file salvato
	localStorage.setItem('todos',JSON.stringify(storedTodos));
	// rimuovi dall'interfaccia
	selected.remove();
	// chiama la funzione per i tooltip (li visualizza solo se necessario)
	tooltipsShowHide();
	// chiudi il modal
	modalDel.classList.remove("animaz");
	setTimeout(function(){ modalDel.classList.add("hide"); }, 1000);
});
//* visualizza il tooltip se la lista corrispondente è vuota e viceversa
function tooltipsShowHide() {
	let d = allDone();
	if (storedTodos.todos.length === 0) {
		// Array vuoto
		tooltipPending.style.display = "block";
		tooltipDone.style.display = "block";
	} else if (d) {
		// contiene SOLO done=true
		tooltipPending.style.display = "block";
		tooltipDone.style.display = "none";
	} else if (allPending()) {
		// contiene SOLO done=false
		tooltipPending.style.display = "none";
		tooltipDone.style.display = "block";
	} else {
		// contiene SIA done=true CHE done=false
		tooltipPending.style.display = "none";
		tooltipDone.style.display = "none";
	}
}
// * controlla se element è nella lista dei todo svolti e restituisce il booleano
function isDone(element) {
    return listaToDoDone.contains(element);
}
// * valuta se i todo sono tutti svolti e restituisce un booleano
function allDone() {
	return storedTodos.todos.every((v) => {
		return v.done === true;
	});
}
// * valuta se i todo sono tutti da svolgere e restituisce un booleano
function allPending() {
	return storedTodos.todos.every((v) => {
		return v.done === false;
	});
}
//* Trova l'indice del contenuto array corrispondente all'LI selezionato
function getIndex() {
	return storedTodos.todos.some((v, i) => {
		// memorizza l'indice dell'elemento che soddisfa la funzione
		//! in una variabile globale
		index = i;
		return v.contenuto === document.querySelector(".selected").innerText;
	});
}
//* mostra il modal
function mostraModal(element) {
	element.classList.remove("hide");
	setTimeout(function(){ element.classList.add("animaz") }, 100);
}

