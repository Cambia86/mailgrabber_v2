import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";

@Component({
    moduleId: module.id,
    selector: "adminmodal",
    templateUrl: "./adminmodal.component.html"
})
export class admimmodal {
    public Password

    constructor(
        private params: ModalDialogParams
    ) {

    }

    onTap() {
        let p = this.Password
        // this.params.closeCallback(true);
        if (this.Password === "Boxeur123")
            this.params.closeCallback(true);
        else
            this.params.closeCallback(false);
    }


    onPasswordChange (args){
        let textField = args.object;
  
        this.Password = textField.text;
      }


    public close(res: string) {
        this.params.closeCallback(true);
    }
}