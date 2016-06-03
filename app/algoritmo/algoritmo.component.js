"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var mock_lugares_1 = require('./mock-lugares');
var almacen_1 = require('./almacen');
var algoritmoComponent = (function () {
    function algoritmoComponent() {
        this.carro = { capacidad: 500 };
        this.solucionInicial = this.obtenerSolucion();
        this.temperaturaInicial = 1000;
        this.factorEnfriamiento = 0.85;
        this.temperaturaFinal = 0;
        this.solucionMejor = this.solucionInicial;
        this.temperaturas = [this.temperaturaInicial];
    }
    algoritmoComponent.prototype.algoritmo = function () {
        while (this.temperaturaInicial > this.temperaturaFinal) {
            var numeroCiclos = 100;
            while (numeroCiclos > 0) {
                var solucionTmp = this.obtenerSolucion();
                if (solucionTmp.valor < this.solucionInicial.valor) {
                    this.solucionInicial = solucionTmp;
                    if (this.solucionInicial.valor < this.solucionMejor.valor) {
                        this.solucionMejor.valor = this.solucionInicial.valor;
                    }
                }
                else {
                    var valor = (solucionTmp.valor - this.solucionInicial.valor) / this.temperaturaInicial;
                    var p = Math.exp(-valor);
                    if (p > Math.random()) {
                        this.solucionInicial = solucionTmp;
                    }
                }
                numeroCiclos--;
            }
            this.temperaturaInicial = Math.floor(this.temperaturaInicial * this.factorEnfriamiento);
            this.temperaturas.push(this.temperaturaInicial);
        }
    };
    algoritmoComponent.prototype.obtenerSolucion = function () {
        var sol = { valor: 0, rutas: [] };
        var rec = { valor: 0, lugares: [almacen_1.almacen] };
        //let lugaresTmp = lugares;
        var lugaresTmp = mock_lugares_1.lugares.slice();
        var visitados = new Set();
        while (lugaresTmp.length > 0) {
            var indexAlAzar = Math.floor(Math.random() * lugaresTmp.length);
            var cargaDelRecorrido = 0;
            for (var i = rec.lugares.length - 1; i >= 0; i--) {
                cargaDelRecorrido += rec.lugares[i].request;
            }
            if ((lugaresTmp[indexAlAzar].request + cargaDelRecorrido) <= this.carro.capacidad) {
                rec.lugares.push(lugaresTmp[indexAlAzar]);
                lugaresTmp.splice(indexAlAzar, 1);
            }
            else {
                visitados.add(lugaresTmp[indexAlAzar]);
            }
            if (visitados.size >= lugaresTmp.length) {
                //Se agrega el almacen al final
                rec.lugares.push(almacen_1.almacen);
                //Se calcula el valor de cada recorrido
                for (var i = 0; i < rec.lugares.length; i++) {
                    if (i < rec.lugares.length - 1) {
                        rec.valor += distancia(rec.lugares[i].gps, rec.lugares[i + 1].gps);
                    }
                }
                sol.rutas.push(rec);
                //Se inicializa el recorrido de nuevo en el almacen
                rec = { valor: 0, lugares: [almacen_1.almacen] };
                visitados.clear();
            }
        }
        for (var i = 0; i < sol.rutas.length; i++) {
            sol.valor += sol.rutas[i].valor;
        }
        return sol;
    };
    algoritmoComponent.prototype.reiniciar = function () {
        this.temperaturaInicial = 1000;
        this.solucionInicial = this.obtenerSolucion();
        this.temperaturas = [this.temperaturaInicial];
    };
    algoritmoComponent = __decorate([
        core_1.Component({
            selector: 'algoritmo-ruteo',
            templateUrl: './app/algoritmo/algoritmo.html',
            styleUrls: ['./app/algoritmo/algoritmo.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], algoritmoComponent);
    return algoritmoComponent;
}());
exports.algoritmoComponent = algoritmoComponent;
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
}
;
//# sourceMappingURL=algoritmo.component.js.map