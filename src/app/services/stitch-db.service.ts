import { Injectable } from '@angular/core';

declare var stitch;

@Injectable()
export class StitchDBService {

    private client:any;
    private db:any;
    
    private blogfilter:any;
    
    // private initialDataPromise:any;
    
  constructor() {
      const thisobj = this;
      
      this.client = new stitch.StitchClient('stitchblog-fbtji');
      this.db = this.client.service('mongodb', 'mongodb-atlas').db('microblog');
      
    //   this.client.login( function(){ thisobj.loadBlogs(); });
      console.log(this.db);
      
      
      this.client.login().then(() =>
      // identify the kind of blogs this user interested/subscribed/allocated
      // TODO filter
       //thisobj.loadInitialData({})
       console.log("Used logged in")
      );
  
  
    // alert(this.client.authedId());
    this.blogfilter = {};
    // this.blogfilter.owner_id = this.authUserId();
  }
  
  authUserId(){
      return this.client.authedId();
  }
  
  loadUserProfile(userid){
      return new Promise((resolve, reject)=>{
          
          this.db.collection("users").find({instance_id: userid}).then(docs => {
                 resolve(docs);
              });
          
      });
  }
  
  loadUserBlogs(filter){
      console.log("LoadUserBlogs - filter");
      console.log(filter);
      
      let newfilter:any = filter;
      
    //   if(Object.keys(filter).length === 0){
    //       newfilter.owner_id = this.authUserId(); 
    //   }else{
    //       newfilter = {$or:[{owner_id: this.authUserId()}, filter]};
    //   }
        
    console.log("Get blogs");
    console.log(newfilter);
      
      return new Promise((resolve, reject)=>{
              
            this.db.collection('blogs').find(newfilter).then(docs => {
                 resolve(docs);
              });
          });
  }
  
//   loadInitialData(filter){
      
//       console.log("LoadInitialData");
      
//       if(this.initialDataPromise === null || this.initialDataPromise === undefined){
//           this.initialDataPromise = this.loadUserBlogs(filter);
//       }
       
//       return this.initialDataPromise;
//  }
  
  loadBlogs(){ // TODO load latest blogs / or subscribed blogs
       this.db.collection('blogs').find({}).then(docs => {
                  docs.map(c => console.log(c));
              });
              
this.db.collection('tags').find({}).then(docs => {
                  docs.map(c => console.log(c));
              });  
              
              this.db.collection('streams').find({}).then(docs => {
                  docs.map(c => console.log(c));
              });  
              
  }
  
  
  
  saveBlog(blogtext, streams, tags){
    const thisobj = this;
    return new Promise((resolve, reject)=>{
         this.db.collection("blogs").insert(
                {
                    owner_id : this.client.authedId(), 
                    content: blogtext, type:'blogs',
                    created_at: new Date().getTime(),
                    streams: streams,
                    tags: tags
                    
                }
            ).then(()=> resolve() );
    });
     

  }  
  

  
    saveOrUpdateStreams(streamsArray){
           const thisobj = this;
           const owner_id = this.client.authedId();
           
        
    streamsArray.forEach(function(value) {
      
            value = value.split("~")[1];
             
             thisobj.db.collection('streams').updateOne(
               { name: value },
               {
                 $setOnInsert: {owner_id:owner_id, name:value, type:'streams', created_at: new Date().getTime()},
                 $inc: { score: 1 },
                  $set: {modified_at: new Date().getTime()}
               },
               { upsert: true }
            ).then(console.log("insert/update"));
        
    });
        
      

      
  }
  
    saveOrUpdateTags(tagsArray){
                 const thisobj = this;
           
           const owner_id = this.client.authedId();
        
    tagsArray.forEach(function(value) {
      
            value = value.split("#")[1];
             
             thisobj.db.collection('tags').updateOne(
               { name: value },
               {
                 $setOnInsert: {owner_id:owner_id, name:value, type:'tags', created_at: new Date().getTime()},
                 $inc: { score: 1 },
                 $set: {modified_at: new Date().getTime()}
               },
               { upsert: true }
            ).then(console.log("insert/update"));
        
    });
  }
  
  //{ item: 1, status: 1 }
  
   getTags(){
     return this.getCollection('tags');
         
 }
 
  getStreams(){
      return this.getCollection('streams');
 }
 
 getCollection(name){
       console.log("Load Collection:"+name);
      return new Promise((resolve, reject)=>{
          
        //   resolve(  this.db.collection(name).find({},{projection:{name:1,_id:0}}).map( function(u) {return u.name} )   );
          
          
            this.db.collection(name).find({},{projection:{name:1,_id:0}}).then(docs => {
                 resolve( docs.map( function(u) {return u.name} )   );
              });
          
          
              
            // this.db.collection(name).find({},{projection:{name:1,_id:0}}).then(docs => {
            //     console.log(name+" loaded");
            //     console.log(docs);
            //      resolve(docs);
            //   });
          });
 }
  
    deleteAll(){
         const thisobj = this;
        this.client.login( function(){
             thisobj.db.collection('tags').deleteMany({ checked: true }).then(console.log('delete tags'));
            thisobj.db.collection('streams').deleteMany({ checked: true }).then(console.log('delete streams'));
            thisobj.db.collection('blogs').deleteMany({ checked: true }).then(console.log('delete blogs'));
        } );
       
    }
    
    // stitchClient.register('<user-email>', '<user-password>');
    
    register(email, password){
        return this.client.register(email, password);
    }
    
    emailConfirm(provider, tokenid, token){
        // stitchClient.auth.provider('userpass').emailConfirm('<tokenid>', '<token>');
        this.client.auth.provider(provider).emailConfirm(tokenid, token).then(rslt=>{
            console.log("Email Confirm - Success");
            console.log(rslt);
        }, 
        err=>{
            console.log("Error in user confirm");
            console.log(err);
        });
    }
    
    login(email, password){
        return this.client.login(email, password);
    }

}
