export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: 'AI_NOT_CONFIGURED',
      message: 'OPENAI_API_KEY is not configured in Netlify environment variables.'
    }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    if (!body.image || !body.prompt) {
      return new Response(JSON.stringify({ error: 'Image and prompt are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1.5',
        images: [{ image_url: body.image }],
        prompt: body.prompt,
        size: '1024x1024',
        quality: 'low',
        output_format: 'png'
      })
    });

    const result = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: 'AI_GENERATION_FAILED',
        message: result?.error?.message || 'The image generation request failed.'
      }), { status: response.status, headers: { 'Content-Type': 'application/json' } });
    }

    const base64 = result?.data?.[0]?.b64_json;
    if (!base64) throw new Error('No generated image was returned.');

    return new Response(JSON.stringify({ image: `data:image/png;base64,${base64}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'SERVER_ERROR',
      message: error instanceof Error ? error.message : 'Unexpected server error.'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
