// import { PageOptionsDto } from '@/common/dto/page-options.dto';

// TODO: This DTO is used to define the structure of the request payload for listing local logs. It includes pagination parameters such as currentPage and rowPerPage, which are optional. This allows clients to specify which page of results they want and how many items per page, enabling efficient retrieval of log data without overwhelming the server or client with too much information at once.
export class ListLocalLogsDto {
  currentPage?: number;
  rowPerPage?: number;
}
