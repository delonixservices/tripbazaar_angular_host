import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
  
  getToken(): String {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: String, refresh: String) {
    window.localStorage['jwtToken'] = token;
    window.localStorage['jwtRefresh'] = refresh;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
    window.localStorage.removeItem('jwtRefresh');
  }
  
  isAuth(){
  	
  	var token = window.localStorage['jwtToken'];
  	if(token){
  		return true;
  	}else{
  		return false;
  	}
  }

}
