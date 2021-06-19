//API
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const Index_URL = BASE_URL + '/api/v1/users/'

const allUsers = []
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
            <button class="btn btn-secondary btn-add-target" data-id="${user.id}">target</button>
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

function getUsersByPage(page) {

  const data = filteredallUsers.length ? filteredallUsers : allUsers


  //page 1-> movies 0-11
  //page 2-> movies 12-23
  //page 3-> movies 24-35
  //...

  const startIndex = (page - 1) * USERS_PER_PAGE

  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

function addToTarget(id){

  // function isMovieIDMatched(movie){
  //   return movie.id === id
  // }
  //我想要loclaStorage.getItem,如果沒有的話，就給我空陣列
  const list = JSON.parse(localStorage.getItem('targetUsers')) || []
  //find和filter很像，後面都放一個函式
  const user = allUsers.find(user => user.id === id)
  //some()和find(),有點像，find()是回傳元素本身,some()是要知道list裡面到底有沒有movie，有的話true，沒有的話false
  if (list.some((user) => user.id ===id)){
    return alert("此目標已經在目標清單中")
  }

  list.push(user)
  //JSON.parse  ,將JSON轉為JS資料
  //JSON.stringify  ,將JS資料轉為JSON
  // let jsonString = JSON.stringify(list)

  localStorage.setItem('targetUsers',JSON.stringify(list))
  // console.log('jsonParse : ',JSON.parse(jsonString))
  // console.log('jsonString : ',jsonString)
}

usersPanel.addEventListener('click', function onPanelClick(event){

  if (event.target.matches('.btn-show-user')){
    // console.log(event.target.dataset)
    showUsers(Number(event.target.dataset.id))
    // console.log(Number(event.target.dataset.id))
  }else if(event.target.matches('.btn-add-target')){
    addToTarget(Number(event.target.dataset.id))
  }
})


searchForm.addEventListener('submit', function onSearchFormSubmiited(event) {
  //取消預設效果
  event.preventDefault()
  //toLowerCase()變小寫，trim()去掉前後空白
  const keyword = searchInput.value.trim().toLowerCase()

  if (!keyword.length) {
    return alert('Please enter valid string')
  }
  //filter方法
  filteredallUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )

  if (filteredallUsers.length === 0) {
    return alert('Cannot find user with keyword : ' + keyword)
  }
  ///////filter示範
  // const number = [1,2,3,4,5]

  // function islessThan(number){
  // 	return number < 3
  // }
  // console.log(numbers.filter(islessThan3))   [1,2]
  // console.log(number.filter(number =>number < 3))
  // console.log(number.filter(number =>{ [1,2]
  // 	return number < 3
  // }))
  ///////filter示範

  ////迴圈方法
  // for(const movie of movies)
  // 	//如果keyword 有包含在movie裡
  // 	if(movie.title.toLowerCase().includes(keyword)){
  // 		filteredMovies.push(movie)
  // 	}
  //重製分頁器
  renderPaginator(filteredallUsers.length)  //新增這裡
  renderUsers(getUsersByPage(1))
})




paginator.addEventListener('click',function onPaginatorClicked(event){
  //如果被點擊的不是a標籤，結束
  if(event.target.tagName !== 'A') return
  //透過dataset取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  renderUsers(getUsersByPage(page))
  //點頁數會顯示頁數
  //console.log(event.target.dataset.page)
})


axios
    .get(Index_URL)
    .then(function (response) {
      allUsers.push(...response.data.results)
      renderPaginator(allUsers.length)
      renderUsers(getUsersByPage(1))
    })
    .catch(function (error) {
        console.log(error);
    });