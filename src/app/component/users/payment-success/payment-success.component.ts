
import { Component } from '@angular/core';
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

  constructor(
    private clubService: ClubServiveService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public param: string
  public clubName: string = ''
  public paymentId: string = ''
  public date: string = ''
  public amount: string = ''
  public paidBy: string = ''
  public id: string = ''

  ngOnInit() {

    //getting param from url
    this.route.params.subscribe(params => {
      this.param = params['id'];
    });

//getting payment details
    this.clubService.paymentReceipt(this.param).subscribe((response: any) => {
      this.clubName = response.clubName.clubName
      this.paymentId = response._id,
        this.date = response.date
      this.amount = response.amount
      this.paidBy = response.name
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this.router.navigate(['/']);
    });
  }

  //back to home page
  goBack() {
    this.router.navigate(['/club'])
  }
}
