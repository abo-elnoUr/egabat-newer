export interface FilterDto extends PaginationDto {
  name: string;
  mobile: string;
  sectionId: string | null;
  stageId: string | null;
  gradeId: string | null;
  subjectId: string | null;
  branchId: string | null;
  mzhbId: string | null;
  isActive: boolean | null;
  sort: boolean | null;
}

export interface PaginationDto {
  pageSize: number;
  pageNo: number;
}
