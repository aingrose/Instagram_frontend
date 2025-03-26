import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-scheduling',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './post-scheduling.component.html',
  styleUrls: ['./post-scheduling.component.css']
})




export class PostSchedulingComponent {
  selectedFile: File | null = null;

  postScheduling = new FormGroup({
    post :new FormControl('',Validators.required),
    time :new FormControl('',Validators.required),
    image: new FormControl(null, Validators.required)
  })

  constructor(private authService:AuthService){}
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Capture selected file
  } 
  // onSubmit() {
  //   if (this.postScheduling.valid && this.selectedFile) {
  //     const formData = new FormData();
  //     formData.append('message', this.postScheduling.value.post || '');
  //     formData.append('date', new Date(this.postScheduling.value.time!).getTime().toString());
  //     formData.append('image', this.selectedFile);

  //     this.authService.PostSchedule(formData).subscribe({
  //       next: (response) => {
  //         console.log("Post scheduled successfully", response);
  //         alert("Post scheduled successfully");
  //         this.postScheduling.reset();
  //         this.selectedFile = null;
  //       },
  //       error: (error) => {
  //         console.error("Post scheduling failed", error);
  //         alert("Post scheduling failed");
  //       }
  //     });
  //   } else {
  //     console.log("Form is not valid");
  //   }
  
 
  // this.postScheduling.reset();

  // } 
  
}
  
  //onSubmit() {
    //if (this.postScheduling.valid) {
//       const credentials = this.postScheduling.value as { post: string; time: string };

//       this.authService.PostSchedule(credentials).subscribe({
//         next: (response) => {
//           console.log("Post scheduled successfully", response);
//           alert("Post scheduled successfully");
//           this.postScheduling.reset();
//         },
//         error: (error) => {
//           console.error("Post scheduling failed", error);
//           alert("Post scheduling failed");
//         }
//       });
//     } else {
//       console.log("Form is not valid");
//     }
//   }
// }