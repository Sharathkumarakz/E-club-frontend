import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { ActivatedRoute } from '@angular/router';
import { ClubServiveService } from 'src/app/service/club-servive.service';
@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent {
  constructor( private http: HttpClient,private clubService: ClubServiveService,
    private router: Router,private route: ActivatedRoute) { }
  public param:any
public clubName:string=''
public paymentId:string=''
public date:string=''
public amount:string=''
public paidBy:string=''
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.param = params['id'];
    });
  
this.clubService.paymentReceipt(this.param).subscribe((response: any) => {
    this.clubName=response.clubName.clubName
    this.paymentId=response._id,
    this.date=response.date
    this.amount=response.amount
    this.paidBy=response.name
    Emitters.authEmiter.emit(true);
  }, (err) => {
    this.router.navigate(['/']);
  });
}

goBack(){
  this.router.navigate(['/club'])
}
}
