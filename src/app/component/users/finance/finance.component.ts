import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {NgConfirmService} from 'ng-confirm-box'
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit, OnDestroy  {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private readonly url=environment.apiUrl 
  public viewLoss:boolean=false;
  displayedColumn: string[] = ['index', 'date', 'name','reason','paymentMethod','amount'];
  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    public toastr:ToastrService,
    public _clubService:ClubServiveService,
    public _authService:AuthService,
    private confirmSevice:NgConfirmService) {  }
  
  
  dataSource = new MatTableDataSource<{_id:any; name:string; reason:string; amount:string; date:any; paymentMethod:string }>([]);

 
  public param:any
    public data:any[]
    public name:string=''
    public clubdetails:any
    public treasurer:boolean=false
    public leader:boolean=false
    form: FormGroup | any
    public id = this.sharedService.data$.subscribe(data => {
      this.param=data // Handle received data
    });
   public image:string=''
  
    ngOnInit(){
        this.id = this.sharedService.data$.subscribe((data: any) => {
          this.param = data;
          this.processData();
        });
    
        // Retrieve saved data from local storage
        const storedData = localStorage.getItem('myData');
        if (storedData) {
          this.param = JSON.parse(storedData);
          this.processData();
          this.getFinacialDataIncome()
        }

        this.form = this.formBuilder.group({
          username:'',
          reason:'',
          date:'',
          amount:'',
          stripe:''     
           })
           this.getFinacialDataIncome();
         
      }
    
      ngOnDestroy() {
        this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
      }

      submitFinancialData(): void {
        let club = this.form.getRawValue();
        club.status=false;

        if(/^\s*$/.test(club.username)|| /^\s*$/.test(club.amount)||/^\s*$/.test(club.reason)||/^\s*$/.test(club.date)){
  
      this.toastr.warning('all fields are needed','warning')
    }else if(isNaN(club.amount)){
      this.toastr.warning('Enter a amount','warning')   
    }else{    
        this.confirmSevice.showConfirm("is it a Loss? You cant change after submission",()=>{
          this._clubService.addFinancialData(this.param,club)
          .subscribe(
              (response:any) => {
                  this.getFinacialDataIncome()
                this.form = this.formBuilder.group({
                  username:'',
                  reason:'',
                  date:'',
                  amount:'',
                  stripe:'', 
                   })
                   this.getDetails();
                   this.toastr.success('Successfully updated','Success')
    
              },
              (err) => {
                this.toastr.warning('all fields are needed','warning')
              }
            );
        
        },()=>{
          this.toastr.warning('Submition cancelled','Success')
        })
      }
      }
      submitFinancialData1(): void {
        let club = this.form.getRawValue();
        club.status=true;

        if(/^\s*$/.test(club.username)|| /^\s*$/.test(club.amount)||/^\s*$/.test(club.reason)||/^\s*$/.test(club.date)){
  
      this.toastr.warning('all fields are needed','warning')

        }else if(isNaN(club.amount)){
          this.toastr.warning('Enter a amount','warning')   
        }else{    
        this.confirmSevice.showConfirm("is it a Gain? You cant change after submission",()=>{
       
          this._clubService.addFinancialData(this.param,club)
          .subscribe(
              (response:any) => {
                this.getFinacialDataIncome()
                this.form = this.formBuilder.group({
                  username:'',
                  reason:'',
                  date:'',
                  amount:'',
                  stripe:''     
                   })
                   this.getDetails();
                   this.toastr.success('Successfully updated','Success')   
              },
              (err) => {
                this.toastr.warning('all fields are needed','warning')
              }
            );   
        },()=>{
          this.toastr.warning('Submition cancelled','Success')
        })
      }
      }
    
      // isAuthenticated() {
      //   this._authService.authentication(this.param)
      //     .subscribe((response: any) => {
      //       if (response.authenticated) {
      //       } else {
      //         this.toastr.warning('You are not a part of this Club', 'warning')
      //         setTimeout(() => {
      //           this.router.navigate(['/'])
      //         }, 2000);
      //       }
      //       Emitters.authEmiter.emit(true);
      //     }, (err) => {
      //       this.router.navigate(['/']);
      //       Emitters.authEmiter.emit(false);
      //     });
      // }

    processData() {
      if (this.param) {
        // Save the data in local storage
        localStorage.setItem('myData', JSON.stringify(this.param));
        // this.isAuthenticated();
        this.getFinacialDataIncome();
        this.getDetails();
      }
    }

  
  getDetails() {
    this._clubService.getClubData(this.param)
        .subscribe((response: any) => {
          this.clubdetails = response.data;
          this.image = `${this.url}/public/user_images/`+ this.clubdetails.image
                if(response.data.treasurer._id===response.user.id ){
        this.treasurer=true;
       }
       if(response.data.president._id===response.user.id ||response.data.president._id===response.user.id ){
        this.leader=true;
       }
          Emitters.authEmiter.emit(true);
        }, (err) => {
          this.router.navigate(['/']);
        })
    };

    getFinacialDataIncome(){
     this._clubService.getFinancialDataIncome(this.param).subscribe((response: any) => {
        this.dataSource.data = response;
        this.dataSource.paginator=this.paginator
        this.dataSource.sort=this.sort
       this.getDetails();
        Emitters.authEmiter.emit(true);
      }, (err) => { 
        this.router.navigate(['/']);
        Emitters.authEmiter.emit(false);
      });
    }

    getFinacialDataLoss(){
      this._clubService.getFinancialDataLoss(this.param).subscribe((response: any) => {
         this.dataSource.data = response;
         this.dataSource.paginator=this.paginator
         this.dataSource.sort=this.sort
        this.getDetails();
         Emitters.authEmiter.emit(true);
       }, (err) => { 
         this.router.navigate(['/']);
         Emitters.authEmiter.emit(false);
       });
     }
    applyFilter(event: Event){
      const filterValue = (event.target as HTMLInputElement).value
      this.dataSource.filter= filterValue.trim().toLowerCase()
      if(this.dataSource.paginator){
        this.dataSource.paginator.firstPage()
      }
    }


    viewData(data:string){
   if(data==='income'){
this.viewLoss=false;
this.getFinacialDataIncome()
   }else{
    this.viewLoss=true;
    this.getFinacialDataLoss()
   }
    }

    submit(){
      let stripe=this.form.getRawValue();
      if(/^\s*$/.test(stripe.stripe)){
        this.toastr.warning('all fields are needed','warning')
      }else{
      this._clubService.setStripeId(this.param,stripe).subscribe((response: any) => {
        this.toastr.success('Stripe key updated Successfully','Success')
        this.form = this.formBuilder.group({
          username:'',
          reason:'',
          date:'',
          amount:'',
          stripe:'', 
           })
      })
    }}
  }
  
  
  
  
  
  
  
  
  
  
  