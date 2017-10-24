import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { StitchDBService } from '../../services/stitch-db.service';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.html',
  styleUrls: ['./confirm.scss']
})
export class Confirm implements OnInit {

  constructor(private route: ActivatedRoute, private stitchDB:StitchDBService) {


  }
  
     ngOnInit() {
       
           this.route.params.subscribe(
      (params: Params) => {
        
                console.log('route.params.subscribe');
        console.log(params);
        
        
        let Qparams = (new URL(document.location+'')).searchParams;
let tokenId = Qparams.get("tokenId");
let token = Qparams.get("token");
        
        console.log("token:::"+token);
        console.log("tokenId:::"+tokenId);
        
        // stitchClient.auth.provider('userpass').emailConfirm('<tokenid>', '<token>');
        
        this.stitchDB.emailConfirm('userpass', tokenId, token);
        
      });
     }

}
