import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createRecipe, getRecipeById, updateRecipe, type Recipe } from "../../api/recipes-api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Recipes.css";

type Props = { mode: "create" | "edit" };

type RecipeFormState = {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  featured?: boolean;
  imageUrl?: string;
}

const MAX_ITEMS = 20;

const EMPTY: Partial<Recipe> = {
  title: "",
  imageUrl: "",
  ingredients: [],
  steps: [],
};

const emptyForm: RecipeFormState = {
  title: "",
  description: "",
  ingredients: [""],
  steps: [""],
  featured: false,
  imageUrl: "",
};

function clampList(list: string[]) {
  const cleaned = list.map(s => s ?? "");
  return cleaned.length ? cleaned.slice(0, MAX_ITEMS): [""];
}

function toForm(recipe: Recipe): RecipeFormState {
  return {
    title: recipe.title ?? "",
    description: recipe.description ?? "",
    ingredients: clampList(recipe.ingredients ?? []),
    steps: clampList(recipe.steps ?? []),
    featured: recipe.featured ?? false,
    imageUrl: recipe.imageUrl ?? "",
  };
}


function validateRecipeJson(obj: any) {
  if (!obj || typeof obj !== "object") return "JSON must be an object.";
  if (!obj.title || typeof obj.title !== "string") return "title is required.";
  if (!obj.description || typeof obj.description !== "string") return "description is required.";
  if (!Array.isArray(obj.ingredients)) return "ingredients must be an array of strings.";
  if (!Array.isArray(obj.steps)) return "steps must be an array of strings.";
  return null;
}

function validate(form: RecipeFormState): string | null {
  if (!form.title.trim()) return "Title is required.";
  if (!form.description.trim()) return "Description is required.";

  const ingredients = form.ingredients.map(i => i.trim()).filter(i => i);
  const steps = form.steps.map(s => s.trim()).filter(s => s);
  if (ingredients.length === 0) return "Add at least one ingredient";
  if (steps.length === 0) return "Add at least one step";
  if (ingredients.some(i => i.length > MAX_ITEMS)) return `Ingredients must be less than ${MAX_ITEMS} characters`;
  if (steps.some(s => s.length > MAX_ITEMS)) return `Steps must be less than ${MAX_ITEMS} characters`;
  return null;
}


