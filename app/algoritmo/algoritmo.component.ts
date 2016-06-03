import { Component } from '@angular/core';


import {punto} from "./punto";
import { lugares } from './mock-lugares';
import { almacen } from './almacen';

@Component({
	selector: 'algoritmo-ruteo',
	templateUrl: './app/algoritmo/algoritmo.html',
	styleUrls: ['./app/algoritmo/algoritmo.component.css']
})
export class algoritmoComponent {

	public carro = { capacidad: 500 };
	
	public solucionInicial: solucion = this.obtenerSolucion();


	public temperaturaInicial: number = 1000;
	public factorEnfriamiento: number = 0.85;
	public temperaturaFinal: number = 0;
	public solucionMejor: solucion = this.solucionInicial;

	public temperaturas: number[] = [this.temperaturaInicial];

	constructor() {

	}

	algoritmo(){
		while (this.temperaturaInicial > this.temperaturaFinal){

			let numeroCiclos = 100;

			while(numeroCiclos > 0){
				let solucionTmp = this.obtenerSolucion();
				if(solucionTmp.valor < this.solucionInicial.valor){

					this.solucionInicial = solucionTmp;

					if (this.solucionInicial.valor < this.solucionMejor.valor){
						this.solucionMejor.valor = this.solucionInicial.valor;
					}

				} else {
					let valor: number = (solucionTmp.valor - this.solucionInicial.valor) / this.temperaturaInicial;

					let p: number = Math.exp(- valor);

					if( p > Math.random() ){
						this.solucionInicial = solucionTmp;
					}
				}
				numeroCiclos--;
			}

			this.temperaturaInicial = Math.floor(this.temperaturaInicial * this.factorEnfriamiento);
			this.temperaturas.push(this.temperaturaInicial);


		}
	}

	obtenerSolucion() {
		let sol: solucion = { valor: 0, rutas: [] };
		let rec: recorrido = {valor: 0, lugares:[almacen]};

		//let lugaresTmp = lugares;
		let lugaresTmp = lugares.slice();

		let visitados = new Set();

		while (lugaresTmp.length > 0) {
			let indexAlAzar = Math.floor(Math.random() * lugaresTmp.length);

			let cargaDelRecorrido: number = 0;

			for (let i = rec.lugares.length - 1; i >= 0; i--) {
				cargaDelRecorrido += rec.lugares[i].request;
			}

			if ((lugaresTmp[indexAlAzar].request + cargaDelRecorrido) <= this.carro.capacidad) {
				rec.lugares.push(lugaresTmp[indexAlAzar]);
				lugaresTmp.splice(indexAlAzar, 1);
			}else{
				visitados.add(lugaresTmp[indexAlAzar]);
			}

			if (visitados.size >= lugaresTmp.length) {
				//Se agrega el almacen al final
				rec.lugares.push(almacen);

				//Se calcula el valor de cada recorrido
				for (let i = 0; i < rec.lugares.length ; i++) {
					if (i < rec.lugares.length - 1) {
						rec.valor += distancia(rec.lugares[i].gps, rec.lugares[i + 1].gps);
					}
				}

				sol.rutas.push(rec);

				//Se inicializa el recorrido de nuevo en el almacen
				rec = { valor: 0, lugares: [almacen] };

				visitados.clear();
			}

		}

		for (let i = 0; i < sol.rutas.length; i++) {
			sol.valor += sol.rutas[i].valor;
		}

		return sol;
	}

	reiniciar(){
		this.temperaturaInicial = 1000;
		this.solucionInicial = this.obtenerSolucion();
		this.temperaturas = [this.temperaturaInicial];
	}


}


//Fuente http://apuntesdeprogramacion.com/calcular-la-distancia-entre-dos-puntos-en-google-maps/
		function rad(x) {
			return x * Math.PI / 180;
		}

		function distancia(p1, p2) {
			var R = 6378137; // Radio de la tierra en metros
			var dLat = rad(p2.latitude - p1.latitude);
			var dLong = rad(p2.longitude - p1.longitude);
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
				Math.sin(dLong / 2) * Math.sin(dLong / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;
			return d; // devuelve la distancia en metros
		};
///////////////////////////////////////////////////////////////////////////////////////

interface recorrido {
	valor: number,
	lugares: punto[]
}

interface solucion {
	valor: number,
	rutas: recorrido[]
	// rutas: { []: recorrido }
}
