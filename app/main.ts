import { bootstrap }    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http'

import { algoritmoComponent } from './algoritmo/algoritmo.component';


bootstrap(algoritmoComponent, [HTTP_PROVIDERS]);
