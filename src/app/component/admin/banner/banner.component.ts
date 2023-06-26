import { Component,ViewChild} from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Emitters } from 'src/app/component/users/emitters/emitters';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  displayedColumn: string[] = ['index','image', 'text', 'action'];
  public id: any; // Subscription reference
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<{image:string; text: string;  imageId: string;}>([]);

  public bannerText: string;
  selectedFile: any | File = null;
  form: FormGroup;

  constructor(
    private _adminService: AdminServiceService,
    private _router: Router,
    private _toastr:ToastrService
  ) { }

  ngOnInit() {
    this._adminService.active().subscribe(
      (response: any) => {
        Emitters.authEmiter.emit(true);
      },
      (err) => {
        this._router.navigate(['/admin']);
        Emitters.authEmiter.emit(false);
      }
    );

 this.getBanners()

  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  onSubmit() {
    if(!this.selectedFile){
      this._toastr.warning('Select a image', 'Warning')
      return 
    }
    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    formData.append('bannerText', this.bannerText);
    console.log(formData);
    this._adminService.addBanner(formData).subscribe((response)=>{
      this._toastr.success('Banner added successfully', 'Success')
 this.getBanners()

    },(err)=>{
  console.log("error");
    })
  }

  getBanners() {
    this._adminService.getBanner().subscribe(
      (res: any) => {
        this.dataSource.data = res as { image: string; text: string; imageId: string; }[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        console.log("error");
      }
    );
  }

  
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter= filterValue.trim().toLowerCase()
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage()
    }
  }

  deleteBanner(id: string){
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
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._toastr.info('deleting')
        let data={
          id:id
        }
        this._adminService.deleteBanner(data).subscribe((res)=>{
        this.getBanners()  
        },(err)=>{
          console.log(err);
        })
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Success',
          'deletion cancelled sucessfully :)',
          'success'
        )
      }
    })
  }
  logout(): void {
    this._adminService.logout().subscribe(() => {
      this._router.navigate(['/admin']);
    });
  }

  
}
