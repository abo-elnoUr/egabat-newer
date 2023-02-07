import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  currentSubject$: BehaviorSubject<string>;
  currentSubject: Observable<string>;

  currentUnit$: BehaviorSubject<string>;

  currentUnit: Observable<string>;

  currentLesson$: BehaviorSubject<string>;
  currentLesson: Observable<string>;

  constructor() {
    this.currentSubject$ = new BehaviorSubject<string>(sessionStorage.getItem('currentSubject') ?? "");
    this.currentUnit$ = new BehaviorSubject<string>(sessionStorage.getItem('currentUnit') ?? "");
    this.currentLesson$ = new BehaviorSubject<string>(sessionStorage.getItem('currentLesson') ?? "");
    this.currentSubject = this.currentSubject$.asObservable();
    this.currentUnit = this.currentUnit$.asObservable();
    this.currentLesson = this.currentLesson$.asObservable();
  }
  setCurrentSubjectName(name: string) {
    this.currentSubject$.next(name);

    sessionStorage.setItem('currentSubject', name);

  }

  setCurrentUnitName(name: string) {
    this.currentUnit$.next(name);
    sessionStorage.setItem('currentUnit', name);

  }
  setCurrentLessonName(name: string) {
    this.currentLesson$.next(name);
    sessionStorage.setItem('currentLesson', name);
  }

}


