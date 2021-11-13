// Variables 
const flagImageContainer = document.querySelector('.flag-image')
const refreshButton = document.querySelector('.refresh-button')
const userText = document.querySelector('#userText')
const submitBtn = document.querySelector('#submitBtn')
const guessFlags = document.querySelector('#guessFlags')
const strike = document.querySelector('#strike')
const bestScore = document.querySelector('#bestScore')
const flagName = document.querySelector('.flag-name')

let flagArray = []
let randomFlag
let img
let guessedFlags = 0
let strikeFlags = 0
let bestScoreFlags = 0


// Code
if(localStorage.getItem('Best-Score') === null) {
    localStorage.setItem('Best-Score', '0')
}

const allCountries = (url) => {
    // Take the response from the api
    let result = fetch(url)
    .then(response => response.json())
    .then(jsonResponse => {return jsonResponse})
    .catch(err => console.log(err))

    return result 
}

const imageSrc = (allObjects) => {
    // Take the src of a random flag image
    randomFlag = allObjects[Math.ceil(allObjects.length * Math.random())]

    console.log(`SOLUTION: ${randomFlag.name.common} / ${randomFlag.name.official}`)

    return randomFlag.flags.png
}

const createImage = (src) => {
    img = document.createElement('img')
    img.src = src
    flagImageContainer.appendChild(img)
}

const loader = async () => {
    let allInformations = await allCountries('https://restcountries.com/v3.1/all')

    for(information of allInformations) {
        flagArray.push(information)
    }

    let src = imageSrc(flagArray)

    createImage(src)
}
loader()

const clean = () => {
    flagImageContainer.removeChild(img)
    guessedFlags = 0
    strikeFlags = 0
    guessFlags.textContent = guessedFlags
    strike.textContent = strikeFlags
}

submitBtn.addEventListener('click', (e) => {
    e.preventDefault()

    if(userText.value === randomFlag.name.common || userText.value === randomFlag.name.official) {
        guessedFlags++
        strikeFlags++
        bestScoreFlags++
        
        // Save the striked flags into the localStorage
        if(bestScoreFlags > Number(localStorage.getItem('Best-Score'))) {
            localStorage.setItem('Best-Score', bestScoreFlags.toString())   
        }

        

    } else {
        strikeFlags = 0
        bestScoreFlags = 0

        if(randomFlag.name.common === randomFlag.name.official) {
            flagName.textContent = randomFlag.name.official
        } else {
            flagName.textContent = randomFlag.name.common + ' o ' + randomFlag.name.official
        }   
    }

    guessFlags.textContent = guessedFlags
    strike.textContent = strikeFlags
    bestScore.textContent = localStorage.getItem('Best-Score')

    flagImageContainer.removeChild(img)
    
    userText.value = ''

    loader()
})

refreshButton.addEventListener('click', () => {
    // Clean The Game
    clean()

    // Restart
    loader()
})
