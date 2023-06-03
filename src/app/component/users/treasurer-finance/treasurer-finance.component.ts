import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-treasurer-finance',
  templateUrl: './treasurer-finance.component.html',
  styleUrls: ['./treasurer-finance.component.css']
})
export class TreasurerFinanceComponent {

    constructor(private datePipe: DatePipe,private route: ActivatedRoute,private formBuilder: FormBuilder,private sharedService: SharedService,private http: HttpClient,private router: Router,private toastr:ToastrService) { }
    public param:any
    public username:any=''
    public reason:any=''
    public amount:Number=0
    public date:any=''
    public about:any=''
    public data:any[]
    public cash:any=''
    form: FormGroup | any
    public id = this.sharedService.data$.subscribe(data => {
      this.param=data // Handle received data
    });
   
  public name:any=''
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
        }

        this.form = this.formBuilder.group({
          username:'',
          reason:'',
          date:'',
          amount:''      
           })
      }
    
      ngOnDestroy() {
        this.id.unsubscribe(); // Unsubscribe to avoid memory leaks
      }
    
      submitFinancialData(): void {
        let club = this.form.getRawValue();
        club.status=false;

        if(club.username===''||club.amount==="" || club.reason===''||club.date===''){
  
      this.toastr.warning('all fields are needed','warning')

        }    
          this.http.post('http://localhost:5000/update/finance/'+this.param, club, {
            withCredentials: true
          }).subscribe(
            (response:any) => {
              this.data=response
              this.form = this.formBuilder.group({
                username:'',
                reason:'',
                date:'',
                amount:''      
                 })
                 this.getAmount();
                 this.toastr.success('Successfully updated','Success')
  
            },
            (err) => {
              this.toastr.warning('all fields are needed','warning')
            }
          );
      }
      submitFinancialData1(): void {
        let club = this.form.getRawValue();
      club.status=true;
      if(club.username===''||club.amount==="" || club.reason===''||club.date===''){
        this.toastr.warning('all fields are needed','warning')
 
      }    
        this.http.post('http://localhost:5000/update/finance/'+this.param, club, {
          withCredentials: true
        }).subscribe(
          (response:any) => {
            this.data=response
            this.form = this.formBuilder.group({
              username:'',
              reason:'',
              date:'',
              amount:''      
               })
               this.getAmount();
               this.toastr.success('Successfully updated','Success')

          },
          (err) => {
            this.toastr.warning('all fields are needed','warning')
          }
        );
      }
    
    isAuthenticated() {
      this.http.get('http://localhost:5000/club/roleAuthentication/' + this.param, {
        withCredentials: true
      }).subscribe((response: any) => {
        if (response.president) {
        }else if (response.secretory) {
        }else if (response.treasurer) {
          this.router.navigate(['/club/treasurer'])
        }else if(response.member){
        }else{
          this.toastr.warning('You are not a part of this club','warning')
          setTimeout(() => {
            this.router.navigate(['/'])
          }, 2000);
        }
  
        Emitters.authEmiter.emit(true);
      }, (err) => { 
        this.router.navigate(['/']);
        Emitters.authEmiter.emit(false);
      });
    }
    processData() {
      if (this.param) {
        // Save the data in local storage
        localStorage.setItem('myData', JSON.stringify(this.param));
        this.isAuthenticated();
        this.getFinacialData();
        this.getAmount();
      }
    }

  getAmount(){
     this.http.get('http://localhost:5000/club/'+this.param, {
        withCredentials: true
      }).subscribe((response: any) => {
       this.cash=response.cash
      
        // this.router.navigate(['/profile']);
      }, (err) => {
        this.router.navigate(['/']);
      })
  }

    getFinacialData(){
      this.http.get('http://localhost:5000/club/finance/' + this.param, {
        withCredentials: true
      }).subscribe((response: any) => {
       this.data=response
       this.getAmount();
        Emitters.authEmiter.emit(true);
      }, (err) => { 
        this.router.navigate(['/']);
        Emitters.authEmiter.emit(false);
      });
    }
  
  }
  
  
  
  
  
  
  
  
  
  
  