class validator{

    static isNotExist(val) {
        if (val === null || val === undefined || val === "") {
          return true;
        }
        return false;
      }
    
    static isExist(val) {
        if (val === null || val === undefined || val === "") {
          return false;
        }
        return true;
      }

      static isLoggedIn(auth){
        if (
            auth === undefined ||
            auth.id === undefined ||
            auth.phone_number === undefined ||
            auth.country_code === undefined ||
            auth.email === undefined
          ) {
            return false;
          }
          return true;
      }
}
module.exports=validator;