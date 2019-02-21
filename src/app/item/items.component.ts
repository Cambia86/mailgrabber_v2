import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";

import * as permissions from "nativescript-permissions";
var Sqlite = require("nativescript-sqlite");
import * as imagepicker from "nativescript-imagepicker"
import { knownFolders, Folder, File } from "tns-core-modules/file-system";

import { GestureTypes, GestureEventData, SwipeGestureEventData } from "tns-core-modules/ui/gestures";
import { Page, EventData, Color } from "tns-core-modules/ui/page/page";
import { Router } from "@angular/router";
// import { android } from "tns-core-modules/application/application";
import { mailgrabberService } from "../service/mailgrabber.service";

// const app = require("application")
import * as applicationModule from "tns-core-modules/application";
import { admimmodal } from "../shared/modal/admin/adminmodal.component";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { TextField } from "tns-core-modules/ui/text-field";

declare var android: any;
export class userRegistration {
  Mail: string;
  FirstName: string
  LastName: string
  Country: string
  Sex: string
  BirthDate: string
  FlagPrivacy: number

  constructor(mail: string, flagPrivacy: number) {
    this.Mail = mail
    this.FlagPrivacy = flagPrivacy
  }
}


@Component({
  selector: "ns-items",
  moduleId: module.id,
  templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
  // items: Array<Item>;
  // constructor(private itemService: ItemService) { }


  @ViewChild("CBmale") checkmale: ElementRef;
  @ViewChild("CBfemale") checkfemale: ElementRef;
  @ViewChild("CB1") FirstCheckBox: ElementRef;
  @ViewChild("nomeTx") txtfirstname: ElementRef;
  @ViewChild("lastnomeTx") txtlastname: ElementRef;
  @ViewChild("mailTx") txtmail: ElementRef;
  @ViewChild("sexTx") txtgender: ElementRef;

  private database: any;
  public pictureArr
  public showSlide = false
  public picSlideTimer

  public myImageSource = "~/app/images/logomalloy.jpg"
  public generalTimer
  public showactionbar: boolean = false
  public userMail: string
  public people: Array<any>;
  public validMail: boolean = true
  // @ViewChild("CB1") FirstCheckBox: ElementRef;
  public showPrivacyPol: boolean = false
  public tvtext: string = ''

  currentuser: userRegistration
  countryList

  txtfieldfirstname
  Gender

  constructor(
    private page: Page,
    private vcRef: ViewContainerRef,
    private modal: ModalDialogService,
    private router: Router,

    private mailGrabberService: mailgrabberService
  ) {
    page.actionBarHidden = true;



    //   if (app.android) {
    //     const activity = app.android.startActivity;
    //     const win = activity.getWindow();
    //     win.addFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
    //   }

    this.people = [];
    (new Sqlite("my.maildb")).then(db => {
      db.execSQL("CREATE TABLE IF NOT EXISTS people2 (id INTEGER PRIMARY KEY AUTOINCREMENT, mail TEXT, firstname TEXT, lastname TEXT, country TEXT,birtdate TEXT,gender TEXT, flagPrivacy INTEGER)").then(id => {
        this.database = db;
      }, error => {
        console.log("CREATE TABLE ERROR", error);
      });
    }, error => {
      console.log("OPEN DB ERROR", error);
    });

  }




  initializePicture() {
    // this.pictureArr = {
    //   current: 2,
    //   lst: [
    //     { url: "~/images/IMG_1_MALLOY_1200x600px.jpg" },
    //     { url: "~/images/IMG_2_MALLOY_1200x600px.jpg" },
    //     { url: "~/images/IMG_3_MALLOY_1200x600px.jpg" }

    //   ]

    // }

    this.pictureArr = {
      current: 0,
      lst: [
        { url: "~/app/images/bdr1.jpg" },
        { url: "~/app/images/bdr2.jpg" },
        // { url: "~/images/whoweare.jpg" } 

      ]
    }

    //   let images = this.mailGrabberService.getcustomImages()
    //   if (images == null)
    //     this.importImages()
  }

  export() {
    let that = this
    permissions.requestPermission([
      "android.permission.INTERNET",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
    ], "I need these permissions")
      .then(function (res) {
        console.log("Permissions granted!");
        var file: File;
        var fileName = "robots.txt";
        var androidDownloadsPath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).toString();
        var customFolderPath = androidDownloadsPath + '/customFolder'// path.join(androidDownloadsPath, "customFolder");

        var folder = Folder.fromPath(customFolderPath);
        var path = customFolderPath + '/' + fileName// path.join(customFolderPath, fileName);
        var exists = File.exists(path);

        file = File.fromPath(path);

        let filestring = ''
        that.database.all("SELECT * FROM people2").then(rows => {
          that.people = [];
          for (var row in rows) {
            filestring = filestring + "" + rows[row][1] + ";" + rows[row][2]+ ";" + rows[row][3]+ ";" + rows[row][4]+ ";" + rows[row][5]+ ";" + rows[row][6]+ ";" + rows[row][7] + ';\n'

          }

          file.writeText(filestring)
            .then(result => {
              console.log(result);
              file.readText()
                .then(res => {
                  let successMessage = "Successfully saved in " + file.path;
                  let writtenContent = res;
                  let isItemVisible = true;
                  console.log(successMessage);
                });
            }).catch(err => {
              console.log(err);
            });
        }, error => {
          console.log("SELECT ERROR", error);
        });



      })
      .catch(function () {

        this.exportfile()
        console.log("No permissions - plan B time!");
      });
  }


  onDoubleTap(args: GestureEventData) {
    this.showModalGender()
  }

  public showModalGender() {
    let options = {
      context: {},
      fullscreen: false,
      viewContainerRef: this.vcRef
    };
    this.modal.showModal(admimmodal, options).then(res => {

      if (res == true) {
        this.export()
      }
    });
  }

  onSwipe(args: SwipeGestureEventData) {

    if (args.direction > 0) {
      this.page.actionBarHidden = false;
      this.showactionbar = true
    }
  }



  onChangeMail(event) {
    this.resetAllTimer()
    if (this.validateEmail(this.userMail))
      this.validMail = true
    else
      this.validMail = false
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  showconfirmmodal() {
    let options = {
      context: {},
      fullscreen: false,
      viewContainerRef: this.vcRef
    };
    //   this.modal.showModal(confirmmodal, options).then(res => {
    //     let resp = res;
    //     this.userMail = ''
    //   });
  }

  onTap(args: EventData) {
    let usr = this.currentuser
    this.currentuser.FlagPrivacy = this.FirstCheckBox.nativeElement.checked

    if (this.currentuser.FlagPrivacy && this.validMail && this.currentuser.FirstName!=''&& this.currentuser.LastName!=''&& this.currentuser.Country!='') {
      this.resetAllTimer()
      // if (this.validateEmail(this.userMail)) {
      if (true) {
        this.insert(this.currentuser)
        this.validMail = true
        this.export()
        this.showconfirmmodal()
        this.userMail = ''
        this.mailGrabberService.setMail('')
        this.clearfield()
      }
      else
        this.showrequiredfield()
    }else{
      this.showrequiredfield()
    }

  }

  

  public fetch() {
    this.database.all("SELECT * FROM people2").then(rows => {
      this.people = [];
      for (var row in rows) {
        this.people.push({
          "mail": rows[row][1],
          "flagPrivacy": rows[row][2]
        });
      }
    }, error => {
      console.log("SELECT ERROR", error);
    });
  }

  public insert(usr: userRegistration) {
    this.database.execSQL("INSERT INTO people2 (mail, firstname, lastname, country,birtdate,gender,flagPrivacy) VALUES (?, ?,?, ?,?,?, ?)", [usr.Mail,usr.FirstName,usr.LastName,usr.Country,usr.BirthDate,usr.Sex, usr.FlagPrivacy]).then(id => {
      console.log("INSERT RESULT", id);
      this.fetch();
    }, error => {
      console.log("INSERT ERROR", error);
    });
  }

  readPrivacy() {
    this.mailGrabberService.setMail(this.userMail)
    this.router.navigate(["/privacy"])
    // this.showPrivacyPol=true
  }

  onFocusMail() {
    clearTimeout(this.picSlideTimer);
    clearTimeout(this.generalTimer);
  }

  onBlurMail() {
    this.resetAllTimer()
  }

  hideSlider() {
    this.showSlide = false
    this.resetAllTimer()
  }

  nextPict() {
    this.pictureArr.current = this.pictureArr.current + 1
    if (this.pictureArr.current == this.pictureArr.lst.length) {
      this.pictureArr.current = 0
    }
    this.myImageSource = this.pictureArr.lst[this.pictureArr.current].url
    this.timeout();
  }

  resetAllTimer() {
    clearTimeout(this.picSlideTimer);
    clearTimeout(this.generalTimer);
    this.openSliderTimed(90000)
  }

  timeout() {
    this.picSlideTimer = setTimeout(() => {
      this.nextPict()
    }, 5000);
  }

  showSlider() {
    this.page.actionBarHidden = true;
    this.showactionbar = false
    if (!this.showSlide)
      this.timeout()
    this.showSlide = true

  }

  openSliderTimed(time) {
    if (this.showSlide === false)
      this.generalTimer = setTimeout(() => {
        this.showSlider()
      }, time);
  }

  importImages() {
    let that = this
    let list
    let context = imagepicker.create({
      mode: "multiple" // use "multiple" for multiple selection
    });

    context
      .authorize()
      .then(function () {
        return context.present();
      })
      .then(function (selection) {
        if (selection.length > 0) {
          that.pictureArr.current = 0
          that.pictureArr.lst = []
          that.mailGrabberService.setcustomImages(selection)
          selection.forEach(function (selected) {
            // process the selected image

            that.pictureArr.lst.push({ url: selected['_android'] })

          });
          that.myImageSource = selection[0]['selected']['_android']
        }
        // list.items = selection;
      }).catch(function (e) {
        console.log(e)
      });
  }

  onMailChange(args) {
    this.resetAllTimer()


    let textField = args.object;

    this.currentuser.Mail = textField.text;

    if (this.validateEmail(this.currentuser.Mail))
      this.validMail = true
    else {
      this.validMail = false
      setTimeout(() => {
        var v = this.page.getViewById<TextField>("mailTx");
        var drawable = v.android.getBackground();
        drawable.setColorFilter(new Color("#b21755").android, android.graphics.PorterDuff.Mode.SRC_ATOP);
      }, 1000);
    }
  }

  clearfield(){
    this.txtfirstname.nativeElement.text=''
    this.txtlastname.nativeElement.text=''
    this.txtgender.nativeElement.text=''
    this.txtmail.nativeElement.text=''
    this.loadCountry()
    this.FirstCheckBox.nativeElement.checked=false
    // Page.getViewById(“pseudo”).text
  }


  onNameChange(args) {
    this.resetAllTimer()
    let textField = args.object;
    this.currentuser.FirstName = textField.text;
  }

  onLastNameChange(args) {
    this.resetAllTimer()
    let textField = args.object;
    this.currentuser.LastName = textField.text;
  }

  onSexChange(args) {
    this.resetAllTimer()
    let textField = args.object;
    this.currentuser.Sex = textField.text;
  }

  onBirthDateChange(args) {
    this.resetAllTimer()
    let textField = args.object;
    this.currentuser.BirthDate = textField.text;
  }

  onCountryChange(args) {

    this.resetAllTimer()
    let picker = <ListPicker>args.object;
    this.currentuser.Country = this.countryList[picker.selectedIndex];
  }

  onPickerLoaded(args) {
    let datePicker = <DatePicker>args.object;

    datePicker.year = 1980;
    datePicker.month = 1;
    datePicker.day = 1;
    datePicker.minDate = new Date(1975, 0, 29);
    datePicker.maxDate = new Date(2045, 4, 12);
  }

  onDateChanged(args) {
    this.resetAllTimer()
    this.currentuser.BirthDate = args.value
    // console.log("Date New value: " + args.value);
    // console.log("Date value: " + args.oldValue);
  }

  onDayChanged(args) {
    // console.log("Day New value: " + args.value);
    // console.log("Day Old value: " + args.oldValue);
  }

  onMonthChanged(args) {
    // console.log("Month New value: " + args.value);
    // console.log("Month Old value: " + args.oldValue);
  }

  onYearChanged(args) {
    // console.log("Year New value: " + args.value);
    // console.log("Year Old value: " + args.oldValue);
  }

  loadCountry(){
    this.countryList = this.mailGrabberService.getcountry().map(data => {
      return data.name
    })


  }

  checksexchange(type){
    if(type=='male'){
      this.checkfemale.nativeElement.checked=false
      
    }else{
      this.checkmale.nativeElement.checked=false
    }
    this.currentuser.Sex =type
  }

  showrequiredfield(){
    setTimeout(() => {
      var v = this.page.getViewById<TextField>("mailTx");
      var drawable = v.android.getBackground();
      drawable.setColorFilter(new Color("#b21755").android, android.graphics.PorterDuff.Mode.SRC_ATOP);
    }, 1000);

    setTimeout(() => {
      var v = this.page.getViewById<TextField>("lastnomeTx");
      var drawable = v.android.getBackground();
      drawable.setColorFilter(new Color("#b21755").android, android.graphics.PorterDuff.Mode.SRC_ATOP);
    }, 1000);

    setTimeout(() => {
    var v = this.page.getViewById<TextField>("nomeTx");
    var drawable = v.android.getBackground();
    drawable.setColorFilter(new Color("#b21755").android, android.graphics.PorterDuff.Mode.SRC_ATOP);
  }, 1000);

  setTimeout(() => {
    var v = this.page.getViewById<ListPicker>("countrytxt");
    var drawable = v.android.getBackground();
    drawable.setColorFilter(new Color("#b21755").android, android.graphics.PorterDuff.Mode.SRC_ATOP);
  }, 1000);

  
  }

  ngOnInit() {
    this.currentuser = new userRegistration(null, null)
    this.userMail = this.mailGrabberService.getMail()
    this.loadCountry()
    this.initializePicture()
    this.openSliderTimed(50000)
  }
}
