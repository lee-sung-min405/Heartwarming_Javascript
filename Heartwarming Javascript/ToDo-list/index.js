// HTML 문서에서 id가 "todo-input"인 요소를 가져와 todoInput 변수에 할당
const todoInput = document.getElementById("todo-input");

// HTML 문서에서 id가 "todo-list"인 요소를 가져와 todoList 변수에 할당
const todoList = document.getElementById("todo-list");

const savedWeatherData = JSON.parse(localStorage.getItem("saved-weather"));
// localStorage에서 "save-items" 키로 저장된 데이터를 불러와서 savedTodoList 변수에 파싱하여 할당
const savedTodoList = JSON.parse(localStorage.getItem("save-items"));

// todo를 생성하는 함수 정의
const createTodo = (storageDate) => {
  // 입력 필드의 값을 todoContents 변수에 할당
  let todoContents = todoInput.value;

  // 만약 storageDate가 주어졌다면, todoContents를 storageDate의 contents 값으로 덮어씀
  if (storageDate) {
    todoContents = storageDate.contents;
  }

  // 새로운 리스트 아이템 (li), 스팬 (span), 버튼 (button)을 생성
  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const newBtn = document.createElement("button");

  // 버튼에 클릭 이벤트 리스너 추가
  newBtn.addEventListener("click", () => {
    // 리스트 아이템에 'complete' 클래스를 토글하여 완료 상태를 변경하고, 변경사항을 저장
    newLi.classList.toggle("complete");
    saveItemsFn();
  });

  // 리스트 아이템에 더블 클릭 이벤트 리스너 추가
  newLi.addEventListener("dblclick", () => {
    // 리스트 아이템을 삭제하고 변경사항을 저장
    newLi.remove();
    saveItemsFn();
  });

  // storageDate의 complete 속성이 true일 때 'complete' 클래스를 추가하여 아이템을 완료 상태로 표시
  if (storageDate?.complete) {
    newLi.classList.add("complete");
  }

  // 스팬에 todoContents 텍스트를 할당
  newSpan.textContent = todoContents;

  // 리스트 아이템에 버튼과 스팬을 추가
  newLi.appendChild(newBtn);
  newLi.appendChild(newSpan);

  // 리스트 아이템을 todoList에 추가
  todoList.appendChild(newLi);

  // 입력 필드 값을 비움
  todoInput.value = "";

  // 변경된 항목을 저장하는 함수 호출
  saveItemsFn();
};

// 키 이벤트를 확인하여 Enter 키가 눌리면 createTodo 함수 호출
const keyCodeCheck = () => {
  if (window.event.keyCode === 13 && todoInput.value.trim() !== "") {
    createTodo();
  }
};

// 모든 리스트 아이템을 삭제하는 함수
const deleteAll = () => {
  const liList = document.querySelectorAll("li");
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  // 변경사항을 저장하는 함수 호출
  saveItemsFn();
};

// 현재 화면에 표시된 todo 항목들을 저장하는 함수
const saveItemsFn = () => {
  const saveItems = [];
  for (let i = 0; i < todoList.children.length; i++) {
    // 각 리스트 아이템의 내용과 완료 상태를 객체로 만들어 saveItems 배열에 추가
    const todoObj = {
      contents: todoList.children[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete"),
    };
    saveItems.push(todoObj);
  }

  // saveItems 배열을 JSON 문자열로 변환하여 "save-items" 키로 localStorage에 저장
  // 삼항 연산자를 사용하여 저장할 데이터가 없으면 해당 키를 제거함
  saveItems.length === 0
    ? localStorage.removeItem("save-items")
    : localStorage.setItem("save-items", JSON.stringify(saveItems));
};

// 페이지 로드 시 localStorage에서 불러온 savedTodoList를 사용하여 todo 항목 생성
if (savedTodoList) {
  for (let i = 0; i < savedTodoList.length; i++) {
    createTodo(savedTodoList[i]);
  }
}

const weatherDataActive = ({ location, weather }) => {
  const weatherMainList = [
    "Clear",
    "Clouds",
    "Drizzle",
    "Fog",
    "Rain",
    "Snow",
    "Thunderstorm",
  ];
  weather = weatherMainList.includes(weather) ? weather : "Fog";
  const locationNameTag = document.querySelector("#location-name-tag");
  locationNameTag.textContent = location;
  document.body.style.backgroundImage = `url('./images/${weather}.jpg')`;
  if (
    !savedWeatherData ||
    savedWeatherData.location !== location ||
    savedWeatherData.weather !== weather
  ) {
    localStorage.setItem(
      "saved-weather",
      JSON.stringify({ location, weather })
    );
  }
};

const weatherSearch = (position) => {
  const openweatherRes = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=4d0e5f792bffedb8cbf4e3346d2039b2`
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      const weatherData = {
        location: json.name,
        weather: json.weather[0].main,
      };
      weatherDataActive(weatherData);
    })
    .catch((err) => {
      console.error(err);
    });
};

const accessToGeo = ({ coords }) => {
  const { latitude, longitude } = coords;

  //key와 value값이 같으면 key값을 생략가능 하다. 이것을 shorthand property라고 한다.
  const positionObj = {
    latitude,
    longitude,
  };
  weatherSearch(positionObj);
};

const askForLocation = () => {
  navigator.geolocation.getCurrentPosition(accessToGeo, (err) => {
    console.log(err);
  });
};

askForLocation();
