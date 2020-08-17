class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {

        this._id
        this._name = name 
        this._gender = gender
        this._birth = birth
        this._country = country
        this._email = email
        this._password = password
        this._photo = photo
        this._admin = admin
        this._register = new Date()
        
    }

    get id(){
        return this._id
    }

    get register(){
        return this._register
    }

    get name(){
    return this._name
    }

    get gender(){
        return this._gender
    }

    get birth(){
        return this._birth
    }

    get country(){
        return this._country
    }

    get email(){
        return this._email
    }

    get password(){
        return this._password
    }

    get photo(){
        return this._photo
    }

    get admin(){
        return this._admin
    }


    
    set photo(value){
        this._photo = value 
    }

    set register(value){
         this._register = value
    }

    set name(value){
     this._name = value
    }

    set gender(value){
         this._gender = value
    }

    set birth(value){
         this._birth = value
    }

    set country(value){
         this._country = value
    }

    set email(value){
         this._email = value
    }

    set password(value){
         this._password = value
    }

    set admin(value){
         this._admin = value
    }

    loadFromJSON(json){

        for(let name in json) {

            switch(name){

                case '_register':
                    this[name] = new Date(json[name])
                    break
                default:
                    this[name] = json[name]

            }


        }

    }

    static getUserStorage(){

        let users = []

        if(localStorage.getItem('users')) {

            users = JSON.parse(localStorage.getItem("users"))

    }

    return users 

}


    getNewID(){

        let usersID = parseInt(localStorage.getItem('usersID')) 

        if (!usersID) usersID = 0
        
        usersID++ 

        localStorage.setItem('usersID', usersID)

        return usersID 


    }

    save(){

        let users = User.getUserStorage() 

        if(this.id > 0) {
            /* the map function maps the array and makes it easier to find elements inside it. */
            users.map(u => {

                if (this._id == this.id) {
                    
                    Object.assign(u, this)

                }

                return u 

            }) 
        } else {

            this._id = this.getNewID()

            users.push(this)

        }

        localStorage.setItem("users", JSON.stringify(users))

    }

    remove(){

        let users = User.getUserStorage() 

        users.forEach((userData, index) => {

            if (this._id == userData._id) {
                /*spice function remove things from the array but needs to recieve two parameters
                1: index of the element
                2: how much from this element you want to remove. 
                If one for example, it will just remove the current element from the array. */
                users.splice(index, 1)

            }

        });

        localStorage.setItem("users", JSON.stringify(users))

    }

}