import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-instagram-callback',
  template: `<p>Authenticating...</p>`,
})
export class InstagramCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code']; // Get the Authorization Code
      if (code) {
        this.exchangeCodeForToken(code);
      } else {
        console.error('No authorization code found');
      }
    })
  }  

  exchangeCodeForToken(code: string) {
    const clientId = '659227143450593';
    const clientSecret = '3ffa49fdd2287a8d194627bb5191878b';
    const redirectUri = 'http://localhost:4200/auth/callback';

    const requestBody = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
    };

    this.http.post('https://graph.facebook.com/v18.0/oauth/access_token', requestBody).subscribe(
      (response: any) => {
        console.log('Access Token Response:', response);
        const accessToken = response.access_token;
        this.getInstagramAccounts(accessToken);
      },
      (error) => {
        console.error('Error exchanging token:', error);
      }
    );
  }

  getInstagramAccounts(accessToken: string) {
    const url = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`;
    this.http.get(url).subscribe(
      (response: any) => {
        console.log('Connected Instagram Accounts:', response.data);
      },
      (error) => {
        console.error('Error fetching Instagram accounts:', error);
      }
    );
  }
}
