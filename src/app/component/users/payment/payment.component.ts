import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared-service.service';
import { HttpClient } from '@angular/common/http';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgConfirmService } from 'ng-confirm-box'
import { AuthService } from 'src/app/service/auth.service';
import { ClubServiveService } from 'src/app/service/club-servive.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent {

  constructor(
    private formBuilder: FormBuilder,
    private clubService: ClubServiveService,
    private router: Router,
    private sharedService: SharedService,
    public _toastr: ToastrService,
  ) {
    this.invokeStripe()
  }

  public param: any
  public leader: boolean = false
  public handler: any = null
  public cash: any = null
  public Submitted: boolean = false;
  form: FormGroup
  events: any
  public clubdetails: any
  public image = ''

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      reason: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    })

    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
    }
    this.invokeStripe()

  }

  processData() {
    if (this.param) {
      this.getDetails()
    }
  }

  getDetails() {
    this.clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails = response.data;
        this.image = this.clubdetails.image
        if (response.data.president._id === response.user.id || response.data.president._id === response.user.id) {
          this.leader = true;
        }
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this.router.navigate(['/']);
      })
  };

  makePayment(data: any) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: '' + this.clubdetails.stripe,
      locale: 'auto',
      token: (stripeToken: any) => {
        paymentStripe(stripeToken, data.amount);
      }
    });

    const paymentStripe = (stripeToken: any, amount: any) => {
      const payload = {
        stripeToken: stripeToken,
        amount: data.amount,
        reason: data.reason,
        name: data.name
      };

      this.clubService.makePayment(this.param, payload).subscribe(
        (response) => {
          this._toastr.success('Payment successfull', 'Success');
          this.router.navigate(['/club/paymentSuccess', response]);
        },
        (err) => {
          this._toastr.warning(err.error.message, 'Warning!')
        }
      );
    }

    paymentHandler.open({
      name: 'payment to ' + this.clubdetails.clubName,
      description: 'Donating to club',
      amount: data.amount * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      window.document.body.appendChild(script);
    }
  }

  withStripe() {
    this.Submitted = true;
    let user = this.form.getRawValue()
    if (!this.clubdetails.stripe) {
      this._toastr.warning('Your club not having account for accepting', 'Warning')
    }
    else if (/^\s*$/.test(user.name) || /^\s*$/.test(user.reason) || /^\s*$/.test(user.amount) || user.amount === null) {
      this._toastr.warning('All fields are needed', 'Warning')
    } else if (this.form.valid) {
      this.makePayment(user)
    }
  }

}

