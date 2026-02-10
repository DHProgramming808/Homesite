import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createRecipe, getRecipeById, updateRecipe, type Recipe } from "../../api/recipes-api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Recipes.css";

type Props = { mode: "create" | "edit" };

const EMPTY: Partial<Recipe> = {
  title: "",
  imageUrl: "",
  ingredients: [],
  steps: [],
};


function validateRecipeJson(obj: any) {
  if (!obj || typeof obj !== "object") return "JSON must be an object.";
  if (!obj.title || typeof obj.title !== "string") return "title is required.";
  if (!obj.description || typeof obj.description !== "string") return "description is required.";
  if (!Array.isArray(obj.ingredients)) return "ingredients must be an array of strings.";
  if (!Array.isArray(obj.steps)) return "steps must be an array of strings.";
  return null;
}


export default function RecipeEditor({ mode }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { username } = useAuth();
  const isAuthed = Boolean(username);

  const [draft, setDraft] = useState<Partial<Recipe>>(EMPTY);
  const [rawJson, setRawJson] = useState<string>(JSON.stringify(EMPTY, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const title = mode === "create" ? "Create recipe" : "Update recipe";

  // Load existing recipe when editing
  useEffect(() => {
    if (mode !== "edit") return;
    if (!id) return;

    let alive = true;
    getRecipeById(id)
      .then((r) => {
        if (!alive) return;

        if (!r) {
          setError("Recipe not found.");
          return;
        }

        setDraft(r);
        setRawJson(JSON.stringify(r, null, 2));
      })
      .catch((e) => {
        console.error(e);
        if (alive) setError("Could not load recipe for editing.");
      });

    return () => { alive = false; };
  }, [mode, id]);

  const parsed = useMemo(() => {
    try {
      return JSON.parse(rawJson);
    } catch {
      return null;
    }
  }, [rawJson]);

  const canSubmit = isAuthed && parsed;

  const onSubmit = async () => {
    setError(null);
    if (!parsed) {
      setError("JSON is invalid. Fix it before submitting.");
      return;
    }
    if (!isAuthed) {
      setError("Please log in to create or update recipes.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        const created = await createRecipe(parsed);
        const createdId = created.id;
        navigate(createdId ? `/recipes/${createdId}` : "/recipes");
      } else {
        if (!id) throw new Error("Missing recipe id");
        await updateRecipe(id, parsed);
        navigate(`/recipes/${id}`);
      }
    } catch (e) {
      console.error(e);
      setError("Save failed. Check the console + backend logs.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container recipeLayout">
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 className="h2" style={{ margin: 0 }}>{title}</h1>
          <p className="subhead" style={{ marginTop: 8 }}>
            Format: a JSON document with <code>title</code>, <code>imageUrl</code>,{" "}
            <code>thumbnailUrl</code>, <code>ingredients[]</code>, <code>steps[]</code>.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn" to="/recipes">Back</Link>
          <button className="btn btnPrimary" type="button" onClick={onSubmit} disabled={!canSubmit || saving}>
            {saving ? "Saving..." : "Submit"}
          </button>
        </div>
      </header>

      {!isAuthed ? (
        <div className="recipeCard" style={{ marginTop: 14 }}>
          <h2 className="h2" style={{ marginTop: 0 }}>Login required</h2>
          <p className="subhead">
            You need to be logged in to create or update recipes.
          </p>
          <Link className="btn btnPrimary" to="/login">Go to Login</Link>
        </div>
      ) : null}

      {error ? (
        <div className="recipeCard" style={{ marginTop: 14 }}>
          <p className="subhead">{error}</p>
        </div>
      ) : null}

      {/* Minimal editor: raw JSON */}
      <section className="recipeCard" style={{ marginTop: 14, opacity: isAuthed ? 1 : 0.6 }}>
        <h2 className="h2" style={{ marginTop: 0 }}>Recipe JSON</h2>
        <p className="subhead" style={{ marginTop: 8 }}>
          Keep it simple for now — later we can add a nice form UI + validations.
        </p>

        <textarea
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          disabled={!isAuthed}
          style={{
            width: "100%",
            minHeight: 360,
            resize: "vertical",
            marginTop: 12,
            borderRadius: 14,
            padding: 12,
            color: "rgba(255,255,255,.92)",
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.12)",
            outline: "none",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        />

        {!parsed ? (
          <p className="subhead" style={{ marginTop: 10, color: "rgba(255,120,120,.9)" }}>
            JSON is invalid — fix syntax to enable Submit.
          </p>
        ) : null}
      </section>
    </main>
  );
}
