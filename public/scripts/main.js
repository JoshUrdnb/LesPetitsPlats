import { recipes } from "./data/recipes.js"

function createRecipeCard(recipe) {
    const card = document.createElement('div')
    card.className = 'card'

    const prepTime = document.createElement('span')
    prepTime.className = 'prep-time'
    prepTime.textContent = `${recipe.time}mn`
    card.appendChild(prepTime)

    const img = document.createElement('img')
    img.src = `public/img/${recipe.image}`
    img.alt = `Image de ${recipe.name}`
    img.className = 'card-img'
    card.appendChild(img)

    const cardContent = document.createElement('div')
    cardContent.className = 'card-content'

    const title = document.createElement('h2')
    title.textContent = recipe.name
    cardContent.appendChild(title)

    const recipeHeader = document.createElement('h3')
    recipeHeader.textContent = 'RECETTE'
    cardContent.appendChild(recipeHeader)

    const description = document.createElement('p')
    description.textContent = recipe.description
    cardContent.appendChild(description)

    const ingredientsHeader = document.createElement('h3')
    ingredientsHeader.textContent = 'INGRÉDIENTS'
    cardContent.appendChild(ingredientsHeader)

    const ingredientsWrapper = document.createElement('div')
    ingredientsWrapper.className = 'ingredients-wrapper'

    recipe.ingredients.forEach((ingredient) => {
        const ingredientItem = document.createElement('div')
        ingredientItem.className = 'ingredient-item'

        const ingredientName = document.createElement('p')
        ingredientName.textContent = ingredient.ingredient
        ingredientItem.appendChild(ingredientName)

        const ingredientQuantity = document.createElement('p')
        ingredientQuantity.textContent = `${ingredient.quantity || ''} ${ingredient.unit || ''}`
        ingredientItem.appendChild(ingredientQuantity)

        ingredientsWrapper.appendChild(ingredientItem)
    })

    cardContent.appendChild(ingredientsWrapper)
    card.appendChild(cardContent)

    return card
}

function displayRecipes(recipes) {
    const gridWrapper = document.querySelector('.grid-wrapper')
    gridWrapper.innerHTML = ''

    recipes.forEach((recipe) => {
        const recipeCard = createRecipeCard(recipe)
        gridWrapper.appendChild(recipeCard)
    })
}

displayRecipes(recipes)

const searchField = document.getElementById('search-input')
searchField.addEventListener('change', function (e) {
    const searchText = e.target.value.trim()
    console.log(searchText)

    filterRecipes(searchText)
})

const filteredRecipes = []

function filterRecipes(searchText) {
    const gridWrapper = document.querySelector('.grid-wrapper')
    gridWrapper.innerHTML = ''

    const lowerCaseSearchText = searchText.toLowerCase()

    recipes.forEach(recipe => {
        const recipeIngredients = recipe.ingredients.map(ing => ing.ingredient.toLowerCase()).join(' ')
        const recipeAppliance = recipe.appliance.toLowerCase()
        const recipeUstensils = recipe.ustensils.map(ust => ust.toLowerCase()).join(' ')

        // Combiner tous les éléments en une seule chaîne de texte
        const combinedText = `${recipeIngredients} ${recipeAppliance} ${recipeUstensils}`

        // Vérifier si le texte de recherche est présent dans la chaîne combinée
        if (combinedText.includes(lowerCaseSearchText)) {
            filteredRecipes.push(recipe)
            const recipeCard = createRecipeCard(recipe)
            gridWrapper.appendChild(recipeCard)
        }
    })
    
    console.log(filteredRecipes)
}



const selectedIngredients = new Set()

function filterRecipesByIngredients() {
    const gridWrapper = document.querySelector('.grid-wrapper')
    gridWrapper.innerHTML = ''

    recipes.forEach(recipe => {
        const hasIngredients = [...selectedIngredients].every(selectedIngredient =>
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === selectedIngredient.toLowerCase())
        )
        if (hasIngredients) {
            filteredRecipes.push(recipe)
            const recipeCard = createRecipeCard(recipe)
            gridWrapper.appendChild(recipeCard)
        }
    })
}

document.querySelector('.drop-btn').addEventListener('click', function () {
    const dropdownContent = document.querySelector('.dropdown-content')
    dropdownContent.classList.toggle('show')
})

function updateSelectedIngredientTags() {
    const selectedIngredientsWrapper = document.querySelector('.selected-ingredients')
    selectedIngredientsWrapper.innerHTML = ''

    selectedIngredients.forEach(ingredient => {
        const tag = document.createElement('div')
        tag.textContent = ingredient
        tag.className = 'ingredient-tag'
        
        const removeButton = document.createElement('a')
        removeButton.className = 'remove-tag'

        const icon = document.createElement('i')
        icon.className = 'fa-solid fa-xmark'
        icon.setAttribute('aria-hidden', 'true')
        removeButton.appendChild(icon)

        removeButton.addEventListener('click', function() {
            selectedIngredients.delete(ingredient)
            populateDropdown(recipes)
            filterRecipesByIngredients()
            updateSelectedIngredientTags()
        })

        tag.appendChild(removeButton)
        selectedIngredientsWrapper.appendChild(tag)
    })
}

function populateDropdown(recipes) {
    const dropdownContent = document.querySelector('.dropdown-content2')
    dropdownContent.innerHTML = ''

    const ingredientsSet = new Set()

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredientsSet.add(ingredient.ingredient)
        })
    })

    ingredientsSet.forEach(ingredient => {
        const ingredientLink = document.createElement('a')
        ingredientLink.href = '#'
        ingredientLink.textContent = ingredient
        ingredientLink.addEventListener('click', function (e) {
            e.preventDefault()
            if (selectedIngredients.has(ingredient)) {
                selectedIngredients.delete(ingredient)
                ingredientLink.classList.remove('selected')
            } else {
                selectedIngredients.add(ingredient)
                ingredientLink.classList.add('selected')
            }
            filterRecipesByIngredients()
            updateSelectedIngredientTags()
        })
        dropdownContent.appendChild(ingredientLink)
    })
}

populateDropdown(recipes)
updateSelectedIngredientTags()