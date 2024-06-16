import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'مؤتمر الكورسات';
  reportsAuth:string = "Basic bWVuYS5zYW15QGdtYWlsLmNvbTptZW5hMDEwQGdpbmE=";
  systemAuth:string = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJqdGkiOiJmZDdjODEzYy1hMWFmLTRmNjQtYWZjNy0yZDIyNDU1OWJjOTEiLCJ0eXAiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiZXhwIjoxNjk0NjM2NjA1LCJpc3MiOiJhcGkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo0NDM4MS8ifQ._gU5Lr6eHoAg-5CybZYL9GfLsJ2b1jqLYjurLkO1qf8";
  learningPlans!: [LearningPlan];
  httpclient!: HttpClient;
  accountId: number = 0;
  corsatId: number = 0;
  learningPlan!: LearningPlan;
  accountInfo!: AccountInfo;
  accountConference!: any| null;
  showLoader: boolean= false;
  /**
   *
   */
  constructor(private http: HttpClient) {   
    this.getLearningPlans();
  }

  getLearningPlans (){
    this.showLoader = true;
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.systemAuth);
    this.http.get<[LearningPlan]>("https://api.corsat-youthbishopric.com/api/trainingplan?academiYearId=7&getAll=true", {'headers' : headers})
    .subscribe(data => {
      this.learningPlans = data;
      this.showLoader = false;
    });
  }


  searchAccounts (){
    this.showLoader = true;

    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.systemAuth);

    const params = new HttpParams()
    .set("learningPlanId", this.learningPlan.Id)
    .set("corsatId", this.corsatId);

    this.http.get<AccountInfo>("https://api.corsat-youthbishopric.com/api/account/AccountSubscriptionInfo", {'headers' : headers, 'params': params})
    .pipe(
      catchError(()=> {this.showLoader = false;
        this.accountInfo = null;
        return new Observable<AccountInfo>(); })
      )
    .subscribe(data => {
      this.accountInfo = data;
      this.showLoader = false;
      this.searchAccountConference();
    });
  }

  searchAccountConference (){
    this.showLoader = true;

    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.systemAuth);

    const params = new HttpParams()
    .set("learningPlanId", this.learningPlan.Id)
    .set("accountId", this.accountInfo.Id);

    this.http.get<AccountInfo>("https://api.corsat-youthbishopric.com/api/account/AccountConferenceInfo", {'headers' : headers, 'params': params})
    .pipe(
      catchError(()=> {this.showLoader = false; 
        this.accountConference = null;
        return new Observable<AccountInfo>(); })
      )
    .subscribe(data => {
      this.accountConference = data;
      this.showLoader = false;
    });
  }


  SetAccountConferenceInfo (){
    this.showLoader = true;

    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.systemAuth);

    const params = new HttpParams()
    .set("learningPlanId", this.learningPlan.Id)
    .set("accountId", this.accountInfo.Id);
    
    this.http.get("https://api.corsat-youthbishopric.com/api/account/AccountConference", {'headers' : headers, 'params': params})
    .pipe(
      catchError(()=> {this.showLoader = false; return new Observable<AccountInfo>(); })
      )
    .subscribe(data => {
      this.showLoader = false;
      this.searchAccountConference();
    });
  }


  DeleteAccountConferenceInfo (){

    if(confirm("هل تريد إلغاء الحجز ؟")){

      this.showLoader = true;

      const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.systemAuth);

      const params = new HttpParams()
      .set("learningPlanId", this.learningPlan.Id)
      .set("accountId", this.accountInfo.Id);
      
      this.http.get("https://api.corsat-youthbishopric.com/api/account/DeleteAccountConference", {'headers' : headers, 'params': params})
      .pipe(
        catchError(()=> {this.showLoader = false; return new Observable<AccountInfo>(); })
        )
      .subscribe(data => {
        this.showLoader = false;
        this.searchAccountConference();
      });

    }
  }

  print (){
    this.showLoader = true;

    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.reportsAuth);

    const params:any =  { 
      data : this.accountInfo, 
      options : { reports: { save: true }},
      template : { shortid:"B-5bf3FduJ" , recipe: "chrome-pdf" }
    }
    
    
    this.http.post("https://mreports.jsreportonline.net/api/report",params, {'headers' : headers, responseType: 'blob' as 'json' })
    .pipe(
      catchError(()=> {this.showLoader = false; return new Observable<AccountInfo>(); })
      )
    .subscribe((data:any) => {
      this.showLoader = false;
      let dataType = data.type;
      let binaryData = [];
      binaryData.push(data);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
      downloadLink.target = "_blank";
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
}
}

interface LearningPlan {
  Id: number;
  Name: string;
}

interface AccountInfo {
  Id: number;
  ArabicName: string;
  SSN: string;
  CorsatId: number;
  AccountCourses: [AccountCourse]
}

interface AccountCourse {
  Serial: number;
  CourseName: string;
  Grade: number;
  Result: number;
  
}

interface AccountConference {
  AccountId: number;
  RegistrationDate: Date;
  CompeletionDate: Date;
  LearningPlanId: number;
  
}
