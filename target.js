//API
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const Index_URL = BASE_URL + '/api/v1/users/'

const allUsers = JSON.parse(localStorage.getItem('targetUsers'))
let filteredallUsers=[]

const usersPanel = document.querySelector('#users')
const userModal = document.querySelector('#user-modal')
const paginator = document.querySelector('#paginator')

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const USERS_PER_PAGE = 18

function renderUsers(data) {
  let rawHTML=''
  data.forEach(user => {
      const name = user.name
      const surname = user.surname
      const avatar = user.avatar
      const age = user.age
      const email = user.email

      rawHTML += `
      <div class="user col-xl-2 col-lg-3 col-sm-4 mt-3">
        <div class="card" style="width: 18rem;">
          <img src="${avatar}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${name} ${surname}</h5>
            <p class="card-text"><em>REWARD : ${getRandomTenThousand(20, 5)}</em></p>
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-secondary btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal"  data-id="${user.id}">
            More
            </button>
             <button class="btn btn-danger btn-remove-favorite" data-id="${user.id}">X</button>
          </div>
        </div>
      </div>
      `;
  })
  usersPanel.innerHTML = rawHTML
}

function showUsers(id) {

  const modalName = document.querySelector('#user-modal-name')
  const modalImage = document.querySelector('#user-modal-image')
  const modalGender = document.querySelector('#user-modal-gender')
  const modalBirthday = document.querySelector('#user-modal-birthday')

  // console.log(modalTitle)
  axios.get(Index_URL+ id).then(response =>{
      // console.log(response.data)
      const data = response.data
      // console.log(data)
      modalName.innerText = data.name+' '+data.surname
      modalImage.innerHTML = `  <img src="${data.avatar}" alt="user-poster" class="img-fluid">`
      modalGender.innerText = 'gender :'+data.gender
      modalBirthday.innerText = 'birthday :'+data.birthday

  })
  .catch((err) => console.log(err))


    
    // allUsers.forEach(user => {
    //   const name = user.name
    //   const gender = user.gender
    //   const surname = user.surname
    //   const avatar = user.avatar
    //   const age = user.age
    //   const email = user.email
    //   const birthday = user.birthday

    //   userModal.innerHTML += `
       
    //   <div class="modal fade" id="userDetail${user.id}" tabindex="-1"   aria-labelledby="exampleModalLabel" aria-hidden="true">
    //     <div class="modal-dialog">
    //       <div class="modal-content">
    //         <div class="modal-header">
    //           <h5 class="modal-title" id="exampleModalLabel">${name} ${surname}</h5>
    //           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //         </div>
    //         <div class="modal-body">
    //           gender: ${gender} <br>
    //           age : ${age} <br>
    //           birthday : ${birthday} <br>
    //         </div>
    //         <div class="modal-footer">
    //           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //    `
    // })
}

//懸賞金的亂數getRandomTenThousand(20,5)，產生50000~200000的亂數
function getRandomTenThousand(max, min) {
    return (Math.floor(Math.random() * (max - min + 1)) + min) * 10000
}

function renderPaginator(amount) {
  // 80部電影/1頁12部 = 6頁...8部 //所以總共要7頁

  //Math.ceil 無條件進位
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)

  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `

  }
  paginator.innerHTML = rawHTML

}

function removeFromTarget(id){
 //如果movies是空的話，就return，結束這個 函式 
  if(!allUsers) return
 
 //用 findIndex 找出movies中符合 movie.is===id，findIndex會回傳index，接著存到movieIndex裡面。
 const userIndex = allUsers.findIndex((user) => user.id === id)
 
 //如果 movieIndex === -1 就return，結束這個函式。 findIndex 如果沒找到東西就會回傳-1。
 if(userIndex === -1) return
 
 //刪掉movies中movieIndex這個index
 allUsers.splice(userIndex,1)
 
  //把localstorage中favoriteMovies更新movies，並用 JSON.stringify ()，從JS變成JSON
 localStorage.setItem('targetUsers', JSON.stringify(allUsers))

 
 renderUsers(allUsers)
}


usersPanel.addEventListener('click', function onPanelClick(event){

  if (event.target.matches('.btn-show-user')){
    // console.log(event.target.dataset)
    showUsers(Number(event.target.dataset.id))
    // console.log(Number(event.target.dataset.id))
  }else if(event.target.matches('.btn-remove-favorite')){
    removeFromTarget(Number(event.target.dataset.id))
  }
})





  







renderUsers(allUsers)