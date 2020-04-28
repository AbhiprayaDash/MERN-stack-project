import uuid from 'uuid/v4';
import {SET_ALERT,REMOVE_ALERT} from './Types';

export const setAlert =(msg,alertType) => dispatch =>{
    const id=uuid();
    dispatch({
        type:SET_ALERT,
        payload:{msg,alertType,id}
    });
    //removes itself after 5 seconds
    setTimeout(() =>dispatch({type:REMOVE_ALERT,payload:id}),5000);    
};