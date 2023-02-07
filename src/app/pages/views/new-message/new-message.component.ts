import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

const env = environment
import { IAdminReplay, IChatHistory, IChatRecent } from 'src/app/helpers/_interfaces/ChatMessage';
import { MessagesApiService } from '../messages/API/messages-api.service';
import { NewMessageService } from './new-message.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {

  listOfStudents: Array<IChatRecent> = [];

  chatHistory: Array<IChatHistory>;

  adminReplayData: IAdminReplay = {
    receiverIdentityId: "",
    message: ""
  }


  currentStudentChatingName: IChatRecent;



  @ViewChild('chatWindow') private myScrollContainer: ElementRef;
  chatHistorySortingByDate: any
  constructor(private HttpMethods: NewMessageService) { }



  ngOnInit(): void {
    document.title = `${env.webSiteName} | المراسلات`
    this.getAllStudents()
  }

  ngAfterViewChecked() {
    this.scrollToBottom()

  }

  getAllStudents() {
    this.HttpMethods.getAllStudents().subscribe(res => {

      let result: any = res;

      this.listOfStudents = result
    })
  }

  getChatHistoryId(chatRecent: any) {

    console.log("chatRecent", chatRecent)
    this.adminReplayData.receiverIdentityId = chatRecent.senderIdentityId
    this.currentStudentChatingName = chatRecent



    this.HttpMethods.getChatHistoryById(chatRecent.senderIdentityId).subscribe(res => {

      let result: any = res;

      this.chatHistory = result;

      this.scrollToBottom()

    })
  }


  adminReplayToStudent() {
    this.HttpMethods.adminReplayToDtudent(this.adminReplayData).subscribe(res => {
      this.getChatHistoryId(this.currentStudentChatingName)
      this.adminReplayData.message = ""

      console.log("currentStudentChatingName", this.currentStudentChatingName)
      console.log("adminReplayData", this.adminReplayData)
    })
  }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
