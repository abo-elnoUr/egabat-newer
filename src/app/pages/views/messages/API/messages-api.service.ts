import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessagesHandleErrorsService } from './messages-handle-errors.service';
import { catchError } from "rxjs/operators"
import { environment } from 'src/environments/environment';

const env = environment
import { IStudent, IStudentFilter, IStudentsObject } from "src/app/helpers/_interfaces/student"
import { IChatHistory, IChatRecent, IRecentChatFilter, IRecentChats } from 'src/app/helpers/_interfaces/ChatMessage';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService {

  API_HEADERS = {
    "Authorization": `bearer ${localStorage.getItem("AuthToken")}`
  }

  constructor(private http: HttpClient, private handleError: MessagesHandleErrorsService) { }

  // Get All Chat's

  getRecentChats(filter: IRecentChatFilter) {
    console.log("Filter Serivce", filter)
    return this.http.post<IRecentChats>(`${env.API_ROOT}/api/Message/GetRecentChats`, filter).pipe(catchError(this.handleError.logError))

  }

  getChatHistoryById(id: string) {
    return this.http.get<Array<IChatHistory>>(`${env.API_ROOT}/api/Message/GetStudentChatHistory/${id}`).pipe(catchError(this.handleError.logError))

  }

  adminReplayToDtudent(messageData: any) {
    return this.http.post(`${env.API_ROOT}/api/Message/AdminReplay`, messageData).pipe(catchError(this.handleError.logError))
  }

  sendGroupMessage(message: any) {
    return this.http.post(`${env.API_ROOT}/api/Message/SendGroupMessage`, message);
  }




  gitStudentList(studentFilter: IStudentFilter) {
    return this.http.post<IStudentsObject>(`${env.API_ROOT}/api/Student/GetStudents`, studentFilter).pipe(catchError(this.handleError.logError))
  }

  getstudentCount(filter: IStudentFilter) {
    return this.http.post(`${env.API_ROOT}/api/Student/GetStudentsCount`, filter);
  }





  // sendAttachment(data) {
  //   console.log("req")
  //   return this.http.post("http://192.168.1.29:5001/api/Message/Attachment", data).pipe(catchError(this.handleError.logError))
  // }

  // sendData(data) {
  //   /api/Message/AdminReplay
  // }

}
