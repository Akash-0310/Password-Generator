const lengthDisplay = document.querySelector(".data-length-number");
const inputSlider = document.querySelector("#length-slider");

const passwordDisplay = document.querySelector(".display-password");
const copyBtn = document.querySelector(".data-copy-btn");
const copyImg = document.querySelector(".copied");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector(".data-indicator");
const generateBtn = document.querySelector(".generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const allSymbols = "|+_)(*&^%$#@!~`'][?/.<>,}{";

let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
  return getRandomInteger(0, 9);
}

function getRandomLowercase() {
  return String.fromCharCode(getRandomInteger(97, 122));
}

function getRandomUppercase() {
  return String.fromCharCode(getRandomInteger(65, 90));
}

function getRandomSymbol() {
  const randomNum = getRandomInteger(0, allSymbols.length);
  return allSymbols.charAt(randomNum);
}

function calculateStrength() {
  let hasUpper = false;
  let hasNum = false;
  let hasLower = false;
  let hasSymbol = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
    setIndicator("#41E711 ");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#FFFB00");
  } else {
    setIndicator("#EE2D0F");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
  } catch (e) {
    copyImg.innerText = "Copy failed";
  }
  copyImg.classList.add("active");
  setTimeout(() => {
    copyImg.classList.remove("active");
  }, 1000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  if (checkCount == 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  password = "";
  const funcArray = [];

  if (uppercaseCheck.checked) {
    funcArray.push(getRandomUppercase);
  }
  if (lowercaseCheck.checked) {
    funcArray.push(getRandomLowercase);
  }
  if (numbersCheck.checked) {
    funcArray.push(getRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArray.push(getRandomSymbol);
  }
  for (let i = 0; i < funcArray.length; i++) {
    password += funcArray[i]();
  }
  for (let i = 0; i < passwordLength - funcArray.length; i++) {
    let rndIndex = getRandomInteger(0, funcArray.length);
    password += funcArray[rndIndex]();
  }

  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  calculateStrength();
});
