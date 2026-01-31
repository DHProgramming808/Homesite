export default function AboutMe() {
return (
    <main style={{ padding: 24 }}>
      <h1>Image test</h1>

      <p>If this shows, your public path is correct:</p>

      <img
        src="/Homesite_homepage_background.png"
        alt="Hero test"
        style={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 16,
          display: "block",
          border: "1px solid rgba(255,255,255,.12)",
        }}
        onLoad={() => console.log("✅ image loaded")}
        onError={() => console.log("❌ image failed to load")}
      />

      <p style={{ marginTop: 12, opacity: 0.7 }}>
        Path used: <code>/Homesite_homepage_background.png</code>
      </p>
    </main>
  );
}
