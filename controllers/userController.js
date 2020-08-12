class UserController {

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId)
        this.tableEl = document.getElementById(tableId)

        this.onSubmit()

    }

    onSubmit(){

        this.formEl.addEventListener('submit', event => {
            /* preventDefalt() - prevent the normal refresh of the page */
            event.preventDefault()

            let values = this.getValues()
            

            this.getPhoto((content) => {

                values.photo = content 

            })

            this.addLine(values)

        })
    }

    /* because of the return time of onload function we need to use a callback in getPhoto()
    once we don't know if onload will have enought time to make its function*/
    getPhoto(callback){

        let fileReader = new FileReader(); 

        let elements = [...this.formEl.elements].filter(item => {

            if (item.name === 'photo') {
                return item
            }

        })

        fileReader.onload = () => {

            callback(fileReader.result)

        }

        let file = elements[0].files[0]
        console.log(file)
        fileReader.readAsDataURL(file)
    } 


    getValues(){

        let user = {};
             /* spread operator transform a colection in an array in javascript */

        [...this.formEl.elements].forEach(function(fields, index){

            if(fields.name == 'gender' && fields.checked) {
        
                user[fields.name] = fields.value
        
            } else {
        
                user[fields.name] = fields.value
        
            }
        })
    
        return new User(
        user.name,
        user.gender,
        user.brith,
        user.country,
        user.email, user.password,
        user.photo,
        user.admin )
    
      

    }


    addLine(dataUser){

        /*innerHTML - the string inside is interpreted as a command in HTML*/
        this.tableEl.innerHTML = 
        `<tr>
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin}</td>
                <td>${dataUser.birth}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
        </tr>`
    
    }
    

} 