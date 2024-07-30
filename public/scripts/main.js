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

let filteredRecipes = recipes

function filterRecipes(searchText = '') {
    const gridWrapper = document.querySelector('.grid-wrapper')  // Sélectionne l'élément avec la classe 'grid-wrapper'
    gridWrapper.innerHTML = ''  // Vide le contenu de l'élément
    const lowerCaseSearchText = searchText.toLowerCase()  // Convertit le texte de recherche en minuscules
    const filteredNewRecipes = []  // Initialise un tableau pour stocker les recettes filtrées

    for (let i = 0; i < filteredRecipes.length; i++) {  // Parcourt toutes les recettes filtrées
        const recipe = filteredRecipes[i]  // Récupère chaque recette

        // Vérifie si la recette a un nom, et convertit ce nom en minuscules
        let recipeName = ''
        if (recipe.name) {
            recipeName = recipe.name.toLowerCase()
        }

        // Concatène tous les ingrédients de la recette en une seule chaîne de caractères en minuscules
        let recipeIngredients = ''
        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ing = recipe.ingredients[j]
            if (ing.ingredient) {
                recipeIngredients += ing.ingredient.toLowerCase()
            }
        }

        // Vérifie si la recette a une description, et convertit cette description en minuscules
        let recipeDescription = ''
        if (recipe.description) {
            recipeDescription = recipe.description.toLowerCase()
        }

        // Vérifie si le texte de recherche est inclus dans le nom, les ingrédients ou la description de la recette
        let isMatch = false
        if (recipeName.includes(lowerCaseSearchText)) {
            isMatch = true
        } else if (recipeIngredients.includes(lowerCaseSearchText)) {
            isMatch = true
        } else if (recipeDescription.includes(lowerCaseSearchText)) {
            isMatch = true
        }

        // Si une correspondance est trouvée, ajoute la recette aux résultats filtrés et affiche-la dans la grille
        if (isMatch) {
            filteredNewRecipes.push(recipe)
            const recipeCard = createRecipeCard(recipe)
            gridWrapper.appendChild(recipeCard)
        }
    }

    filteredRecipes = filteredNewRecipes  // Met à jour la liste des recettes filtrées
    console.log(filteredRecipes)  // Affiche les recettes filtrées dans la console
    // updateDropdownWithAssociatedIngredients(filteredRecipes)  // Met à jour le dropdown avec les ingrédients associés
}

const selectedIngredients = new Set()

function filterRecipesByIngredients() {
    const gridWrapper = document.querySelector('.grid-wrapper')
    gridWrapper.innerHTML = ''

    const filteredNewRecipes = []

    filteredRecipes.forEach(recipe => {
        const hasIngredients = [...selectedIngredients].every(selectedIngredient =>
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === selectedIngredient.toLowerCase())
        )
        if (hasIngredients) {
            filteredNewRecipes.push(recipe)
            const recipeCard = createRecipeCard(recipe)
            gridWrapper.appendChild(recipeCard)
        }
    })

    filteredRecipes = filteredNewRecipes
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

        removeButton.addEventListener('click', function () {
            selectedIngredients.delete(ingredient)
            populateDropdown(recipes)
            filteredRecipes = recipes
            filterRecipes()
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

    const ingredientSearchInput = document.getElementById('ingredient-search')
    ingredientSearchInput.addEventListener('input', function (e) {
        const searchValue = e.target.value.trim().toLowerCase()

        dropdownContent.querySelectorAll('a').forEach(link => {
            const ingredientName = link.textContent.toLowerCase()
            if (ingredientName.includes(searchValue)) {
                link.style.display = 'block'
            } else {
                link.style.display = 'none'
            }
        })
    })
}

populateDropdown(recipes)
updateSelectedIngredientTags()