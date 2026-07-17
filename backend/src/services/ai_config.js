const image_vision_config = {
    prompt: `Analyze this image. Return a single JSON object with 'title', 'caption', and 'tags'.

        INSTRUCTIONS FOR IDENTIFICATION (CHARACTERS, ARCHITECTURE, OBJECTS & EVENTS):
        1. READ TEXT: Look for any readable text, titles, quotes, signs, or logos in the image. Use them as primary clues to identify the franchise, location, event, or character.
        2. CULTURAL & ARCHITECTURAL ACCURACY: Identify specific architectural structures, cultural landmarks, and traditional objects accurately (e.g., use 'torii gate' or 'shrine gate' instead of generic 'gate', 'pagoda', 'shrine', 'katana', 'sakura', 'stained glass', etc.).
        3. CHARACTER & MEDIA IDENTIFICATION: Identify fictional characters, celebrities, or well-known figures by distinct clothing, signature items, and art style.
        4. EVENTS & SCENE CONTEXT: Recognize underlying scenes or events (e.g., 'festival', 'concert', 'battle', 'sunset', 'fireworks', 'rainy day').
        5. STRICT ACCURACY RULE: ONLY use specific named entities (characters, specific shrines, exact franchises) if highly confident. If uncertain, use accurate descriptive terms for the architecture, object, media type, and visual traits (e.g., 'torii gate', 'japanese shrine', 'anime scenery', 'blue sky').

        OUTPUT REQUIREMENTS:
        - 'title': A short, creative, and specific artwork title (e.g., 'Torii Gate in the Blue Sky', 'Furina Lockscreen').
        - 'tags': Provide an array of at least 8 lowercase, specific tags or short phrases (e.g., ['torii gate', 'shrine', 'anime scenery', 'blue sky', 'water reflection']).
        - 'caption': A short, super casual gallery post (under 30 words) in first-person ('I', 'my') from the uploader. Keep it chill, funny, and human. NEVER use third-person robot language.

        Example format: { "title": "Artwork Title", "caption": "my fave anime-style sky with a torii gate!", "tags": ["torii gate", "shrine", "blue sky"] }` +

        "CRITICAL: Output ONLY valid raw JSON. Do NOT wrap the JSON in markdown code blocks like ```json." +
        `Analyze the uploaded image and extract visual metadata into a strict JSON object. 
        Include:
        - surface_type (e.g. glossy, matte, water reflection, metallic, textured paper)
        - color_medium (e.g. digital illustration, watercolor, oil painting, 3D render)
        - artistic_style (e.g. anime, realism, pixel art, minimalist)` +
        `You are an image metadata generator for an art gallery. Analyze the image and return JSON containing 'title', 'description', and 'tags'.

        RULES FOR TITLES & DESCRIPTIONS:
        1. Do NOT use words like "Glitch", "Cyberpunk", or "Vaporwave" based solely on lens flares, chromatic aberration, or light beams.
        2. Lens flares and RGB edge fringes are CINEMATIC LIGHTING EFFECTS, not digital errors.
        3. Focus titles and descriptions on:
        - Character expression, eyes, hair, or mood.
        - Elements present (e.g. frost, ice shards, glowing stars, starlight).
        - Character name/franchise if recognized (e.g. Sanhua from Wuthering Waves).`,

    temperature: 0.4,
    model: "qwen/qwen3.6-27b",
    content_type: "image_url",
    max_completion_tokens: 1024,
    reasoning_effort: "none",
}

module.exports = { image_vision_config }