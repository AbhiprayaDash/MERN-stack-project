//function takes a token if there is a token add it to the header otherwise delete it from header
import axios from 'axios';

const setAuthToken = token =>{
    if(token)
    {
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    else{
        delete axios.defaults.headers.common['x-auth-token'];
    }
};
export default setAuthToken;