import { GenericFilters } from ".";
export interface IndustrySegment {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface IndustrySegmentCreateDto {
  code: string;
  name: string;
}

export interface IndustrySegmentUpdateDto extends Partial<IndustrySegmentCreateDto> {
  id?: string;
  isActive?: boolean;
}

export interface industrySegmentsQuery extends GenericFilters {
  term?: string;
}
