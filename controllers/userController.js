class UserController {

    constructor(formIdCreate, FormIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate)
        this.formUpdateEl = document.getElementById(FormIdUpdate)
        this.tableEl = document.getElementById(tableId)
        this.onSubmit()
        this.onEdit()
        this.selectAll()
    }

    onEdit(){
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click',(e) => {

            this.showPanelCreate()

        })
        this.formUpdateEl.addEventListener('submit', event => {

            event.preventDefault()

            let btn = this.formUpdateEl.querySelector('[type=submit]')

            btn.disabled = true

            let values = this.getValues(this.formUpdateEl)

            
            /* acess the row edited by the admin user that was setted in addLine() method. */
            let index = this.formUpdateEl.dataset.trIndex

            let tr = this.tableEl.rows[index]

            let userOld = JSON.parse(tr.dataset.user)

            /* copy a value of atribute of another object. it overwrite from the left to right*/
            let result = Object.assign({}, userOld, values)



            this.getPhoto( this.formUpdateEl).then(

                (content) => {
                    
                    if (!values.photo) {
                        result._photo = userOld._photo
                    } else {
                        result._photo = content 
                    }

                        let user = new User()

                        user.loadFromJSON(result)

                        user.save() 

                        tr = this.getTr(user, tr)
                
                        this.updateCount()

                        this.formUpdateEl.reset()
    
                        btn.disabled = false

                    this.showPanelCreate()
            
              },(e) => {
  
                  this.addLine(values)
  
              })
        })
    }



    onSubmit(){

        this.formEl.addEventListener('submit', event => {
            /* preventDefalt() - prevent the normal refresh of the page */
            event.preventDefault()

            let btn = this.formEl.querySelector('[type=submit]')

            btn.disabled = true

            let values = this.getValues(this.formEl)
            
    /* then is a method that works based on promises and it recieves both parameters
    resolve and reject and uses function to make action based on it. */
            if (!values) return false
            
            this.getPhoto(this.formEl).then(

              (content) => {

                values.photo = content 

                values.save()

                this.addLine(values)

                this.formEl.reset() 

                btn.disabled = false
        
            },(e) => {

                this.addLine(values)

            })
        })
    }

    /* because of the return time of onload function we need to use a callback in getPhoto()
    once we don't know if onload will have enought time to make its function*/

    /*instead of what was said above we can use Promise that is an assyncronous class with methods
    based on that.*/
    getPhoto(formEl){

        return new Promise((resolve, reject) => {
            /*FileReader is a library inside we have events that disparate function in our 
            code. */
            let fileReader = new FileReader(); 

            let elements = [...formEl.elements].filter(item => {
    
                if (item.name === 'photo') {
                    return item
                }
            })
    
            let file = elements[0].files[0]
    
            fileReader.onload = () => {
    
                resolve(fileReader.result)
    
            }

            
            fileReader.onerror = ((e) => {

                reject(e)

            })

            if (file) {
                fileReader.readAsDataURL(file)
            } else {
                resolve('dist/img/boxed-bg.jpg')
            }
        })

        
    } 


    getValues(FormEl){

        let user = {};
             /* spread operator transform a colection of HTML in an array in javascript */

         let isValid = true;


        [...FormEl.elements].forEach(function(fields, index){
                /*indexof() retruns if something is inside the array and return -1> if its true */
            if(['name', 'email', 'password'].indexOf(fields.name) > -1 && !fields.value) {
                fields.parentElement.classList.add('has-error')
                isValid = false
                
            }

            if(fields.name == 'gender') {
                if (fields.checked){
                    user[fields.name] = fields.value
                }
            } else if (fields.name == 'admin') {

                user[fields.name] = fields.checked

            }else {
        
                user[fields.name] = fields.value
        
            }
        })

         if(!isValid){
             return false
         }
    
        return new User(
        user.name,
        user.gender,
        user.birth,
        user.country,
        user.email, 
        user.password,
        user.photo,
        user.admin )
    }

    getUserStorage(){

        let users = []

        if(localStorage.getItem('users')) {

            users = JSON.parse(localStorage.getItem("users"))

        }

        console.log(users)

        return users
    }

    selectAll(){

        let users = this.getUserStorage()

        users.forEach(dataUser => {

            let user = new User()

            user.loadFromJSON(dataUser)

            this.addLine(user)

        })


    }

    addLine(dataUser){

        let tr = this.getTr(dataUser)

        this.tableEl.appendChild(tr)

        this.updateCount()
    }

    /*opitional parameter tr = null */
    getTr(dataUser, tr = null){

        if (tr === null )  tr = document.createElement('tr')

    /*JSON.stringfy transform the dataset content in an object of javascript */
        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML= 
        /*innerHTML - the string inside is interpreted as a command in HTML*/
       `<td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin ? 'Sim' : 'Não'} </td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
        </td>`

        this.addEventsTr(tr)

        return tr 
    }

    addEventsTr(tr){

        tr.querySelector('.btn-delete').addEventListener('click', e => {
            // confirm() open an confirmation window on click 
            confirm('Deseja realmente excluir?')

            tr.remove() 

            this.updateCount()

        })

        tr.querySelector(".btn-edit").addEventListener('click', (e) => {

            let json = JSON.parse(tr.dataset.user)
            // sectionRowIndex is an HTML propriety that returnas the index of the rows in a tr.
             this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

        for (let name in json) {

            let field =  this.formUpdateEl.querySelector("[name=" + name.replace("_","") + "]")

            if (field){

                switch(field.type){
                    case 'file':
                        continue
                        break 

                    case 'radio':
                            field =  this.formUpdateEl.querySelector("[name=" + name.replace("_","") + "][value="+json[name]+"]")
                            field.checked = true
                        break
                        
                    case 'checkbox':
                            field.checked = json[name]
                        break
                            
                    default:
                            field.value = json[name]
                }
            }
        }
        this.formUpdateEl.querySelector('.photo').src = json._photo

            this.showPanelUpdate()
    })

    }

    showPanelCreate(){

        document.querySelector('#box-user-create').style.display = "block"
        document.querySelector('#box-user-update').style.display = "none"

    }

    showPanelUpdate(){

        document.querySelector('#box-user-create').style.display = "none"
        document.querySelector('#box-user-update').style.display = "block"
        
    }

    updateCount(){

        let numberUsers = 0
        let numberAdmin = 0;

        [...this.tableEl.children].forEach( tr =>{

            numberUsers++

            let user = JSON.parse(tr.dataset.user)

            if (user._admin) numberAdmin++ 

        })

        document.querySelector('#number-users').innerHTML = numberUsers
        document.querySelector('#number-users-admin').innerHTML = numberAdmin

    }

} 