export default function RecipeEditor({ mode }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { username } = useAuth();
  const isAuthed = Boolean(username);

  const [form, setForm] = useState<RecipeFormState>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const title = mode === "create" ? "Create recipe" : "Update recipe";

    // Load existing recipe
  useEffect(() => {
    if (mode !== "edit") return;
    if (!id) return;

    let alive = true;
    setLoading(true);

    getRecipeById(id)
      .then((r) => {
        if (!alive) return;
        if (!r) {
          setError("Recipe not found.");
          return;
        }
        setForm(toForm(r));
      })
      .catch((e) => {
        console.error(e);
        if (alive) setError("Could not load recipe for editing.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => { alive = false; };
  }, [mode, id]);

  const canSubmit = useMemo(() => {
    if (!isAuthed) return false;
    if (loading) return false;
    return !validate(form);
  }, [isAuthed, loading, form]);

  const setIngredient = (idx: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.ingredients];
      next[idx] = value;
      return { ...prev, ingredients: next };
    });
  };

  const addIngredient = () => {
    setForm((prev) => {
      if (prev.ingredients.length >= MAX_ITEMS) return prev;
      return { ...prev, ingredients: [...prev.ingredients, ""] };
    });
  };

  const removeIngredient = (idx: number) => {
    setForm((prev) => {
      const next = prev.ingredients.filter((_, i) => i !== idx);
      return { ...prev, ingredients: next.length ? next : [""] };
    });
  };

  const setStep = (idx: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.steps];
      next[idx] = value;
      return { ...prev, steps: next };
    });
  };

  const addStep = () => {
    setForm((prev) => {
      if (prev.steps.length >= MAX_ITEMS) return prev;
      return { ...prev, steps: [...prev.steps, ""] };
    });
  };

  const removeStep = (idx: number) => {
    setForm((prev) => {
      const next = prev.steps.filter((_, i) => i !== idx);
      return { ...prev, steps: next.length ? next : [""] };
    });
  };

  const onSubmit = async () => {
    setError(null);

    if (!isAuthed) {
      setError("Please log in to create or update recipes.");
      return;
    }

    const msg = validate(form);
    if (msg) {
      setError(msg);
      return;
    }

    // Normalize lists (trim + remove blanks)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl?.trim() || undefined,
      featured: form.featured,
      ingredients: form.ingredients.map(s => s.trim()).filter(Boolean),
      steps: form.steps.map(s => s.trim()).filter(Boolean),
    };

    setSaving(true);
    try {
      if (mode === "create") {
        const created = await createRecipe(payload);
        navigate(created?.id ? `/recipes/${created.id}` : "/recipes");
      } else {
        if (!id) throw new Error("Missing recipe id");
        await updateRecipe(id, payload);
        navigate(`/recipes/${id}`);
      }
    } catch (e) {
      console.error(e);
      setError("Save failed. Check console + backend logs.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthed) {
    return (
      <main className="recipesTheme">
        <div className="recipesTopShade" aria-hidden="true" />
        <div className="container recipesPage">
          <div className="recipeCard">
            <h1 className="h2" style={{ marginTop: 0 }}>Login required</h1>
            <p className="subhead">
              You need to be logged in to create or update recipes.
            </p>
            <Link className="btn btnPrimary" to="/login">Go to Login</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="recipesTheme">
      <div className="recipesTopShade" aria-hidden="true" />
      <div className="container recipesPage">
        <header className="recipesEditorHeader">
          <div>
            <h1 className="h2" style={{ margin: 0 }}>{title}</h1>
            <p className="subhead" style={{ marginTop: 10, maxWidth: "70ch" }}>
              Keep it simple for now. Later we’ll add image upload to S3 + nicer step-by-step tools.
            </p>
          </div>

          <div className="recipesEditorHeaderActions">
            <Link className="btn" to="/recipes">Back</Link>
            <button className="btn btnPrimary" type="button" onClick={onSubmit} disabled={!canSubmit || saving}>
              {saving ? "Saving..." : "Submit"}
            </button>
          </div>
        </header>

        {error ? (
          <div className="recipeCard" style={{ marginTop: 14 }}>
            <p className="subhead" style={{ color: "rgba(160, 40, 40, .95)" }}>{error}</p>
          </div>
        ) : null}

        {loading ? (
          <div className="recipeCard" style={{ marginTop: 14 }}>
            <p className="subhead">Loading recipe…</p>
          </div>
        ) : null}

        {/* Basics */}
        <section className="recipesEditorGrid">
          <div className="recipeCard">
            <h2 className="recipesSectionTitle" style={{ marginTop: 0 }}>Basics</h2>

            <label className="recipesField">
              <span className="recipesLabel">Title</span>
              <input
                className="recipesInput"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Spicy Garlic Noodles"
              />
            </label>

            <label className="recipesField">
              <span className="recipesLabel">Description</span>
              <textarea
                className="recipesTextarea"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="A fast, punchy weeknight noodle situation…"
              />
            </label>

            <label className="recipesField">
              <span className="recipesLabel">Image URL (temporary)</span>
              <input
                className="recipesInput"
                value={form.imageUrl}
                onChange={(e) => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://… or leave blank"
              />
              <span className="recipesHelp">
                (Later: upload image → S3 → we store the URL)
              </span>
            </label>

            <label className="recipesCheckboxRow">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
              />
              <span>Featured</span>
            </label>
          </div>

          {/* Ingredients */}
          <div className="recipeCard">
            <div className="recipesCardHeaderRow">
              <h2 className="recipesSectionTitle" style={{ margin: 0 }}>Ingredients</h2>
              <button type="button" className="btn" onClick={addIngredient} disabled={form.ingredients.length >= MAX_ITEMS}>
                + Add
              </button>
            </div>

            <div className="recipesList">
              {form.ingredients.map((val, idx) => (
                <div className="recipesListRow" key={`ing-${idx}`}>
                  <input
                    className="recipesInput"
                    value={val}
                    onChange={(e) => setIngredient(idx, e.target.value)}
                    placeholder={`Ingredient ${idx + 1}`}
                  />
                  <button type="button" className="recipesIconBtn" onClick={() => removeIngredient(idx)} aria-label="Remove ingredient">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="recipesCountHint">
              {form.ingredients.map(s => s.trim()).filter(Boolean).length} / {MAX_ITEMS}
            </div>
          </div>

          {/* Steps */}
          <div className="recipeCard" style={{ gridColumn: "1 / -1" }}>
            <div className="recipesCardHeaderRow">
              <h2 className="recipesSectionTitle" style={{ margin: 0 }}>Steps</h2>
              <button type="button" className="btn" onClick={addStep} disabled={form.steps.length >= MAX_ITEMS}>
                + Add
              </button>
            </div>

            <div className="recipesList">
              {form.steps.map((val, idx) => (
                <div className="recipesStepRow" key={`step-${idx}`}>
                  <div className="recipesStepNumber">{idx + 1}</div>
                  <textarea
                    className="recipesTextarea recipesStepTextarea"
                    value={val}
                    onChange={(e) => setStep(idx, e.target.value)}
                    placeholder={`Step ${idx + 1}`}
                  />
                  <button type="button" className="recipesIconBtn" onClick={() => removeStep(idx)} aria-label="Remove step">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="recipesCountHint">
              {form.steps.map(s => s.trim()).filter(Boolean).length} / {MAX_ITEMS}
            </div>
          </div>

          {/* Image upload stub */}
          <div className="recipeCard" style={{ gridColumn: "1 / -1" }}>
            <h2 className="recipesSectionTitle" style={{ marginTop: 0 }}>Image Upload (stub)</h2>
            <p className="subhead" style={{ marginTop: 8 }}>
              This will become: choose file → upload to S3 → save returned URL into <code>imageUrl</code>.
            </p>
            <div className="recipesUploadStub">
              <input type="file" disabled />
              <button className="btn" type="button" disabled>
                Upload (coming soon)
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
