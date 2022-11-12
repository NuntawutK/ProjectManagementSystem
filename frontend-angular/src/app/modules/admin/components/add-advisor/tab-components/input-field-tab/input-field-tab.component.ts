import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

// interfaces
import { AcademicNameTitle } from "src/app/interfaces/user/academic-name-title";
import { Advisor } from "src/app/interfaces/user/advisor";
import { NameTitle } from "src/app/interfaces/user/name-title";

// services
import { AdvisorService } from "src/app/modules/admin/services/advisor.service";

@Component({
  selector: 'input-field-tab',
  templateUrl: './input-field-tab.component.html'
})
export class InputFieldTabComponent implements OnInit {
  
  @Input() nameTitleList!: NameTitle[];
  @Input() acadNameTitleList!: AcademicNameTitle[];

  advisorForm = new FormGroup({
    acadNameTitleId: new FormControl(0, [Validators.required]),
    nameTitleId: new FormControl(0, [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    advisorPid: new FormControl('', [Validators.required]),
  });

  loading: boolean = false;

  constructor(private advisorService: AdvisorService) {  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.advisorForm.status === "INVALID") {
      alert("กรุณาตรวจสอบข้อมูลก่อนบันทึกอีกครั้ง");
      return;
    }

    this.loading = true;

    let payload: Partial<Advisor> = {
      firstName: this.advisorForm.value.firstName as string,
      lastName: this.advisorForm.value.lastName as string,
      advisorPid: this.advisorForm.value.advisorPid as string,
      email: this.advisorForm.value.email as string,
      academicNameTitleId: Number(this.advisorForm.value.acadNameTitleId),
      nameTitleId: Number(this.advisorForm.value.nameTitleId),
    }

    this.advisorService.createAdvisor(payload).subscribe({
      next: res => {
        if (res.id) {
          this.loading = false;
          alert('บันทึกข้อมูลอาจารย์ที่ปรึกษาสำเร็จ');
          this.onReset();
        } else {
          this.loading = false;
          alert('พบข้อผิดพลาด กรุณาลองภายหลัง');
        }
      },
      error: _ => {
        this.loading = false;
        alert('พบข้อผิดพลาด กรุณาลองภายหลัง');
      }
    })
  }

  onReset() {
    this.advisorForm = new FormGroup({
      acadNameTitleId: new FormControl(0),
      nameTitleId: new FormControl(0),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      advisorPid: new FormControl('')
    });
  }
}