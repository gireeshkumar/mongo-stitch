import {Injectable} from '@angular/core';
import { BlogService } from '../../../services/blog.service';

@Injectable()
export class BlogFeedService {

  
  constructor(private _blogService:BlogService) {
  }

  getData(init) {
    
    return new Promise((resolve, reject)=>{
      
      let promise =  this._blogService.loadUserBlogs();//(init ? this._blogService.loadInitialData() : this._blogService.loadUserBlogs());
       promise.then(
         rslt=>{ 
           resolve(this.toFeedData(rslt))
        },
         err=>{}
       );
      
    });
    
    //return this._data;
  }
  
  toFeedData(rslt){
    
    /* Sample
        {
      type: 'text-message',
      author: 'Kostya',
      surname: 'Danovsky',
      header: 'Posted new message',
      text: 'Why did the CoffeeScript developer keep getting lost? Because he couldn\'t find his source without a map',
      time: '18.11.2015',
      ago: '9 days ago',
      expanded: true,
    }
    */
    
    let arr = [];
    
    for(let i = 0; i < rslt.length; i++){
      let val = rslt[i];
      console.log(val);
      
      arr.push(
          {
          type: 'text-message',
          author: 'Kostya',
          surname: 'Danovsky',
          header: 'Posted new message',
          text: this.parseUsers( this.parseHashtag( this.parseStreams(val.content) ) ),
          time: '18.11.2015',
          ago: '9 days ago',
          expanded: true,
        }
      );
    }
    
    
    console.log(arr);
    
    return arr;
  }
  
  parseStreams(stringdata) {
    return stringdata.replace(/[~]+[A-Za-z0-9-_]+/g, function(u) {
        var stream = u.replace("~","")
        return u.link("#/pages/streams/"+stream);
    });
 }
 
   parseUsers(stringdata) {
    return stringdata.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
        var username = u.replace("@","")
        return u.link("#/pages/user/"+username);
    });
 }
 
 parseHashtag(stringdata) {
    return stringdata.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
        var tag = t.replace("#","")//%23
        return t.link("#/pages/tags/"+tag);
    });
}
 
 
}
