export interface IGrade {
  gradeId: string,
  gradeName: string,
  index: number,
  stageId: string,
  stageName: string
}

export interface GradeResponseDto {
  gradeId: string;
  gradeName: string;
  index: number;
  stageId: string;
  stageName: string;
  countryName: string;
  countryId: string;
  isActive: boolean;
}