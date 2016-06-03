import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";


import {punto} from "./punto";

@Injectable()
export class PuntoService {
	constructor(private http: Http) {}

	getLugares() {
		return this.http.get('./app/algoritmo/lugares.json')
			.map((res: Response) => res.json());
	}
}