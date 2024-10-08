export function createRecipeCard(recipe) {
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
        description.className = ('card-description')
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