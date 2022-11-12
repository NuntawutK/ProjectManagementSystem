import { Component, Input, OnInit } from "@angular/core";

// interfaces
import { AcademicNameTitle } from "src/app/interfaces/user/academic-name-title";
import { Advisor } from "src/app/interfaces/user/advisor";
import { NameTitle } from "src/app/interfaces/user/name-title";

// services
import { CsvService } from "src/app/modules/admin/services/csv.service";
import { AdvisorService } from "src/app/modules/admin/services/advisor.service";

@Component({
  selector: 'upload-file-tab',
  templateUrl: './upload-file-tab.component.html'
})
export class UploadFileTabComponent implements OnInit {

  @Input() nameTitleList!: NameTitle[];
  @Input() acadNameTitleList!: AcademicNameTitle[];
  
  importedAdvisorData: Array<any> = [];
  checkCsvPropertyNames = ['advisorPid', 'acadNameTitle', 'nameTitle', 'firstName', 'lastName', 'email']
  loading: boolean = false;

  constructor(private csvService: CsvService, private advisorService: AdvisorService) {  }

  ngOnInit(): void {
  }
  
  async onChangeCsv(e :any) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      var pattern = /csv/;
      const reader = new FileReader();
      if (!file.type.match(pattern)) {
        alert('เฉพาะไฟล์ .csv เท่านั้น!');
      } else {
        reader.readAsText(e.target.files[0]);
        reader.onload = () => {
          this.importedAdvisorData = this.csvService.importDataFromCSV(reader.result as string, this.checkCsvPropertyNames);
        }
      }
    }
  }

  deleteRow(index: number) {
    this.importedAdvisorData.splice(index, 1);
  }

  onSubmit() {
    this.loading = true;

    let payload: Partial<Advisor>[] = [];

    this.importedAdvisorData.map((advisorItem: any) => {
      let item: Partial<Advisor> = {
        firstName: advisorItem.firstName,
        lastName: advisorItem.lastName,
        advisorPid: advisorItem.advisorPid,
        email: advisorItem.email,
        academicNameTitle: {
          id: this.acadNameTitleList.find(a => a.title === advisorItem.acadNameTitle)?.id as number,
        } as AcademicNameTitle,
        nameTitle: {
          id: this.nameTitleList.find(n => n.title === advisorItem.nameTitle)?.id
        } as NameTitle
      };

      payload.push(item);
    });
    
    this.advisorService.createAdvisorList(payload).subscribe({
      next: _ => {
        this.loading = false;
        alert('บันทึกข้อมูลอาจารย์ที่ปรึกษาสำเร็จ');
        this.importedAdvisorData = [];
      },
      error: _ => {
        this.loading = false;
        alert('พบข้อผิดพลาด กรุณาลองภายหลัง');
      }
    });
  }
  
}