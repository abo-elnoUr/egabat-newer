import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IAdminReplay, IChatHistory, IChatRecent, IRecentChats } from 'src/app/helpers/_interfaces/ChatMessage';
import { MessagesApiService } from './API/messages-api.service';
import { environment as env, environment } from "../../../../environments/environment";
import { Router, ActivatedRoute } from '@angular/router';

import { IStudent, IStudentsObject } from "src/app/helpers/_interfaces/student"
import { SectionService } from '../sections/api/section.service';
import { StageHttpService } from '../stages/API/stages-http.service';
import { GradesService } from '../grades/API/grades.service';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RolesEnum } from 'src/app/helpers/enums/roles-enum';


enum ChatTabs {
  HISTORY = "HISTORY",
  NEWCHAT = "NEWCHAT",
  GROUPMESSAGE = "GROUPMESSAGE"
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewChecked {

  SITE_URL = `${environment.API_ROOT}/`;

  studentCounts = 0;

  get Roles(): typeof RolesEnum {
    return RolesEnum
  }

  @ViewChild('chatWindow') private myScrollContainer: ElementRef;

  chatType: string = ChatTabs.HISTORY;

  get ChatTabs(): typeof ChatTabs {
    return ChatTabs
  }

  activeTab(tabName: string) {
    if (tabName === this.chatType) return true;
    return false;
  }

  changeChatType(chatType: string) {
    this.chatType = chatType;
    this.switchMessageMode();
  }

  filterChatForm: FormGroup;
  studentFilter: FormGroup;
  studentGroupFilter: FormGroup;
  constructor(
    private HttpMethods: MessagesApiService,
    private route: Router,
    public router: ActivatedRoute,
    private _sectionService: SectionService,
    private _stageService: StageHttpService,
    private _gradeService: GradesService,
    private _formBuilde: FormBuilder

  ) {
    this.filterChatForm = this._formBuilde.group({
      "sectionId": [null],
      "stageId": [null],
      "gradeId": [null],
      "studentName": "",
      "studentNumber": "",
    })
    this.studentFilter = this._formBuilde.group({
      "name": [''],
      "mobile": [''],
    })

    this.studentGroupFilter = this._formBuilde.group(
      {
        sectionId: [],
        stageId: [],
        gradeId: [],
        isActive: []
      });
  }


  chatPageNumber: number = 1;
  studentpageNumber: number = 1;

  listOfSections: ISection[] = [];
  listOfStages: IStage[] = [];
  listOfGrades: IGrade[] = [];

  getStudentsCount() {
    this.HttpMethods.getstudentCount(this.studentGroupFilter?.value).subscribe(res => this.studentCounts = res as number);
  }
  getSections() {
    this._sectionService.getAllSections().subscribe(response => {
      this.listOfSections = response;
    })
  }
  getStages() {
    this._stageService.getAllStages().subscribe(response => {
      this.listOfStages = response;
    })
  };
  getGrades() {
    let stageId = this.filterChatForm.get('stageId')?.value;
    this.filterChatForm.get('gradeId')?.reset();
    this._gradeService.getGradesByStageId(stageId).subscribe(response => {
      this.listOfGrades = response;
    })

  }
  getGradesGroup() {
    let stageId = this.studentGroupFilter.get('stageId')?.value;
    this.studentGroupFilter.get('gradeId')?.reset();
    this._gradeService.getGradesByStageId(stageId).subscribe(response => {
      this.listOfGrades = response;
    })
  }


  ListOfCahtsRecent: IRecentChats = {
    rowCount: 0,
    chats: []
  };
  studentsList: IStudentsObject = {
    students: [],
    rowCount: 0
  };

  studentsListGroup: IStudentsObject = {
    students: [],
    rowCount: 0
  };


  chatRequestStatus: Boolean = false;
  chatHistory: Array<IChatHistory>;

  //#region Admin Replay Data
  ReceiverIdentityId = "";
  Message = "";
  Attachment: Array<File> = [];
  //#endregion
  currentPage = 1;
  // Get Students List
  getStudents() {
    this.HttpMethods.gitStudentList({ ...this.studentFilter.value, pageNo: 1, pageSize: 10 }).subscribe(res => {
      this.studentsList = res
    })
  }


  getStudentsForGroup() {
    this.HttpMethods.gitStudentList({ ...this.studentGroupFilter.value, pageNo: this.currentPage, pageSize: 10 })
      .subscribe(res => this.studentsListGroup = res);
  }
  paginteStudents() {
    this.currentPage += 1;
    this.HttpMethods.gitStudentList({ ...this.studentGroupFilter.value, pageNo: this.currentPage, pageSize: 10 })
      .subscribe(res => {
        this.studentsListGroup.students.push(...res.students)

      });
  }

  // Get List Of Chat Recent
  getRecentChats() {
    this.HttpMethods.getRecentChats({
      ...this.filterChatForm.value,
      pageNo: this.chatPageNumber,
      pageSize: 10
    }).subscribe(res => {
      this.ListOfCahtsRecent.rowCount = res.rowCount;
      this.ListOfCahtsRecent.chats = res.chats;
      console.log("Chat", res)
    })
  }

  paginateChat() {
    this.chatPageNumber = this.chatPageNumber + 1;
    this.HttpMethods.getRecentChats({
      ...this.filterChatForm.value,
      pageNo: this.chatPageNumber,
      pageSize: 10
    }).subscribe(res => {
      this.ListOfCahtsRecent.rowCount = res.rowCount;
      this.ListOfCahtsRecent.chats = [...this.ListOfCahtsRecent.chats, ...res.chats];
      console.log("Chat", res)
    })
  }

  paginateStudent() {
    this.studentpageNumber = this.studentpageNumber + 1;
    this.HttpMethods.gitStudentList({ ...this.studentFilter.value, pageNo: this.studentpageNumber, pageSize: 10 }).subscribe(response => {
      this.studentsList.rowCount = response.rowCount
      this.studentsList.students = [...this.studentsList.students, ...response.students]
    })
  }

  currentRecentChatHistory: IChatRecent;
  getStudentNameHistory(studenId: string) {
    this.currentRecentChatHistory = this.ListOfCahtsRecent.chats.filter(s => s.senderIdentityId === studenId)[0];
    this.studentSelectedToStartChat = {
      studentId: '',
      name: '',
      mobile: '',
      email: null,
      studentImage: '',
      identityId: '',
      isActive: false,
      stageId: '',
      gradeId: '',
      stageName: '',
      gradeName: '',
      sectionId: '',
      sectionName: '',
      premiumSubscription: false,
    }
  }
  studentSelectedToStartChat: IStudent;
  getStudentName(studentId: string) {
    this.currentRecentChatHistory = {
      senderIdentityId: "",
      senderName: "",
      date: ""
    }
    this.studentSelectedToStartChat = this.studentsList.students.filter(s => s.studentId === studentId)[0];
  }

  // Get Chat History
  getChatHistoryId(studentIdentityId: string) {

    this.ReceiverIdentityId = studentIdentityId

    this.HttpMethods.getChatHistoryById(studentIdentityId).subscribe(res => {

      console.log("Chat History", res)

      this.chatHistory = res;

      setTimeout(() => this.scrollToBottom(), 5)

    });
  };

  // Async Message
  asyncMessage() {
    this.getChatHistoryId(this.ReceiverIdentityId)
  }

  // Admin Replay To Student
  adminReplayToStudent() {
    const FD = new FormData();
    FD.append("ReceiverIdentityId", this.ReceiverIdentityId);
    FD.append("Message", this.Message);
    console.log({
      id: this.ReceiverIdentityId,
      message: this.Message,
      attach: this.Attachment.length ? this.Attachment[0] : null
    })
    if (this.Attachment.length > 0) {

      FD.append("Attachment", this.Attachment[0]);
    }


    this.HttpMethods.adminReplayToDtudent(FD).subscribe(res => {
      this.getChatHistoryId(this.ReceiverIdentityId)
      this.Message = "";
      this.Attachment = [];
      this.chatRequestStatus = false
    })

  };


  sendGroupMessage() {
    const formData = new FormData();

    let sectionId = this.studentGroupFilter.get('sectionId');
    formData.append("sectionId", sectionId?.value);
    formData.append("GradeId", this.studentGroupFilter.get('gradeId')?.value);
    formData.append("StageId", this.studentGroupFilter.get('stageId')?.value);
    formData.append("Message", this.Message);
    console.log(this.studentGroupFilter.value);

    console.log(formData);
    if (this.Attachment && this.Attachment.length && this.Attachment.length > 0)
      formData.append("Attachment", this.Attachment[0]);


    this.HttpMethods.sendGroupMessage(formData).subscribe(res => {
      // this.getChatHistoryId(this.ReceiverIdentityId)
      this.Message = "";
      this.Attachment = [];
      this.chatRequestStatus = false
    })
  }

  // Scroll To Bottom Chat
  scrollToBottom(): void {
    console.log("Scroll To Bottom");

    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  upLoadAttachmentFile(file: any) {
    console.log(file[0])
    this.Attachment[0] = file[0];

    if (!this.Attachment.length) return;


    const FD = new FormData();
    FD.append("ReceiverIdentityId", this.ReceiverIdentityId);
    FD.append("Message", "");
    if (this.Attachment.length > 0) {
      FD.append("Attachment", this.Attachment[0]);
    }
    this.HttpMethods.adminReplayToDtudent(FD).subscribe(res => {
      this.getChatHistoryId(this.ReceiverIdentityId)
      this.Attachment = [];
      this.chatRequestStatus = false
    })

  }

  // Swicth Messages Mode ,, Between Chats Recent & List Of Students
  switchMessageMode() {
    this.studentsList.students.length > 0 ? null : this.getStudents()
  }

  ngOnInit(): void {
    document.title = `${env.webSiteName} | المراسلات`;

    this.getSections();
    this.getStages();

    this.getRecentChats();
    this.getStudentsForGroup();
    this.router.params.subscribe(params => {
      if (params['studentId']) {
        this.ReceiverIdentityId = params['studentId'];
        this.getChatHistoryId(params['studentId'])
      }
    })
  }

  ngAfterViewChecked() {
    // this.scrollToBottom()
  }





}
