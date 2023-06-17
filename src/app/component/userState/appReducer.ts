import {createReducer,on} from '@ngrx/store'
import { Profile} from 'src/app/component/userState/models'
import {retrieveprofileSucces } from './appAction'

export const initialStateofUser:Profile={
    _id:"",
    name:"",
    email:"",
    password:"",
    image:"",
    address:'',
    about:"",
    phone:0,
    isBlocked:false,
    __v:"",
    clubs:[]
}



const _profileReducer=createReducer(
    initialStateofUser,
    on(retrieveprofileSucces,(state,{userdetails})=>{
        console.log("reduuuuuuuuuuuuuuuu");
        return userdetails
    })
)

export function profileReducer(state:any,action:any){
    return _profileReducer(state,action);
  }
//-----