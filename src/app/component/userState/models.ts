export interface Profile{
    _id:string; 
    name:string;
    email:string
    password:string
    image:string
    address:string;
    about:string;
    phone:Number
    __v:string
    isBlocked:boolean
    clubs:[]
}
