import { recipes } from "./data/recipes.js"
import { createRecipeCard } from "./template.js"
import { toggleRotate } from "./utilities.js"

window.toggleRotate = toggleRotate
let filteredRecipes = recipes
const searchField = document.getElementById('search-input')
const selectedIngredients = new Set()
const selectedAppliances = new Set()
const selectedUstensils = new Set()

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

// Construit le tableau des recettes qui répondent au texte saisi.
function filterRecipes() {
    const searchText = searchField.value.trim()
    console.log("Texte de recherche :", searchText)

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

// Filtre les recettes en fonction des ingrédients sélectionnés.
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

// Filtre les recettes en fonction des appareils sélectionnés.
function filterRecipesByAppliances() {
    console.log(selectedAppliances.size)
    if (selectedAppliances.size === 0) {
        return
    }

    const filteredNewRecipes = []
    console.log("Filtrage des recettes par appareils")

    filteredRecipes.forEach(recipe => {
        if (selectedAppliances.has(recipe.appliance.toLowerCase())) {
            filteredNewRecipes.push(recipe)
        }
    })

    filteredRecipes = filteredNewRecipes
}

// Filtre les recettes en fonction des ustensiles sélectionnés.
function filterRecipesByUstensils() {
    if (selectedUstensils.size === 0) {
        return
    }

    const filteredNewRecipes = []

    filteredRecipes.forEach(recipe => {
        // Assurez-vous que recipe.ustensils est un tableau
        const recipeUstensils = Array.isArray(recipe.ustensils) ? recipe.ustensils : []
        
        // Vérifiez si tous les ustensiles sélectionnés sont présents dans recipe.ustensils
        const hasAllUstensils = [...selectedUstensils].every(selectedUstensil =>
            recipeUstensils.map(ustensil => ustensil.toLowerCase()).includes(selectedUstensil.toLowerCase())
        )

        if (hasAllUstensils) {
            filteredNewRecipes.push(recipe)
        }
    })

    filteredRecipes = filteredNewRecipes
}

document.querySelector('.drop-btn').addEventListener('click', function () {
    const dropdownContent = document.querySelector('.dropdown-content')
    dropdownContent.classList.toggle('show')
})

// Pour les appareils
document.querySelector('.drop-btn2').addEventListener('click', function () {
    const dropdownContent = document.querySelector('.appliance-dropdown-content')
    dropdownContent.classList.toggle('show')
})

// Pour les ustensiles
document.querySelector('.drop-btn3').addEventListener('click', function () {
    const dropdownContent = document.querySelector('.ustensils-dropdown-content')
    dropdownContent.classList.toggle('show')
})

// Met à jour l'affichage des tags d'ingrédients sélectionnés.
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
            console.log("Ingrédient supprimé :", ingredient)
            // Relance la recherche combinée (texte + ingrédients)
            filterRecipesCombined()
        })

        tag.appendChild(removeButton)
        selectedIngredientsWrapper.appendChild(tag)
    })
}

// Met à jour l'affichage des tags d'appareils sélectionnés.
function updateSelectedApplianceTags() {
    const selectedAppliancesWrapper = document.querySelector('.selected-appliances')
    selectedAppliancesWrapper.innerHTML = ''

    selectedAppliances.forEach(appliance => {
        const tag = document.createElement('div')
        tag.textContent = appliance
        tag.className = 'appliance-tag'

        const removeButton = document.createElement('a')
        removeButton.className = 'remove-tag'

        const icon = document.createElement('i')
        icon.className = 'fa-solid fa-xmark'
        icon.setAttribute('aria-hidden', 'true')
        removeButton.appendChild(icon)

        removeButton.addEventListener('click', function () {
            selectedAppliances.delete(appliance)
            console.log("Appareil supprimé :", appliance)
            // Relance la recherche combinée (texte + ingrédients + appareils)
            filterRecipesCombined()
        })

        tag.appendChild(removeButton)
        selectedAppliancesWrapper.appendChild(tag)
    })
}

// Met à jour l'affichage des tags des ustensiles sélectionnés.
function updateSelectedUstensilsTags() {
    const selectedUstensilsWrapper = document.querySelector('.selected-ustensils')
    selectedUstensilsWrapper.innerHTML = ''

    selectedUstensils.forEach(ustensils => {
        const tag = document.createElement('div')
        tag.textContent = ustensils
        tag.className = 'ustensils-tag'

        const removeButton = document.createElement('a')
        removeButton.className = 'remove-tag'

        const icon = document.createElement('i')
        icon.className = 'fa-solid fa-xmark'
        icon.setAttribute('aria-hidden', 'true')
        removeButton.appendChild(icon)

        removeButton.addEventListener('click', function () {
            selectedUstensils.has(ustensils) // Vérifier si l'ustensile est dans la liste avant de le supprimer
                selectedUstensils.delete(ustensils)
                // console.log("Appareil supprimé :", ustensils)
                filterRecipesCombined()
        })

        tag.appendChild(removeButton)
        selectedUstensilsWrapper.appendChild(tag)
    })
}

