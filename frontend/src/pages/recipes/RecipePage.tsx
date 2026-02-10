import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRecipeById, type Recipe } from "../../api/recipes-api";
import "../../styles/Recipes.css";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;

    getRecipeById(id)
      .then((r) => { if (alive) setRecipe(r); })
      .catch((e) => { console.error(e); if (alive) setError("Recipe not found."); });

    return () => { alive = false; };
  }, [id]);

  if (error) {
    return (
      <main className="recipesTheme">
        <div className="container recipeLayout">
          <h1 className="h2">Recipe</h1>
          <p className="subhead">{error}</p>
          <Link className="btn" to="/recipes">Back to Recipes</Link>
        </div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="recipesTheme">
        <div className="container recipeLayout">
          <p className="subhead">Loading…</p>
        </div>
      </main>
    );
  }

  const heroImg = recipe.imageUrl;

  return (
    <main className="recipesTheme">
      <div className="recipesTopShade" aria-hidden="true">

        <div className="container recipeDetailPage">
          <header className="recipeHeader">
            <div>
              <h1 className="recipeTitle">{recipe.title}</h1>
              <p className="recipeMeta">
                By <span className="recipeAuthor">{recipe.createdByUserId ?? "Unknown"}</span>
              </p>
            </div>
          </header>

          {recipe.imageUrl ? (
            <div className="recipeHeroWrap">
              <img className="recipeHeroImage" src={recipe.imageUrl} alt={recipe.title} />
            </div>
          ) : null}

          <section className="recipeTwoCol">
            <aside className="recipeIngredients">
              <h2 className="recipeSectionTitle">Ingredients</h2>
              <ul className="recipeList">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </aside>

            <article className="recipeSteps">
              <h2 className="recipeSectionTitle">Directions</h2>
              <ol className="recipeStepsList">
                {recipe.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </article>
          </section>
        </div>

      </div>
    </main>
  );
}
