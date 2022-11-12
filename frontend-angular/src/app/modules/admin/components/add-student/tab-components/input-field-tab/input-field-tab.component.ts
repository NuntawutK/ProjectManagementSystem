import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

// interfaces
import { Advisor } from "src/app/interfaces/user/advisor";
import { NameTitle } from "src/app/interfaces/user/name-title";
import { Student } from "src/app/interfaces/user/student";

// services
import { StudentService } from "src/app/modules/admin/services/student.service";

@Component({
  selector: 'input-field-tab',
  templateUrl: './input-field-tab.component.html'
})
export class InputFieldTabComponent implements OnInit {
  
  @Input() nameTitleList!: NameTitle[];
  @Input() advisorList!: Advisor[];

  studentForm = new FormGroup({
    nameTitleId: new FormControl(0, [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    studentPid: new FormControl('', [Validators.required]),
    advisorId: new FormControl(0, [Validators.required])
  });

  loading: boolean = false;

  constructor(private studentService: StudentService) {  }

  ngOnInit(): void {
  }

  getNameTitleList() {
    let customList: NameTitle[] = this.nameTitleList.filter(n => n.title !== '');
    return customList;
  }

  onSubmit() {
    if (this.studentForm.status === "INVALID") {
      alert("กรุณาตรวจสอบข้อมูลก่อนบันทึกอีกครั้ง");
      return;
    }

    this.loading = true;

    let payload: Partial<Student> = {
      firstName: this.studentForm.value.firstName as string,
      lastName: this.studentForm.value.lastName as string,
      studentPid: this.studentForm.value.studentPid as string,
      nameTitleId: Number(this.studentForm.value.nameTitleId),
      advisorId: Number(this.studentForm.value.advisorId),
    }

    this.studentService.createStudent(payload).subscribe({
      next: res => {
        if (res.id) {
          this.loading = false;
          alert('บันทึกข้อมูลนักศึกษาสำเร็จ');
          this.onReset();
        }
      },
      error: err => {
        console.log(err);
        this.loading = false;
        alert('พบข้อผิดพลาด กรุณาลองภายหลัง');
      }
    })
  }

  onReset() {
    this.studentForm = new FormGroup({
      nameTitleId: new FormControl(0, [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      studentPid: new FormControl('', [Validators.required]),
      advisorId: new FormControl(0, [Validators.required])
    });
  }
}