// Remplit le dropdown avec les ingrédients extraits des recettes.
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
        // Verrifier si l'ingredient fait partie des tag selecitonné, si 
        // oui ajouter le background et la croix,
        // sinon afficher normalement 
        const ingredientLink = document.createElement('a')
        ingredientLink.href = '#'
        ingredientLink.textContent = ingredient
        
        // Vérifier si l'ingrédient est déjà sélectionné
        if (selectedIngredients.has(ingredient)) {
            ingredientLink.classList.add('selected')
        }

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

// Remplit le dropdown avec les appareils extraits des recettes.
function populateApplianceDropdown(recipes) {
    const dropdownContent = document.querySelector('.appliance-dropdown-content2')
    dropdownContent.innerHTML = ''

    const appliancesSet = new Set()

    recipes.forEach(recipe => {
        const appliance = recipe.appliance
        if (appliance) {
            appliancesSet.add(appliance)
        }
    })

    appliancesSet.forEach(appliance => {
        const applianceLink = document.createElement('a')
        applianceLink.href = '#'
        applianceLink.textContent = appliance
        
        // Vérifier si l'appareil est déjà sélectionné
        if (selectedAppliances.has(appliance.toLowerCase())) {
            applianceLink.classList.add('selected')
        }

        applianceLink.addEventListener('click', function (e) {
            e.preventDefault()
            const lowerCaseAppliance = appliance.toLowerCase()
            if (selectedAppliances.has(lowerCaseAppliance)) {
                selectedAppliances.delete(lowerCaseAppliance)
                applianceLink.classList.remove('selected')
            } else {
                selectedAppliances.add(lowerCaseAppliance)
                applianceLink.classList.add('selected')
            }
            filterRecipesCombined()
        })
        dropdownContent.appendChild(applianceLink)
    })
}

// Remplit le dropdown avec les ustensiles extraits des recettes.
function populateUstensilsDropdown(recipes) {
    const dropdownContent = document.querySelector('.ustensils-dropdown-content2')
    dropdownContent.innerHTML = ''

    const ustensilsSet = new Set()

    recipes.forEach(recipe => {
        if (recipe.ustensils) {
            recipe.ustensils.forEach(ustensil => {
                ustensilsSet.add(ustensil.toLowerCase()) // Ajouter chaque ustensile individuellement
            })
        }
    })

    ustensilsSet.forEach(ustensil => {
        const ustensilLink = document.createElement('a')
        ustensilLink.href = '#'
        ustensilLink.textContent = ustensil

        // Vérifier si l'ustensile est déjà sélectionné
        if (selectedUstensils.has(ustensil)) {
            ustensilLink.classList.add('selected')
        }

        ustensilLink.addEventListener('click', function (e) {
            e.preventDefault()
            if (selectedUstensils.has(ustensil)) {
                selectedUstensils.delete(ustensil)
                ustensilLink.classList.remove('selected')
            } else {
                selectedUstensils.add(ustensil)
                ustensilLink.classList.add('selected')
            }
            filterRecipesCombined()
        })
        dropdownContent.appendChild(ustensilLink)
    })
}

// Applique tous les filtres (texte, ingrédients, appareils, ustensiles) et met à jour l'affichage.
function filterRecipesCombined() {
    // Recherche par mot-clé
    filterRecipes()
    console.log("Filtered Recipes",filteredRecipes)
    // Recherche par ingrédients
    filterRecipesByIngredients()
    console.log("filteredRecipes by ingredient", filteredRecipes)
    // Filtrage par appareils
    filterRecipesByAppliances()
    console.log("filter Recipes By Appliances", filteredRecipes)
    // Filtrage par ustensiles
    filterRecipesByUstensils()
    // Mise à jour des tags d'ingrédients sélectionnés
    updateSelectedIngredientTags()
    // Mise à jour des tags d'appareils sélectionnés
    updateSelectedApplianceTags()
    // Mise à jour des tags des ustensiles sélectionnés
    updateSelectedUstensilsTags()
    // Affichage des recettes filtrées
    displayRecipes(filteredRecipes)
    // Mise à jour du nombre de recettes
    updateSearchResultsCount(filteredRecipes.length)
    // Mise à jour du dropdown des ingrédients
    populateDropdown(filteredRecipes)
    // Mise à jour du dropdown des appareils
    populateApplianceDropdown(filteredRecipes)
    // Mise à jour du dropdown des ustensils
    populateUstensilsDropdown(filteredRecipes)
}

// Initialisation de l'application
function init() {
    displayRecipes(recipes)
    updateSearchResultsCount(recipes.length)
    populateDropdown(recipes)
    populateApplianceDropdown(recipes)
    populateUstensilsDropdown(recipes)
    updateSelectedIngredientTags()
    updateSelectedApplianceTags()
    updateSelectedUstensilsTags()
}

init()