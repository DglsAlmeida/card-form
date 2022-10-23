import IMask from "imask";
import "./css/index.css";

const bgColorO1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const bgColorO2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

const setCardType = (type) => {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69334"],
    default: ["black", "gray"],
  }

  bgColorO1.setAttribute("fill", colors[type][0])
  bgColorO2.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const updateValueInCard = (replacedValue, elementSelector, alternativeText) => {
  const selectedElement = document.querySelector(elementSelector)
  selectedElement.innerText = replacedValue.value.length === 0 ? alternativeText : replacedValue.value
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default"
    },
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended.replace(/\D/g, ""))
    const numberWasFound = ({ regex }) => number.match(regex)
    return dynamicMasked.compiledMasks.find(numberWasFound)
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const cardHolder = document.querySelector("#card-holder")

const expirationDate = document.querySelector('#expiration-date')
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado! :)")
})

cardHolder.addEventListener("input", () => {
  updateValueInCard(cardHolder, '.cc-holder .value', 'FULANO DA SILVA')
})

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  updateValueInCard(cardNumber, '.cc-number', '1234 5678 9012 3456')
})

expirationDateMasked.on("accept", () => {
  updateValueInCard(expirationDate, '.cc-extra .value', '02/32')
})

securityCodeMasked.on("accept", () => {
  updateValueInCard(securityCode, '.cc-security .value', '123')
})

