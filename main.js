
let btnSend = document.getElementById('send'),
   btnClear =  document.getElementById('clear'),
   form =  document.getElementById('form'),
   userLink = document.getElementById('user_link'),
   content = document.querySelector('.group_list_wrap'),
   jsonVK = '';


/** 
 * ? объект с методами для запроса 
 * ? В methodName указываем метод который хотим использовать, в properties прописываем дополнительные
 * ? параметры как в примере (ключ значение) */ 

let methodObject = {
   methodName: "groups.get",
   properties: {
      user_ids: '',
      filter: '',
      access_token: ''

   }

}

/** 
 * ? Функция для составления запроса */

const urlRequest = (options) => {
   let url = "https://api.vk.com/method/";

   url += options["methodName"] + "?";

   for (item in options.properties) {
      
      url += item + "=" + options.properties[item] + "&";

   }

   url += "v=5.103&extended=1";
  
   return url;
}

const messagesSearch = () => {
   let testPromise = new Promise((resolve, reject) => {
      
      $.ajax({
         url: urlRequest(methodObject),
         method: "POST",
         dataType: "jsonp",
         success: function (data) {

            if(data.error) {
               reject(data.error);
            } else {
               jsonVK = data.response;
               console.log("Первый запрос - ok");
               
               console.log("Группы: ", jsonVK.items);

               content.innerHTML += `
               <h3>Пользователь:
                  <span>
                     <a id="user_link" href="https://vk.com/id${userId}">https://vk.com/id${userId}</a>
                  </span>
               </h3>`;

               resolve();
            }
         }
      });
});

testPromise.then (() => {
   return new Promise((resolve, reject) => {
      let adminLevelArr = ['Модератор', 'Редактор','Администратор'];

      content.innerHTML += `
               <h3>Список групп:</h3>
              `;
      let groupsArray = jsonVK.items;

      groupsArray.forEach((item) => {

         content.innerHTML += `
         <li> <b>${adminLevelArr[item.admin_level - 1] ? adminLevelArr[item.admin_level - 1] : "Нет прав"} </b> в группе:  <b>"${item.name}"</b> 
            <a id="group_link" href="https://vk.com/${item.screen_name}">( https://vk.com/${item.screen_name} )</a>
         </li>`;
      })
   })
})

.catch((e) => {
   console.error( "Ошибка сэр: " + e.error_msg);
   console.log(e);
})

}


btnSend.addEventListener("click", el => {
   if (form.checkValidity()) {
      let = tokenVk = document.getElementById('token').value,
         userId = document.getElementById('userId').value;
         adminLevel = document.getElementById('admin_level').value;

      methodObject.properties.user_ids = userId.trim().replace(/'|"/gm, "");
      methodObject.properties.access_token = tokenVk.trim().replace(/'|"/gm, "");
      methodObject.properties.filter = adminLevel.trim(); 

      console.log(methodObject);
      messagesSearch();
    }
   el.preventDefault();
});

btnClear.addEventListener("click", el => {
   content.innerHTML = "";
   el.preventDefault();
});


