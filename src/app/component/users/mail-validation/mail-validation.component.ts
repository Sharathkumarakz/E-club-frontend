import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mail-validation',
  templateUrl: './mail-validation.component.html',
  styleUrls: ['./mail-validation.component.css']
})
export class MailValidationComponent implements OnInit{
constructor(private http: HttpClient,   private router: Router,private route:ActivatedRoute){}
public param:any=''
public id:any=''
ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.param = params['token'];
  });
  this.route.params.subscribe(params => {
    this.id = params['id'];
  });
console.log(this.param);

}
  submit(){
    this.http.get('http://localhost:5000/user/'+this.id+'/verify/'+this.param,{
  }).subscribe(() => this.router.navigate(['/login']), (err) => {
    Swal.fire('Error', err.error.message, "error")
  })
  }
}
