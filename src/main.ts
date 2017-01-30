import 'core-js/client/shim';
import 'zone.js/dist/zone';

import './index.scss';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { GoogleAPI } from './app/gloader';

platformBrowserDynamic().bootstrapModule(AppModule, [GoogleAPI]);





