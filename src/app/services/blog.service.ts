import { Injectable } from '@angular/core';
import { StitchDBService } from './stitch-db.service';

import { Subject }    from 'rxjs/Subject';

@Injectable()
export class BlogService {

  
  private state:string;
  private stateValue:string;
  private blogFilter:any;
  
  private blogAddedSource = new Subject<string>();
 
  // Observable string streams
  blogAdded$ = this.blogAddedSource.asObservable();

  constructor(private stitchDB:StitchDBService) { }
  
  setState(state, value){
      this.state = state;
     this.stateValue = value;
     
     if(this.state === "all"){
         this.blogFilter = {};
     }
     else if(this.state === "users"){
         this.blogFilter = {owner_id: this.stateValue};
     }
     else{
         this.blogFilter = {};
         this.blogFilter[this.state] = this.stateValue;// { $regex : new RegExp(this.stateValue, "i") };
     }
  }
  
  authUserId(){
      return this.stitchDB.authUserId();
  }
  
  loadUserProfile(userid){
   return this.stitchDB.loadUserProfile(userid);
  }
  
  saveBlog(blogtext){
      // need to detect the "streams" (start with @) and tags (starts with #)
      // before saving 
      
      const tags = blogtext.match(/[#]+[A-Za-z0-9-_]+/g);
      console.log("TAGS")
      console.log(tags);
      
      const streams = blogtext.match(/[~]+[A-Za-z0-9-_]+/g);
      console.log("STREAMS")
      console.log(streams);
      
      if(streams!= null && streams !== undefined && streams.length > 0){
          this.stitchDB.saveOrUpdateStreams(streams);
      }
      
       if(tags!= null && tags !== undefined && tags.length > 0){
          this.stitchDB.saveOrUpdateTags(tags);
      }
      
      let thisobj = this;
      return new Promise( function(resolve, reject) {
          thisobj.stitchDB.saveBlog(blogtext, streams, tags).then(()=> {
              
              thisobj.blogsStateUpdated();
              resolve();
              
          } );
      });
      
  }
  
  blogsStateUpdated(){
      this.blogAddedSource.next('event::blogupdated');
  }
  
  
  deleteAll(){
      this.stitchDB.deleteAll();
  }

 loadUserBlogs(){
     return this.stitchDB.loadUserBlogs(this.blogFilter);
 }
 
 getTags(){
     return this.stitchDB.getTags();
 }
 
  getStreams(){
     return this.stitchDB.getStreams();
 }
 
//  loadInitialData(){
//      return this.stitchDB.loadInitialData(this.blogFilter);
//  }

}
