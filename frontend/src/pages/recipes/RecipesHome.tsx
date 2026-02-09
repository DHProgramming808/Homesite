import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFeaturedRecipes, type Recipe } from "../../api/recipes-api";
import "../../styles/Recipes.css";

function FeaturedRecipeCard({ recipe }: { recipe: Recipe }) {
  const bg = recipe.imageUrl || recipeHeroImage(recipe) || "/images/projects/portfolio.jpg";
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="recipesRailCard"
      style={{ ["--card-bg" as any]: `url("${bg}")` }}
      aria-label={recipe.title}
    >
      <div className="recipesRailOverlay" />
      <h3 className="recipesRailTitle">{recipe.title}</h3>
    </Link>
  );
}


// TODO add images to recipes and show them in the list, and on the recipe page. maybe also add a "featured" flag to recipes so i can handpick which ones to show on the home page? also add a "description" field to recipes so i can show a little teaser text on the home page and in the recipe list. also add a "tags" field to recipes so i can do better searching and categorization. basically just make the whole thing nicer and more usable :)
// TEMP for now, the home page just shows placeholder images of recipe ids and you have to click through to see the recipe content. but it’s a start!
function recipeHeroImage(recipe: Recipe) {
  return `/images/recipes/placeholders/${recipe.id}.jpg`;
}




export default function RecipesHome() {
  const [featured, setFeatured] = useState<Recipe[]>([]);
  const [id, setId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const railRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    getFeaturedRecipes(6)
      .then((r) => { if (alive) setFeatured(r); })
      .catch((e) => { console.error(e); if (alive) setError("Could not load featured recipes."); });
    return () => { alive = false; };
  }, []);

  const scrollRail = (dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const amount = Math.min(520, el.clientWidth * 0.85);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim();
    if (!trimmed) return;
    navigate(`/recipes/${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="container recipesPage">
      <header>
        <h1 className="h1">Recipes</h1>
        <p className="subhead" style={{ marginTop: 12, maxWidth: "70ch" }}>
          A small collection of dishes I like enough to write down.
        </p>
      </header>

      {/* Featured rail */}
      <section className="recipesHero">
        <div className="recipesHeroHeader">
          <div>
            <h2 className="h2" style={{ margin: 0 }}>Featured</h2>
            <p className="subhead" style={{ marginTop: 8 }}>Scroll or use arrows.</p>
          </div>

          <div className="recipesHeroNav">
            <button className="recipesNavBtn" type="button" onClick={() => scrollRail("left")} aria-label="Scroll left">
              ←
            </button>
            <button className="recipesNavBtn" type="button" onClick={() => scrollRail("right")} aria-label="Scroll right">
              →
            </button>
          </div>
        </div>

        <div className="recipesRailScroller">
          <div ref={railRef} className="recipesRail" aria-label="Featured recipes carousel">
            {featured.map((r) => (
              <FeaturedRecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </div>

        {error ? <p className="subhead" style={{ marginTop: 10 }}>{error}</p> : null}
      </section>

      {/* Search by ID */}
      <section className="recipesSearch">
        <h2 className="h2" style={{ margin: 0 }}>Find a recipe</h2>
        <p className="subhead" style={{ marginTop: 8 }}>
          For now: search by recipe id (we’ll add name/tag search later).
        </p>

        <form className="recipesSearchRow" onSubmit={onSearch}>
          <input
            className="recipesInput"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter recipe id…"
          />
          <button className="btn btnPrimary" type="submit">
            Search
          </button>
        </form>
      </section>

      {/* Upload / create blurb */}
      <section className="recipesUploadBlurb">
        <div>
          <h3 style={{ margin: 0, letterSpacing: "-0.01em" }}>Have a recipe to share?</h3>
          <p className="subhead" style={{ marginTop: 8, maxWidth: "70ch" }}>
            Upload a new recipe (ingredients + steps + image). Editing and richer search are coming.
          </p>
        </div>

        <Link className="btn btnPrimary" to="/recipes/new">
          Create recipe
        </Link>
      </section>
    </main>
  );
}
