import React from "react";
import IngredientsList from "./components/IngredientsList";
import ClaudeRecipe from "./components/ClaudeRecipe";
import { getRecipeFromMistral } from "./ai";

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState(""); // State for error messages

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromMistral(ingredients);
        console.log(recipeMarkdown);
        setRecipe(recipeMarkdown);
    }

    function addIngredient(event) {
        event.preventDefault();
        const newIngredient = event.target.elements.ingredient.value.trim();

        if (!newIngredient) {
            setErrorMessage("Ingredient field is required.");
            return;
        }
        if (ingredients.some((ingredient) => ingredient.toLowerCase() === newIngredient.toLowerCase())) {
            setErrorMessage("This ingredient is already on the list.");
            return;
        }

        setIngredients([...ingredients, newIngredient]);
        setErrorMessage(""); 
        event.target.elements.ingredient.value = "";
    }

    return (
        <main>
            <form onSubmit={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {/* Display error message if any */}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            }

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    );
}
