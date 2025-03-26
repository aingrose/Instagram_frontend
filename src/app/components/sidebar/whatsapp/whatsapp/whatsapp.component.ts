import { Component } from '@angular/core';
import { WhatsappService } from '../../../../services/whatsapp.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-whatsapp',
  imports: [FormsModule,RouterModule],
  templateUrl: './whatsapp.component.html',
  styleUrl: './whatsapp.component.css'
})
export class WhatsappComponent {

  phone: string = '';
  message: string = '';
  status: string = ''; 
  

  constructor(private whatsappService: WhatsappService) {}

  sendMessage() {
    if (!this.phone || !this.message) {
      this.status = '⚠️ Please enter both phone number and message.';
      return;
    }

    this.whatsappService.sendTextMessage(this.phone, this.message)
      .then(response => {
        this.status = '✅ Message sent successfully!';
      })
      .catch(error => {
        this.status = `❌ Error: ${error}`;
      })
  }
   
}
