interface userI{
    id:number
    name:string
  }
export interface messageI{
    id:number
    from:userI
    from_id:number
    to:userI
    message :string
    viewAt :boolean
    createdAt: Date
}
  