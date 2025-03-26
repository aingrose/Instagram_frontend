import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PostSchedulingComponent } from './pages/post-scheduling/post-scheduling.component';
import { SettingsComponent } from './pages/Register/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { WhatsappComponent } from './components/sidebar/whatsapp/whatsapp/whatsapp.component';
import { InstaComponent } from './components/sidebar/Instagram/insta/insta.component';
import { AuthGuard } from './guards/auth.guards';
import { InstagramCallbackComponent } from './components/InstagramcallbackComponents';
export const routes: Routes = [
  { path: '', component: SettingsComponent },
  { path: 'auth/callback', component: InstagramCallbackComponent },
  { path: 'post-scheduling', component: PostSchedulingComponent },
  { path: 'Register', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
   {path:'whatsapp', component: WhatsappComponent} ,
   {path:'instagram', component:InstaComponent,canActivate: [AuthGuard] } ,
  { path: '**', redirectTo: '' }, 
  
];
  