
const btnSend = document.getElementById('send'),
   form = document.querySelector('.needs-validation'),
   btnClear =  document.getElementById('clear'),
   content = document.querySelector('.group_list_wrap');
var jsonVK = '';

const methodObject = {
   methodName: "groups.get",
   properties: {
      user_ids: '',
      filter: '',
      access_token: ''
   }
}

const customAdminLevel = {
   'admin': 3,
   'moder': 1,
   'editor': 2
}

const urlRequest = (obj) => {
   let url = "https://api.vk.com/method/";
   url += obj["methodName"] + "?";

   Object.keys(obj.properties).forEach((item) => {
      url += item + "=" + obj.properties[item] + "&";
   })

   url += "v=5.126&extended=1";
   return url;
}

const groupsSearch = (adminLevel) => {
   console.log('URL запроса', urlRequest(methodObject));

   let requstPromise = new Promise((resolve, reject) => {
      $.ajax({
         url: urlRequest(methodObject),
         method: "POST",
         dataType: "jsonp",
         success: function (data) {

            if(data.error) {
               reject(data.error);
            } else {
               jsonVK = data.response;
               console.log("Запрос - ok");
               console.log("Полученные группы: ", jsonVK.items);

               let html = `
               <hr>
               <h4 mt-5>Пользователь:
                  <span>
                     <a id="user_link" href="https://vk.com/id${methodObject.properties.user_ids}">https://vk.com/id${methodObject.properties.user_ids}</a>
                  </span>
               </h4>`;
               content.insertAdjacentHTML('beforeend', html); 
               btnClear.removeAttribute('disabled');

               resolve();
            }
         }
      });
   });

   requstPromise.then (() => {
      return new Promise(() => {
         let adminLevelArr = ['Модератор', 'Редактор','Администратор'];

         content.insertAdjacentHTML('beforeend', `
            <h4>Список групп (${methodObject.properties.filter}):</h4>`);
         let groupsArray = jsonVK.items;
         
         if (adminLevel !== '') {
            groupsArray = groupsArray.filter(gr => gr.admin_level === customAdminLevel[adminLevel] )
         }

         if (groupsArray.length === 0) {
            content.insertAdjacentHTML('beforeend', `<strong style="color: tomato;"> Нет групп с такими правами<strong/>`);
            return
         }

         groupsArray.forEach((item) => {
            let html = `
               <li> <b>${adminLevelArr[item.admin_level - 1] ? adminLevelArr[item.admin_level - 1] : "Нет прав"} </b> в группе:  <b>"${item.name}"</b> (
                  <a id="group_link" href="https://vk.com/${item.screen_name}">https://vk.com/${item.screen_name}</a>
                  )
               </li>
            `;
            content.insertAdjacentHTML('beforeend', html);
         })
      })
   })

   .catch((e) => {
      console.error( "Ошибка сэр: ", e);
      let html = `<h5 style="color: tomato;">При запросе возникла ошибка: ${e.error_msg}</h5>
                  <p>URL запроса:</p>
                  <p>${urlRequest(methodObject)}</p>
                  `
      content.insertAdjacentHTML('afterbegin', html);
      btnClear.removeAttribute('disabled');
   })
}

btnSend.addEventListener("click", event => {

   if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
   } else {
      var tokenVk = document.getElementById('token').value,
         getUserId = document.getElementById('userId'),
         adminLevel = document.getElementById('admin_level').value;
         userId = getUserId.value.match(/\d+/);

      if (userId === null) {
         getUserId.value = '';
         return form.classList.add('was-validated');
      }

      methodObject.properties.user_ids = userId[0];
      methodObject.properties.access_token = tokenVk.trim().replace(/'|"/gm, "");
      methodObject.properties.filter = adminLevel;

      groupsSearch(adminLevel);
   }
});

btnClear.addEventListener("click", el => {
   el.preventDefault();
   content.innerHTML = "";
   btnClear.setAttribute('disabled', '');
});


