import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { mailgrabberService } from "./service/mailgrabber.service";
import { admimmodal } from "./shared/modal/admin/adminmodal.component";
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';
import { HttpClientModule } from "@angular/common/http";
import { PrivacyComponent } from "./privacy/privacy.component";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        TNSCheckBoxModule,
        HttpClientModule,
        
        
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        ItemDetailComponent,
        PrivacyComponent,
        admimmodal
    ],
    providers: [
        mailgrabberService
    ],
    entryComponents:[admimmodal],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
