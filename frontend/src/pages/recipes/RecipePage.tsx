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
      <main className="container recipeLayout">
        <h1 className="h2">Recipe</h1>
        <p className="subhead">{error}</p>
        <Link className="btn" to="/recipes">Back to Recipes</Link>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="container recipeLayout">
        <p className="subhead">Loading…</p>
      </main>
    );
  }

  const heroImg = recipe.imageUrl;

  return (
    <main className="container recipeLayout">
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 className="h2" style={{ margin: 0 }}>{recipe.title}</h1>
          <p className="subhead" style={{ marginTop: 8 }}>
            <Link to="/recipes" className="authLink">← Back to recipes</Link>
          </p>
        </div>

        <Link className="btn" to={`/recipes/${recipe.id}/edit`}>
          Edit
        </Link>
      </header>

      {heroImg ? (
        <img className="recipeHeroImage" src={heroImg} alt={recipe.title} />
      ) : null}

      <section className="recipeGrid">
        <div className="recipeCard">
          <h2 className="h2" style={{ marginTop: 0 }}>Ingredients</h2>
          <ul className="recipeList subhead">
            {recipe.ingredients?.length
              ? recipe.ingredients.map((x, i) => <li key={i}>{x}</li>)
              : <li>(none yet)</li>}
          </ul>
        </div>

        <div className="recipeCard">
          <h2 className="h2" style={{ marginTop: 0 }}>Steps</h2>
          <ol className="recipeList subhead">
            {recipe.steps?.length
              ? recipe.steps.map((x, i) => <li key={i}>{x}</li>)
              : <li>(none yet)</li>}
          </ol>
        </div>
      </section>
    </main>
  );
}
