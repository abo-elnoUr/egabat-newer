import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Interface } from 'readline';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Message, NotificationsApiService } from './notificationsApi/notifications-api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private signalRSubscription: Subscription;


  public content: Message;
  @Output("ShowAsideBar") showAsidebar = new EventEmitter<boolean>();
  @Input("show") showAsidebarInMobiles: any;
  @ViewChild('notificationsBody') private myScrollContainer: ElementRef;

  openNotifications: Boolean = false;
  openMessages: Boolean = false;

  notificationsNotSeenCount: any = 0;

  notificsCount: any;

  notificationsList: Message[] = []

  requestStatus: Boolean = false;


  testSoundNotis: string[] = [
    "name",
    "ahmed"
  ]

  PageSize: Number = 10;
  PageNo: number = 1;

  constructor(private authService: AuthService, private signalrService: NotificationsApiService, private route: Router) {
    this.signalRSubscription = this.signalrService.getMessage().subscribe(
      (message) => {

        this.content = message;

        console.log(message)

        this.notificationsList.unshift(message)

        this.notificationsNotSeenCount++

        this.runBellNotification()
        this.notificationsSound()
      });

  }


  runBellNotification() {
    const bell = document.getElementById("bell-notification");
    bell?.classList.add("animation");
    setTimeout(() => {
      bell?.classList.remove("animation");
    }, 600);
  }


  notificationsSound() {
    var audio = new Audio('../../../../assets/sounds/Notification-v1.mp3');
    audio.play();
    setTimeout(() => {
      audio.pause();
    }, 4000)
  }

  // getLengthOfNotSeenNotfs() {
  //   this.notificationsNotSeenCount = 0
  //   this.notificationsList.filter(item => {
  //     if (item.seen === false) {
  //       this.notificationsNotSeenCount++
  //     }
  //   })
  // }

  setNotificationsSeen(index: number, studentId: string, id: string) {
    this.notificationsList[index].seen = true;
    this.signalrService.setNotifictionSeen(id).subscribe(res => {
      console.log("RES", res)
      this.notificationsNotSeenCount--
      this.route.navigate([`/Admin/dashboard/messages/${studentId}`])
    })

    //

    console.log(this.notificationsList)
    // this.getLengthOfNotSeenNotfs()
  }

  ngOnInit(): void {
    // console.log(this.content)
    // const produceMessage = this.signalrService.getMessage() as Subject<any>;
    // produceMessage.next({ val1: 'a' });
    // produceMessage.next("4")

    // this.getAllNotifications()

    // this.getLengthOfNotSeenNotfs()
  }



  toggleAsidebarInMoblie() {
    this.showAsidebar.emit(!this.showAsidebarInMobiles)
  }

  logout() {
    this.authService.logout()
  }


  // getAllNotifications() {
  //   this.signalrService.getAllNotifications(this.PageSize, this.PageNo).subscribe(res => {
  //     this.notificationsList = res.notificationDetails;
  //     this.notificationsNotSeenCount = res.notSeenCount;
  //     this.notificsCount = res.totalCount

  //     console.log("res", res)

  //   })
  // }


  // paginationNotis() {

  //   console.log(` All Notifications is ${this.notificsCount} || Current Nots is ${this.notificationsList.length} `)

  //   if (this.PageNo >= this.notificsCount) {
  //     alert("You Are Get All Notifications")
  //   } else {

  //     console.log({
  //       size: this.PageSize,
  //       num: this.PageNo++
  //     })
  //     this.requestStatus = true
  //     setTimeout(() => {
  //       try {
  //         this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;

  //       } catch (err) { }
  //     }, 0)



  //     this.signalrService.getAllNotifications(this.PageSize, this.PageNo + 1).subscribe(res => {

  //       for (let itemNot of res.notificationDetails) {
  //         this.notificationsList.push(itemNot)
  //       }

  //       this.notificationsNotSeenCount = res.notSeenCount;
  //       this.notificsCount = res.totalCount
  //       this.requestStatus = false
  //       console.log("res", res)

  //     })
  //   }


  // }


  ngOnDestroy(): void {
    this.signalrService.disconnect();
    this.signalRSubscription.unsubscribe();
  }

}
