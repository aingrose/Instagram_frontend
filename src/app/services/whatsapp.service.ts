import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios'

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
 
  private API_URL = 'http://localhost:5000'
  
  constructor() {}
   
  async sendTextMessage(phone:string,message:string){
    
    try{
      const response = await axios.post(`${this.API_URL}/send-text`,{phone,message});
      return response.data 

    } catch (error :unknown){
      if (error instanceof AxiosError) {
        throw error.response?.data || error.message;
      }
      throw new Error('An unexpected error occurred');

    }
 
  }
  
}
