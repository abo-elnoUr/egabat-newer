import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleErrorService } from './handle-error.service';
import { environment } from 'src/environments/environment';

const env = environment
import { catchError } from 'rxjs/operators';
import { CategoryPublicResponse, CategoryResponse, CreateCategoryDto, CreateMainCategoryDto, CreateSubCategoryDto, EditCategoryDto, EditSubCategoryDto, MainCategoryPublicResponse, MainCategoryResponse, Pagination, SubCategoryPublicResponse, SubCategoryResponse } from 'src/app/helpers/_interfaces/custom-library';

@Injectable({
  providedIn: 'root'
})
export class CustomLibraryService {

  constructor(
    private _HttpClient: HttpClient,
    private _HandleErrorService: HandleErrorService
  ) { }

  // *********************** librarys *************************

  // add custom library
  addLibrary(library: any) {
    return this._HttpClient.post<CreateMainCategoryDto>(`${env.API_ROOT}/api/MainCategory/AddMainCategory`, library).pipe(catchError(this._HandleErrorService.logError))
  }

  getLibrarys(filter: any) {
    return this._HttpClient.post<MainCategoryPublicResponse>(`${env.API_ROOT}/api/MainCategory/GetAllMainCategories`, filter).pipe(catchError(this._HandleErrorService.logError))
  }

  getLibraryById(id: string) {
    return this._HttpClient.get<MainCategoryResponse>(`${env.API_ROOT}/api/MainCategory/GetMainCategoryByMainCategoryId/${id}`).pipe(catchError(this._HandleErrorService.logError))
  }

  editLibrary(library: any) {
    return this._HttpClient.put<EditCategoryDto>(`${env.API_ROOT}/api/MainCategory/EditMainCategory`, library).pipe(catchError(this._HandleErrorService.logError))
  }

  deleteLibrary(libraryId: string) {
    return this._HttpClient.delete(`${env.API_ROOT}/api/MainCategory/DeleteMainCategoryByMainCategoryId/${libraryId}`).pipe(catchError(this._HandleErrorService.logError))
  }

  toggleLibraryActive(id: string) {
    return this._HttpClient.put(`${env.API_ROOT}/api/MainCategory/MainCategoryActivation/${id}`, id)
  }

  // *********************** librarys category *************************

  addLibraryCategory(libraryCategory: any) {
    return this._HttpClient.post<CreateCategoryDto>(`${env.API_ROOT}/api/Category/AddCategory`, libraryCategory).pipe(catchError(this._HandleErrorService.logError))
  }

  getLibraryCategorys(filter: any) {
    return this._HttpClient.post<CategoryPublicResponse>(`${env.API_ROOT}/api/Category/GetAllCategories`, filter).pipe(catchError(this._HandleErrorService.logError))
  }

  getLibraryCategorysByLibraryId(mainCategoryId: string) {
    return this._HttpClient.get<CategoryResponse[]>(`${env.API_ROOT}/api/Category/GetAllCategoriesByMainCategoryId/${mainCategoryId}`).pipe(catchError(this._HandleErrorService.logError))
  }

  getLibraryCategoryById(categoryId: string) {
    return this._HttpClient.get<CategoryResponse>(`${env.API_ROOT}/api/Category/GetCategoryByCategoryId/${categoryId}`).pipe(catchError(this._HandleErrorService.logError))
  }

  editLibraryCategory(library: any) {
    return this._HttpClient.put<EditCategoryDto>(`${env.API_ROOT}/api/Category/EditCategory`, library).pipe(catchError(this._HandleErrorService.logError))
  }

  deleteLibraryCategory(categoryId: string) {
    return this._HttpClient.delete(`${env.API_ROOT}/api/Category/DeleteCategoryByCategoryId/${categoryId}`).pipe(catchError(this._HandleErrorService.logError))
  }

  toggleLibraryCategoryActive(categoryId: string) {
    return this._HttpClient.put(`${env.API_ROOT}/api/Category/CategoryActivation/${categoryId}`, categoryId)
  }


  // *********************** librarys sub-category *************************

  addLibrarySubCategory(librarySubCategory: any) {
    return this._HttpClient.post<CreateSubCategoryDto>(`${env.API_ROOT}/api/SubCategory/AddSubCategory`, librarySubCategory).pipe(catchError(this._HandleErrorService.logError))
  }

  getLibrarySubCategorys(filter: any) {
    return this._HttpClient.post<SubCategoryPublicResponse>(`${env.API_ROOT}/api/SubCategory/GetAllSubCategories`, filter).pipe(catchError(this._HandleErrorService.logError))
  }

  GetSubCategoriesByCategoryId(categoryId: string) {
    return this._HttpClient.get<SubCategoryResponse[]>(`${env.API_ROOT}/api/SubCategory/GetSubCategoriesByCategoryId/${categoryId}`).pipe(catchError(this._HandleErrorService.logError))
  }

  GetSubCategoryBySubCategoryId(subCategoryId: string) {
    return this._HttpClient.get<SubCategoryResponse>(`${env.API_ROOT}/api/SubCategory/GetSubCategoryBySubCategoryId/${subCategoryId}`).pipe(catchError(this._HandleErrorService.logError))
  }

  editSubCategory(subcategory: any) {
    return this._HttpClient.put<EditSubCategoryDto>(`${env.API_ROOT}/api/SubCategory/EditSubCategory`, subcategory).pipe(catchError(this._HandleErrorService.logError))
  }

  deleteSubCategoryBySubCategoryId(subCategoryId: string) {
    return this._HttpClient.delete(`${env.API_ROOT}/api/SubCategory/DeleteSubCategoryBySubCategoryId/${subCategoryId}`).pipe(catchError(this._HandleErrorService.logError))
  }


}
