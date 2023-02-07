import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterLayoutService {


  showSidebarInMobiles: Boolean = true;


  constructor() { }

  toggleAsidebarInMoblie() {
    
    this.showSidebarInMobiles = !this.showSidebarInMobiles

  }
}
