export interface Pagination {
  pageSize: string,
  pageNumber: string
}

export interface CreateMainCategoryDto {
  name: string;
  image: FormFile;
  stageId: string | null;
  gradeId: string | null;
  semsterId: string | null;
}

export interface FormFile {
  contentType: string;
  contentDisposition: string;
  headers: HeaderDictionary;
  length: number;
  name: string;
  fileName: string;
}

export interface HeaderDictionary {
  contentLength: number | null;
}

export interface MainCategoryPublicResponse {
  mainCategories: MainCategoryResponse[],
  rowCount: number
}


export interface MainCategoryResponse {
  mainCategory_Id: string;
  mainCategory_Name: string;
  mainCategory_Image: string;
  stageId: string | null;
  gradeId: string | null;
  semsterId: string | null;
  general: boolean;
  isActive: boolean;
}

// ********* library category *********



export interface CreateCategoryDto {
  libraryId: string;
  name: string;
  image: FormFile;
}

export interface EditCategoryDto extends CreateCategoryDto {
  categoryId: string;
}
export interface CategoryPublicResponse {
  categories: CategoryResponse,
  rowCount: number
}

export interface CategoryResponse {
  mainCategory_Id: string;
  mainCategory_Name: string;
  category_Name: string;
  category_Image: string;
  category_Id: string;
  isActive: boolean;
}

export interface EditCategoryDto extends CreateCategoryDto {
  categoryId: string;
}

// ********** sub-category **********

export interface CreateSubCategoryDto {
  name: string;
  subCategoryImage: FormFile;
  categoryId: string;
  createSubCategoryAttachmentDtos: CreateSubCategoryAttachmentDto[];
}

export interface CreateSubCategoryAttachmentDto {
  title: string;
  fileImage: FormFile;
  file: FormFile;
}

export interface SubCategoryPublicResponse {
  subCategories: SubCategoryResponse,
  rowCount: number
}

export interface SubCategoryResponse {
  subCategory_Id: string;
  subCategory_Name: string;
  subCategory_Image: string;
  category_Id: string;
  category_Name: string;
  isActive: boolean;
  subCategoryAttachmentResponse: SubCategoryAttachmentResponse[];
}

export interface SubCategoryAttachmentResponse {
  subCategory_Id: string;
  title: string;
  file_Image: string;
  file: string;
}

export interface EditSubCategoryDto extends CreateSubCategoryDto {
  subCategoryId: string;
}
