import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClubServiveService } from 'src/app/service/club-servive.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})

export class FinanceComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private readonly url = environment.apiUrl
  public viewLoss: boolean = false;

  displayedColumn: string[] = ['index', 'date', 'name', 'reason', 'paymentMethod', 'amount'];
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    public _toastr: ToastrService,
    public _clubService: ClubServiveService,
    public _authService: AuthService,
   ) { }


  dataSource = new MatTableDataSource<{ _id: any; name: string; reason: string; amount: string; date: any; paymentMethod: string }>([]);


  public param: any
  public data: any[]
  public name: string = ''
  public clubdetails: any
  public treasurer: boolean = false
  public leader: boolean = false
  form: FormGroup | any
  public image: string = ''

  ngOnInit() {
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      this.param = JSON.parse(storedData);
      this.processData();
      this.getFinacialDataIncome()
    }

    this.form = this._formBuilder.group({
      username: '',
      reason: '',
      date: '',
      amount: '',
      stripe: ''
    })
    this.getFinacialDataIncome();
  }

  submitFinancialDataLoss(): void {
    let club = this.form.getRawValue();
    club.status = false;
    if (!/[a-zA-Z]/.test(club.username) || /^\s*$/.test(club.amount) || !/[a-zA-Z]/.test(club.reason) || /^\s*$/.test(club.date)) {
      this._toastr.warning('all fields are needed', 'warning')
    } else if (isNaN(club.amount)) {
      this._toastr.warning('Enter a amount', 'warning')
    }else if(club.amount<=0){
      this._toastr.warning('Minus amount  or Zero cannot be accepted', 'warning')
    } else {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
        swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, it is a loss!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this._clubService.addFinancialData(this.param, club)
          .subscribe(
            (response: any) => {
              this.getFinacialDataLoss()
              this.form = this._formBuilder.group({
                username: '',
                reason: '',
                date: '',
                amount: '',
                stripe: '',
              })
              this.getDetails();   
            },
            (err) => {
              this._toastr.warning(err.error.message, 'warning')
              this._router.navigate(['/'])
            }
          )
          swalWithBootstrapButtons.fire(
            'Success!',
            'Successfully updated',
            'success'
          )
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Process cancelled! :)',
            'error'
          )
        }
      })
    }
  }

  submitFinancialDataGain(): void {
    let club = this.form.getRawValue();
    club.status = true;
    if (!/[a-zA-Z]/.test(club.username) || /^\s*$/.test(club.amount) || !/[a-zA-Z]/.test(club.reason) || /^\s*$/.test(club.date)) {
      this._toastr.warning('all fields are needed', 'warning')
    } else if (isNaN(club.amount)) {
      this._toastr.warning('Enter a amount', 'warning')
    }else if(club.amount<=0){
      this._toastr.warning('Minus amount  or Zero cannot be accepted', 'warning')
    } else {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
        swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, it is a Gain!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this._clubService.addFinancialData(this.param, club)
          .subscribe(
            (response: any) => {
              this.getFinacialDataIncome()
              this.form = this._formBuilder.group({
                username: '',
                reason: '',
                date: '',
                amount: '',
                stripe: '',
              })
              this.getDetails();   
            },
            (err) => {
              this._toastr.warning(err.error.message, 'warning')
              this._router.navigate(['/'])
            }
          )
          swalWithBootstrapButtons.fire(
            'Success!',
            'Successfully updated',
            'success'
          )
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Process cancelled! :)',
            'error'
          )
        }
      })
    }
  }
  processData() {
    if (this.param) {
      this.getFinacialDataIncome();
      this.getDetails();
    }
  }

  getDetails() {
    this._clubService.getClubData(this.param)
      .subscribe((response: any) => {
        this.clubdetails = response.data;
        this.image = `${this.url}/public/user_images/` + this.clubdetails.image
        if (response.data.treasurer._id === response.user.id) {
          this.treasurer = true;
        }
        if (response.data.president._id === response.user.id || response.data.president._id === response.user.id) {
          this.leader = true;
        }
        Emitters.authEmiter.emit(true);
      }, (err) => {
        this._router.navigate(['/']);
      })
  };

  getFinacialDataIncome() {
    this._clubService.getFinancialDataIncome(this.param).subscribe((response: any) => {
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.getDetails();
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this._router.navigate(['/']);
      Emitters.authEmiter.emit(false);
    });
  }

  getFinacialDataLoss() {
    this._clubService.getFinancialDataLoss(this.param).subscribe((response: any) => {
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.getDetails();
      Emitters.authEmiter.emit(true);
    }, (err) => {
      this._router.navigate(['/']);
      Emitters.authEmiter.emit(false);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  viewData(data: string) {
    if (data === 'income') {
      this.viewLoss = false;
      this.getFinacialDataIncome()
    } else {
      this.viewLoss = true;
      this.getFinacialDataLoss()
    }
  }

  submit() {
    let stripe = this.form.getRawValue();
    if (/^\s*$/.test(stripe.stripe)) {
      this._toastr.warning('all fields are needed', 'warning')
    } else {
      this._clubService.setStripeId(this.param, stripe).subscribe((response: any) => {
        this._toastr.success('Stripe key updated Successfully', 'Success')
        this.form = this._formBuilder.group({
          username: '',
          reason: '',
          date: '',
          amount: '',
          stripe: '',
        })
      })
    }
  }
}










