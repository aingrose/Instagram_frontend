import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstagramService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/profile`);
  } 
 
  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/post/posts`);
  }

  getPostInsights(postId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/insights/${postId}`);
  }

  commentOnPost(postId: string, message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comment-post`, { postId, message });
  }

  likePost(postId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/like-post`, { postId });
  } 

  createMediaContainer(caption: string, imageUrl: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/post/create-container`, { caption, imageUrl });
  }

  // Publish media to Instagram
  publishMedia(containerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/post/publish-media`, { containerId });
  }

  // Schedule a media post
  scheduleMedia(containerId: string, scheduledTime: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/post/schedule-media`, { containerId, scheduledTime });
  } 

  getStories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stories`);
  } 
  getFollowersFollowing(): Observable<{ followers_count: number; follows_count: number }> {
    return this.http.get<{ followers_count: number; follows_count: number }>(`${this.apiUrl}/user/followers-following'`);
  }

  addComment(postId: string, message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/post/comment-post`, { postId, message });
} 


addReply(commentId: string, text: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/replies`, { commentId, text });
}

uploadStory(imageUrl: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/uploadd-story`, { image_url: imageUrl });
}

getComments(postId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/post/get-comments/${postId}`);
}

getCommentAuthor(commentId: string): Observable<any> {
  const url = `http://localhost:3000/post/get-comment-author/${commentId}`; // Adjust backend URL as needed
  return this.http.get(url);
}

// replyToComment(commentId: string, message: string): Observable<any> {
//   return this.http.post(`${this.apiUrl}/post/reply-comment`, { commentId, message });
// } 

 
} 