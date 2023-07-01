import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mail-validation',
  templateUrl: './mail-validation.component.html',
  styleUrls: ['./mail-validation.component.css']
})

export class MailValidationComponent implements OnInit {
  private readonly url = environment.apiUrl

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public param: any = ''
  public id: any = ''
  ngOnInit(): void {
    //getting tokn from url
    this._route.params.subscribe(params => {
      this.param = params['token'];
    });
    //getting userId from url
    this._route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  //mail validating
  submit() {
    this._http.get(`${this.url}/user/${this.id}/verify/${this.param}`).subscribe(
      () => {
        this._router.navigate(['/login']);
      },
      (err) => {
        Swal.fire('Error', err.error.message, "error");
      }
    );
  }

}
