import {createSelector} from '@ngrx/store'
import { appProfile } from './appstate'
import { Profile} from 'src/app/component/userState/models';

//----user----------

export const profileRootSelector=(state:appProfile)=>state.userdetails;
export const userProfile=createSelector(
    profileRootSelector,
    (userdetails:Profile)=>{
       return userdetails
    }
)
