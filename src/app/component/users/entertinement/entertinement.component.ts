import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entertinement',
  templateUrl: './entertinement.component.html',
  styleUrls: ['./entertinement.component.css']
})
export class EntertinementComponent implements OnInit {
  public noNews:boolean=false
  ngOnInit(): void {
    this.getNews();
  }

  async getNews(): Promise<void> {
    const response = await fetch(`${environment.news}`);
    const data = await response.json();
    const results = data.results;
    if(response){
      this.noNews=true
    }
    
    const output = document.getElementById('output');
    
    for (let i = 0; i < results.length; i++) {
      try {
        const caption = results[i].media[0]['media-metadata'][2].caption;
        output!.innerHTML += `
          <div class="container card col-sm-8">
            <div class="card-body ">
              <img src="${results[i].media[0]['media-metadata'][2].url}" class="card-img-top" alt="${caption}" title="${caption}"><br>
              <h5 class="card-title">${results[i].title}</h5>
              <div class="card-text">
                <p>${results[i].abstract}</p>
              </div>
            </div>
          </div>
          <br>
        `;
      } catch (err) {
        console.log(err);
      }
    }

    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
      copyrightElement.innerHTML =
        data?.copyright ?? '';
    }
  }
}
