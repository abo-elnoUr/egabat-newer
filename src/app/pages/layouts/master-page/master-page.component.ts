import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterLayoutService } from './master-layout.service';




@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss']
})
export class MasterPageComponent implements OnInit, AfterViewInit {




  showSidebarInMobiles: Boolean = false;

  constructor() {

  }

  ngOnInit(): void {



  }

  ngAfterViewInit() {
    // let navbarHeight = document.getElementById("app-top-bar").offsetHeight ;
    // // alert(navbarHeight)
    // let contentContainer = document.getElementById("content-container");
    // let asdieBarContainer = document.getElementById("aside-bar-container")
    // // asdieBarContainer.style.top = `${navbarHeight}px`
    // asdieBarContainer.style.top = `${navbarHeight}px`
    // contentContainer.style.top = `${navbarHeight}px`

    // asdieBarContainer.style.height = `${window.innerHeight - navbarHeight}px` // - }px`

    // alert(window.innerHeight)
  }



  toggleAsidebarInMoblie() {
    this.showSidebarInMobiles = !this.showSidebarInMobiles
  }

}
