import { Component, Input, OnInit } from "@angular/core";

// import interfaces
import { NameTitle } from "src/app/interfaces/user/name-title";
import { Student } from "src/app/interfaces/user/student";
import { Advisor } from "src/app/interfaces/user/advisor";

// import services
import { CsvService } from "src/app/modules/admin/services/csv.service";
import { StudentService } from "src/app/modules/admin/services/student.service";

@Component({
  selector: 'upload-file-tab',
  templateUrl: './upload-file-tab.component.html'
})
export class UploadFileTabComponent implements OnInit {

  @Input() nameTitleList!: NameTitle[];
  @Input() advisorList!: Advisor[];
  
  importedStudentData: Array<any> = [];
  checkCsvPropertyNames = ['studentPid', 'nameTitle', 'firstName', 'lastName', 'advisorPid']
  loading: boolean = false;

  constructor(private csvService: CsvService, private studentService: StudentService) {  }

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
          this.importedStudentData = this.csvService.importDataFromCSV(reader.result as string, this.checkCsvPropertyNames);
        }
      }
    }
  }

  findAdvisor(advisorPid: string) {
    let advisorFound = this.advisorList.find(a => a.advisorPid === advisorPid);

    if (typeof advisorFound === 'undefined') return advisorPid;
    
    return `${advisorFound?.academicNameTitle.titleShort} ${advisorFound?.nameTitle.title}` +
      `${advisorFound?.firstName}  ${advisorFound?.lastName}`;
  }

  deleteRow(index: number) {
    this.importedStudentData.splice(index, 1);
    
  }

  onSubmit() {
    this.loading = true;

    let payload: Partial<Student>[] = [];
    this.importedStudentData.map((studentItem: any) => {
      let item: Partial<Student> = {
        firstName: studentItem.firstName,
        lastName: studentItem.lastName,
        studentPid: studentItem.studentPid,
        nameTitle: {
          id: this.nameTitleList.find(n => n.title === studentItem.nameTitle)?.id
        } as NameTitle,
        advisor: {
          advisorPid: studentItem.advisorPid
        } as Advisor
      };

      payload.push(item);
    });
    
    this.studentService.createStudentList(payload).subscribe({
      next: res => {
        this.loading = false;
        alert('บันทึกข้อมูลนักศึกษาสำเร็จ');
        this.importedStudentData = [];
      },
      error: err => {
        this.loading = false;
        alert('พบข้อผิดพลาด กรุณาลองภายหลัง');
        console.log(err);
      }
    });  
  }
}