
export interface Pagination{
    CurrentPage : number ; 
    TotalPages : number; 
    PageSize : number; 
    TotalCount : number; 
}

export class PaginatedResult<T>{
    result! : T ;
    pagination! : Pagination ;  
}