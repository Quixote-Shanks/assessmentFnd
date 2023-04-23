import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UrlResponse {
  resp: boolean;
  message: string;
  data: {
    original_url: string;
    short_url: string;
  }
}

@Component({
  selector: 'app-url-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrls: ['./url-shortener.component.css']
})
export class UrlShortenerComponent implements OnInit {
  //This is the url that used in making the post request
  originalUrl = '';
  //This is the url that is gotten from the backend
  originaLUrl = ''; 
  shortUrl = '';
  databaseData: any;
  isLoading = false;
  isSuccess = false;
  isError = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkDatabase();
  }

  onSubmit() {
    this.isLoading = true;
    this.isSuccess = false;
    this.isError = false;
    this.errorMessage = '';

    const apiUrl = 'http://localhost:7070/api/shorten';
    const body = { original_url: this.originalUrl };
    this.http.post<UrlResponse>(apiUrl, body).toPromise()
      .then(res => {
        this.isLoading = false;
        if (res && res.resp) {
          this.shortUrl = res.data.short_url;
          this.originaLUrl = res.data.original_url;
          this.isSuccess = true;
          this.resetForm();
        } else {
          this.isError = true;
          this.errorMessage = res!.message;
        }
      })
      .catch(error => {
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = error.message;
      });
  }

  checkDatabase() {
    const apiUrl = 'http://localhost:7070/api/check';
    this.http.get<UrlResponse>(apiUrl).toPromise()
      .then(res => {
        if (res!.resp) {
          this.databaseData = res!.data;
        } else {
          console.log(res!.message);
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  resetForm() {
    this.originalUrl = '';
  }
}
