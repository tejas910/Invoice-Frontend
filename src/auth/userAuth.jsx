export const userAuth = () =>{
    //getting token from localstorage.
    const user = localStorage.getItem("accesstoken")
    //checking weather token is present
    if(user){
        return true;
    }
    else{
        return false
    }
}