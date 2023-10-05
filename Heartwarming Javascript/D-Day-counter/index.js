const messageContainer = document.querySelector("#D-DAY-message");
const dDayCount = document.querySelector("#d-day-count");
const savedDate = localStorage.getItem("saved-date");
console.log(savedDate);
const intervalIdArr = [];

dDayCount.style.display = "none";
messageContainer.textContent = "D-DAY를 입력해주세요.";
messageContainer.innerHTML = "<h3>D-DAY를 입력해주세요.<h3>";

const dataFormaker = () => {
  const inputYear = document.querySelector("#target-year-input").value;
  const inputMonth = document.querySelector("#target-month-input").value;
  const inputdate = document.querySelector("#target-date-input").value;
  const dateFormat = `${inputYear}-${inputMonth}-${inputdate}`;
  return dateFormat;
};

const counterMaker = (date) => {
  if (date !== savedDate) {
    localStorage.setItem("saved-date", date);
  }
  const nowDate = new Date();
  const targetDate = new Date(date).setHours(0, 0, 0, 0);
  const remaining = (targetDate - nowDate) / 1000;

  // 만약 remaining이 0이라면, 타이머가 종료되었습니다. 출력
  // 수도코드
  if (remaining <= 0) {
    dDayCount.style.display = "none";
    messageContainer.innerHTML = "<h3>타이머가 종료되었습니다.<h3>";
    messageContainer.style.display = "flex";
    // return을 만나면 counterMaker()함수가 종료가된다.
    setClearInterval();
    return;
  } else if (isNaN(remaining)) {
    //만약 잘못된 날자가 들어왔다면, 유효한 시간대가 아닙니다. 출력
    dDayCount.style.display = "none";
    messageContainer.innerHTML = "<h3>유효한 시간대가 아닙니다.<h3>";
    messageContainer.style.display = "flex";
    setClearInterval();
    return;
  }

  const remainingObject = {
    remainingDate: Math.floor(remaining / 3600 / 24),
    remainingHours: Math.floor(remaining / 3600) % 24,
    remainingMin: Math.floor(remaining / 60) % 60,
    remainingSec: Math.floor(remaining) % 60,
  };

  const timeKeys = Object.keys(remainingObject);
  const documentArr = ["days", "hours", "min", "sec"];

  const format = (time) => {
    if (time < 10) {
      return "0" + time;
    } else {
      return time;
    }
  };

  let i = 0;
  for (let tag of documentArr) {
    const remainingTime = format(remainingObject[timeKeys[i]]);
    document.getElementById(tag).textContent = remainingTime;
    i++;
  }
};

const starter = (targetDateInput) => {
  console.log(targetDateInput);
  if (!targetDateInput) {
    targetDateInput = dataFormaker();
  }
  dDayCount.style.display = "flex";
  messageContainer.style.display = "none";
  setClearInterval();
  counterMaker(targetDateInput);
  const intervalId = setInterval(() => {
    counterMaker(targetDateInput);
  }, 1000);
  intervalIdArr.push(intervalId);
};

const setClearInterval = () => {
  localStorage.removeItem("saved-date");
  for (let i = 0; i < intervalIdArr.length; i++) {
    clearInterval(intervalIdArr[i]);
  }
};

const resetTimer = () => {
  dDayCount.style.display = "none";
  messageContainer.style.display = "flex";
  messageContainer.innerHTML = "<h3>D-DAY를 입력해주세요.<h3>";
  setClearInterval();
};

if (savedDate) {
  starter(savedDate);
} else {
  dDayCount.style.display = "none";
  messageContainer.innerHTML = "<h3>D-DAY를 입력해주세요.<h3>";
}
