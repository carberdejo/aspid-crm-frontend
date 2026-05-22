import { GenericFilters } from ".";
export interface IndustrySegment {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface IndustrySegmentCreateDto {
  code: string;
  name: string;
}

export interface IndustrySegmentUpdateDto extends Partial<IndustrySegmentCreateDto> {
  id?: number;
  isActive?: boolean;
}

export interface industrySegmentsQuery extends GenericFilters {
  term?: string;
}
