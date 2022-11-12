import { Component, OnInit } from '@angular/core';
import { ConfigInterface, ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  appConfig: ConfigInterface | undefined;

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }  
    
    this.configService.getConfig().subscribe({
      next: data => {
        if (data?.currentAcademicYearSemester && data.maxProjectMeetingItem) {
          this.appConfig = data;
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }

}
