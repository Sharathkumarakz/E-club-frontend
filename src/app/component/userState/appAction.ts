import { createAction, props } from "@ngrx/store";
import {Profile} from "src/app/component/userState/models";

export const retrieveprofile=createAction('[profile API]API success',)
export const retrieveprofileSucces=createAction('[Profile API]API SuccessSuccess',
props<{ userdetails: Profile }>()
)
