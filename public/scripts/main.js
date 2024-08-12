import { recipes } from "./data/recipes.js"
import { createRecipeCard } from "./recipes-template.js"

let filteredRecipes = recipes
const searchField = document.getElementById('search-input')
const selectedIngredients = new Set()
// const selectedAppliances = new Set()

function displayRecipes(recipes) {
    const gridWrapper = document.querySelector('.grid-wrapper')
    gridWrapper.innerHTML = ''

    recipes.forEach((recipe) => {
        const recipeCard = createRecipeCard(recipe)
        gridWrapper.appendChild(recipeCard)
    })
}

function updateSearchResultsCount(count) {
    const allRecipesDiv = document.getElementById('all-recipes')
    allRecipesDiv.innerHTML = `${count} recettes`
}

searchField.addEventListener('input', function () {
    filterRecipesCombined()
})

// Construit le tableau des recettes qui repondent au texte saisi.
function filterRecipes() {
    const searchText = searchField.value.trim()
    console.log(searchText)

    if (searchText.length < 3) {
        filteredRecipes = recipes
        return
    }

    const lowerCaseSearchText = searchText.toLowerCase()

    const filteredNewRecipes = []

    recipes.forEach(recipe => {
        const recipeName = recipe.name ? recipe.name.toLowerCase() : ''
        const recipeDescription = recipe.description ? recipe.description.toLowerCase() : ''
        const recipeIngredients = recipe.ingredients.map(ing => ing.ingredient ? ing.ingredient.toLowerCase() : '').join('')

        // Combiner tous les éléments en une seule chaîne de texte
        const combinedText = `${recipeName} ${recipeDescription} ${recipeIngredients}`

        // Vérifier si le texte de recherche est présent dans la chaîne combinée
        if (combinedText.includes(lowerCaseSearchText)) {
            filteredNewRecipes.push(recipe)
        }
    })

    filteredRecipes = filteredNewRecipes
}

function filterRecipesByIngredients() {

    const filteredNewRecipes = []

    filteredRecipes.forEach(recipe => {
        const hasIngredients = [...selectedIngredients].every(selectedIngredient =>
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === selectedIngredient.toLowerCase())
        )
        if (hasIngredients) {
            filteredNewRecipes.push(recipe)
        }
    })

    filteredRecipes = filteredNewRecipes
}

// function filterRecipesByAppliances() {
//     const filteredNewRecipes = []

//     filteredRecipes.forEach(recipe => {
//         if (selectedAppliances.has(recipe.appliance.toLowerCase())) {
//             filteredNewRecipes.push(recipe)
//         }
//     })

//     filteredRecipes = filteredNewRecipes
// }

document.querySelector('.drop-btn').addEventListener('click', function () {
    const dropdownContent = document.querySelector('.dropdown-content')
    dropdownContent.classList.toggle('show')
})

// Pour les appareils
// document.querySelector('.drop-btn2').addEventListener('click', function () {
//     const dropdownContent = document.querySelector('.appliance-dropdown-content')
//     dropdownContent.classList.toggle('show')
// })

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
            // Je relancer la recherche combinée (texte + ingrédients)
            filterRecipesCombined()
        })

        tag.appendChild(removeButton)
        selectedIngredientsWrapper.appendChild(tag)
    })
}

// function updateSelectedApplianceTags() {
//     const selectedAppliancesWrapper = document.querySelector('.selected-appliances')
//     selectedAppliancesWrapper.innerHTML = ''

//     selectedAppliances.forEach(appliance => {
//         const tag = document.createElement('div')
//         tag.textContent = appliance
//         tag.className = 'appliance-tag'

//         const removeButton = document.createElement('a')
//         removeButton.className = 'remove-tag'

//         const icon = document.createElement('i')
//         icon.className = 'fa-solid fa-xmark'
//         icon.setAttribute('aria-hidden', 'true')
//         removeButton.appendChild(icon)

//         removeButton.addEventListener('click', function () {
//             selectedAppliances.delete(appliance)
//             // Relancer la recherche combinée (texte + ingrédients + appareils)
//             filterRecipesCombined()
//         })

//         tag.appendChild(removeButton)
//         selectedAppliancesWrapper.appendChild(tag)
//     })
// }

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
            filterRecipesCombined()
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

// function populateApplianceDropdown(recipes) {
//     console.log("populateApplianceDropdown a été appelée")

//     const dropdownContent = document.querySelector('.appliance-dropdown-content2')
//     dropdownContent.innerHTML = ''

//     const appliancesSet = new Set(
//         recipes
//             .map(recipe => recipe.appliance)
//             .filter(appliance => appliance) // Filtre les valeurs nulles ou indéfinies
//     )

//     console.log("Ensemble des appareils extraits des recettes :", appliancesSet)

//     appliancesSet.forEach(appliance => {
//         console.log("Ajout de l'appareil :", appliance)

//         const applianceLink = document.createElement('a')
//         applianceLink.href = '#'
//         applianceLink.textContent = appliance
//         applianceLink.addEventListener('click', function (e) {
//             e.preventDefault()
//             const lowerCaseAppliance = appliance.toLowerCase()
//             if (selectedAppliances.has(lowerCaseAppliance)) {
//                 selectedAppliances.delete(lowerCaseAppliance)
//                 applianceLink.classList.remove('selected')
//                 console.log("Appareil supprimé :", appliance)
//             } else {
//                 selectedAppliances.add(lowerCaseAppliance)
//                 applianceLink.classList.add('selected')
//                 console.log("Appareil sélectionné :", appliance)
//             }
//             filterRecipesCombined()
//         })
//         dropdownContent.appendChild(applianceLink)
//     })
// }

function filterRecipesCombined() {
    // Je dois appeler à la recherche par mot clés
    filterRecipes()
    // Je fais appel a la recherche par tags
    filterRecipesByIngredients()
    // Filtrer par appareils
    // filterRecipesByAppliances()
    // Mettre à jour les tags d'ingrédients sélectionnés
    updateSelectedIngredientTags()
    // Mettre à jour les tags d'appareils sélectionnés
    // updateSelectedApplianceTags()
    // Le resultat doit etre afficher
    displayRecipes(filteredRecipes)
    // Mettre a jours le nombre de recette
    updateSearchResultsCount(filteredRecipes.length)
    // Mettre a jours le dropdown des ingredients
    populateDropdown(filteredRecipes)
    // Mettre a jours le dropdown des appareils
    // populateApplianceDropdown(filteredRecipes)
}

function init() {
    displayRecipes(recipes)
    updateSearchResultsCount(recipes.length)
    populateDropdown(recipes)
    // populateApplianceDropdown(recipes)
    updateSelectedIngredientTags()
}

init()