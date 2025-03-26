import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Renderer2, ElementRef,ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import axios from 'axios';
import { Router, NavigationEnd } from '@angular/router';
import { InstagramService } from '../../../../services/instagram.service';
import { tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-insta',
  imports: [FormsModule,ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './insta.component.html',
  styleUrls: ['./insta.component.css']
})
export class InstaComponent {
   userProfile: any = {};
  posts: any[] = [] 
  replyMessages: { [key: string]: string } = {};  

  followersCount: number | null = null;
  followingCount: number | null = null;

  newPostImage: string = '';
  newPostCaption: string = '';
  scheduledTime: string = '';

  selectedPostId: string | null = null; 
  commentText: string = ''; 

  stories: any[] = [];
  showInputBox: boolean = false;
  newStoryUrl: string = '';
   
  showUploadForm: boolean = false;
  isScheduledPost: boolean = false;


  constructor(private instagramService: InstagramService,private cdr: ChangeDetectorRef,  private router: Router ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
    this.fetchPosts()
   this.fetchStories() 
   this.fetchFollowersFollowing();
  } 
  fetchUserProfile(): void {
    this.instagramService.getUserProfile().pipe(
      tap((data:any) => console.log('Fetched Profile Data:', data))
    ).subscribe({
      next: (data) => (this.userProfile = data),
      error: (error) => console.error('Error fetching profile:', error)
    })
  }  

  chunkedPosts: any[][] = [];


  fetchPosts(): void {
    this.instagramService.getPosts().subscribe({
      next: (data) => {
        console.log('Full API Response:', data);
        console.log('Fetched posts:', data); 
        
        this.posts = data.posts || []; // Store posts
        this.chunkedPosts = this.chunkArray(this.posts, 3); // Split into rows of 3
      },
      error: (error) => console.error(error)
    });
  }
  
  // Function to split array into chunks of 3
  chunkArray(arr: any[], chunkSize: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }
  

  likePost(postId: string): void {
    this.instagramService.likePost(postId).subscribe({
      next: (data) => console.log('Post Liked', data),
      error: (error) => console.error(error)
    });
  } 
  commentOnPost(postId: string, message: string): void {
    this.instagramService.commentOnPost(postId, message).subscribe({
      next: (data) => console.log('Comment Added', data),
      error: (error) => console.error(error)
    }) 
  }   
 
  fetchStories() {
    this.instagramService.getStories().subscribe({
      next: (data) => {
        console.log("Fetched stories raw data:", data);
        if (data?.success && data.stories?.length) {
          this.stories = data.stories; 
          this.cdr.detectChanges()
          console.log("Processed stories:", this.stories);
        }            
      else { 
        this.stories = [];
        console.warn("No stories available");
      }
      if (this.stories.length === 0) {
        console.log("Stories array is empty.");
      } else {
        console.log("Stories array has data:", this.stories);
      }
    },
    error: (error) => console.error("Error fetching stories:", error),
    }
  )}
  toggleUploadForm(isScheduled: boolean): void {
    this.showUploadForm = true;
    this.isScheduledPost = isScheduled;
  }
  isLoading = false;
  postOnInstagram(): void {
    if (!this.newPostImage || !this.newPostCaption) {
      alert('Please provide both an image URL and a caption.');
      return;
    } 
    this.isLoading = true; 

    this.instagramService.createMediaContainer(this.newPostCaption, this.newPostImage).subscribe({
      next: (response: any) => {
        console.log('Container Created:', response);
        if (this.scheduledTime) {
          this.scheduleMedia(response.containerId);
        }else {
          this.publishMedia(response.containerId);
        }
      },
      error: (error: any) => console.error('Error creating container:', error)
    })
  } 
  
  publishMedia(containerId: string): void {
    this.instagramService.publishMedia(containerId).subscribe({
      next: (publishResponse: any) => {
        console.log('Post Published:', publishResponse);
        alert("Post Published !")
        this.resetForm();
        this.isLoading = false; 
        window.location.reload
      },
      error: (error: any) => {
        console.error('Error publishing image:', error)
        this.isLoading = false 
      }
      
     
    });
  }
   

