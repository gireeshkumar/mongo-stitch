import {Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BlogService } from '../../services/blog.service';

declare var $;

@Component({
  selector: 'blogview',
  styleUrls: ['./blogview.scss'],
  templateUrl: './blogview.html'
})
export class BlogView implements OnInit, AfterViewInit {

  private bloginput:string;// = 'this is a stream @Tom  and I want to talk about #tag2   and another stream @Anne  and topic #tag3  are good';
  private blogs:any;
  
  constructor(private route: ActivatedRoute, private blogService:BlogService, private router: Router ) {
  }
  
    ngOnInit() {
      
    console.log('ngOnInit');
    let thisobj = this;


   if( this.blogService.authUserId() === undefined){
      this.router.navigate(['/login']);
   }else{
     this.blogService.setState('users', this.blogService.authUserId());
     this.blogService.loadUserProfile(this.blogService.authUserId()).then(rslt=>{
       console.log("User profile loaded");
       console.log(rslt);
     });
   }

    this.route.params.subscribe(
      (params: Params) => {
        
        console.log('route.params.subscribe');
        console.log(params);
        
        // tags
        if(params["tag"] !== undefined){
          console.log("Show feeds from 'TAG'=>"+params['tag']);
          this.blogService.setState('tags','#'+params['tag']); // should we keep the '#' with the value ?
        }
        else if(params['stream']){  // stream
          console.log("Show feeds from 'STREAM'=>"+params['stream']);
          this.blogService.setState('streams', '~'+params['stream']); // store '@' with value ?
        }
        else if(params['user']){  // stream
          console.log("Show feeds from 'USER'=>"+params['stream']);
          this.blogService.setState('users', '~'+params['user']); // store '@' with value ?
        }
        else{
          // show all blogs
          // this.blogService.setState('all', null);
          this.blogService.setState('users', this.blogService.authUserId());
        }
        
        this.blogService.blogsStateUpdated();
        
      });
      
    this.blogService.blogAdded$.subscribe(
        msg => {
          console.log("Feed<component> - "+msg);
          thisobj.loadMetadata();
        }
      );
    
    }
    
  ngAfterViewInit() {
    
    this.loadMetadata();
    
  }
  
  loadMetadata(){
     const thisobj = this;
    
    this.blogService.getTags().then(tags => {
       console.log(tags);
        $('#textarea01').atwho({
            at: "#",
            data:tags
        })
    });
    
    
  // this.blogService.getTags().then(tags => {
  //     console.log(tags);
  //       $('#textarea01').atwho({
  //           at: "#",
  //           data:tags
  //       })
  //   });
    
    
    this.blogService.getStreams().then(streams => {
      console.log(streams)
      
       $('#textarea01').atwho({
          at: "~",
          data: streams
      })
      
      });
  }
  
  onSubmitPost(){
    // blogService
    console.log(this.bloginput);
    this.blogService.saveBlog(this.bloginput).then( () => this.bloginput = '' );
  }
  
  deleteAll(){
    this.blogService.deleteAll();
  }

}
