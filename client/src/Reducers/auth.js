import{
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAILED,
    LOGIN_SUCCESS,
    DELETE_ACCOUNT,
    LOGOUT

} from '../actions/Types';

const initialstate = {
    token:localStorage.getItem('token'),//getting token from local storage if it is there
    isAuthenticated: null,
    loading: true,//initially loading
    user:null //at the beginning user is null
}

export default function(state=initialstate,action)
{
    const {type,payload}=action;
    switch(type){
       case USER_LOADED:
           return{
               ...state,
               isAuthenticated:true,
               loading:false,
               user:payload
           }
       case REGISTER_SUCCESS:
       case LOGIN_SUCCESS:
           localStorage.setItem('token',payload.token);
           return{
               ...state,
               ...payload,
               isAuthenticated:true,
               loading: false
           } 
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAILED:
        case LOGOUT:
        case DELETE_ACCOUNT:
            localStorage.removeItem('token');//remove token from local storage
            return{
                ...state,
                token:null,
                isAuthenticated:false,
                loading: false               
            }
        default:
            return state;
    }
}