  scheduleMedia(containerId: string): void {
    const scheduledTimestamp = Math.floor(new Date(this.scheduledTime).getTime() / 1000);
  
    if (isNaN(scheduledTimestamp)) {
      alert('Please enter a valid date and time.');
      return;
    }
  
    this.instagramService.scheduleMedia(containerId, scheduledTimestamp).subscribe({
      next: (response: any) => {
        console.log('Post Scheduled Successfully:', response);
        alert('Post Scheduled Successfully');
        this.resetForm(); 
      },
      error: (error: any) => console.error('Error scheduling media:', error)
    })
  }
  

  resetForm(): void {

    this.newPostImage = '' ;
    this.newPostCaption = '' ;
    this.scheduledTime = "" ;

   } 

  
  fetchFollowersFollowing(): void {
    this.instagramService.getFollowersFollowing().subscribe({
      next: (data) => {
        console.log("folloing",data);
        
        this.followersCount = data.followers_count;
        this.followingCount = data.follows_count;
      },
      error: (error) => console.error('Error fetching followers/following:', error),
    });
  } 

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
  
    if (target) {
      console.error("Image failed to load:", target.src);
      target.src = "https://via.placeholder.com/200x300?text=Story+Not+Found"; // Fallback image
    } else {
      console.warn("Image element not found.");
    }
  }
   
  //comment
  

  toggleCommentBox(postId: string): void {
    this.selectedPostId = this.selectedPostId === postId ? null : postId;
    if (this.selectedPostId) this.fetchComments(postId);
  }

  
  fetchComments(postId: string): void {
    console.log("Fetching comments for postId:", postId);
    this.instagramService.getComments(postId).subscribe({
      next: (comments:any) => {
        console.log("Fetched comments:", comments);
        this.posts = this.posts.map(post =>
          post.id === postId ? { ...post, comments: comments.data }
        :post)
        console.log("Updated posts:", this.posts)
      },
      error: (error:any) => console.error('Error fetching comments:', error),
    });
  }
   
   isPosting = false;
  


  // replyToComment(commentId: string, message: string): void {
  //   if (!message.trim()) return; // Prevent empty messages
  
  //   console.log("Replying to comment:", commentId, message);
    
  //   this.instagramService.replyToComment(commentId, message).subscribe({
  //     next: (response) => {
  //       console.log("Reply posted successfully:", response);
  //       alert("Reply posted successfully!");
  //       if (!this.replyMessages) this.replyMessages = {}; 
  //       this.replyMessages[commentId] = ""; 
  //     },
  //     error: (error) => {
  //       console.error("Error posting reply:", error);
  //       alert("Failed to post reply.");
  //     },
  //   });
  // }
  

  postComment(): void {
    if (!this.selectedPostId || !this.commentText.trim()) return;
  
    this.isPosting = true; 
    this.isLoading =false
    this.instagramService.addComment(this.selectedPostId, this.commentText).subscribe({
      next: () => {
        alert('Comment added successfully!');
        this.isLoading = false
        this.commentText = '';
        if (this.selectedPostId) {  
          this.fetchComments(this.selectedPostId);
        }
      },
      error: (error) => {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again!');
      },
      complete: () => {
        this.isPosting = false; 
      }
    })
  }
      toggleStoryInput(): void {
        this.showInputBox = !this.showInputBox;
      }

      uploadStory(): void {
        if (!this.newStoryUrl.trim()) {
          alert("Please enter an image URL.");
          return;
        }
        this.isLoading =true
        
        this.instagramService.uploadStory(this.newStoryUrl).subscribe({
          next: (response) => {
            console.log('Story uploaded:', response);
      
            if (response && response.success && response.media_url) {
              alert('Story added successfully!');
            this.isLoading = false
              this.stories.unshift({ media_url: response.media_url });
    
              this.newStoryUrl = '';
              this.showInputBox = false;       
              this.cdr.detectChanges()
            } else {
              alert("Upload successful, but no media URL returned.");
            }
          },
          error: (error) => {
            console.error('Error uploading story:', error);
            alert('Failed to upload story.');
          },
        });
      } 
      
      viewStory(mediaUrl: string): void {
        if (mediaUrl) {
          window.open(mediaUrl, '_blank');
        } else {
          alert("Story URL not available.");
        } 
      }   

      logout() {
        localStorage.removeItem('accessToken');
        this.router.navigate(['/login']);
      }
      
    }  
     
   