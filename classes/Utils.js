class Utils {


    /* an static method can be called from whatever place of the code without need of be 
    instanced */
    static dateFormat(date){   

        return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear() 

    }


}