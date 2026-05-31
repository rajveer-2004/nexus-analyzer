export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { states, summary } = req.body;

  if (!states || !summary) {
    return res.status(400).json({ error: 'Missing states or summary in request body' });
  }

  const prompt = `You are a sales tax compliance expert at Zamp. A company has shared their transaction data across US states.

Write a concise plain-English risk brief that:
1. Names the top 2-3 highest-risk states by name with their specific dollar amounts
2. States the total revenue exposed ($${summary.totalRevenue?.toLocaleString()})
3. Flags which states are approaching nexus and need monitoring
4. Ends with one specific, actionable recommendation

Transaction data:
${states.map(s => `${s.state}: $${s.revenue?.toLocaleString()} revenue, ${s.transactions} transactions, nexus=${s.nexus}, ${s.revPct}% of revenue threshold`).join('\n')}

States with nexus triggered: ${summary.nexusStates?.join(', ') || 'none'}
States approaching nexus: ${summary.approachingStates?.join(', ') || 'none'}
Total revenue at risk: $${summary.nexusRevenue?.toLocaleString()}

Write in direct, plain English. No bullet points. No headers. No markdown.

IMPORTANT: You must write exactly 6 sentences. Count them before responding.
If you have fewer than 6 sentences, add more specific analysis from the data.
Sentence 4 MUST name the approaching states by name with exact dollar gaps.
Sentence 5 MUST name the highest revenue state and say "register here first".
Sentence 6 MUST mention Zamp by name and what it automates.
Do not end with generic advice like "implement a robust system".`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return res.status(502).json({ error: 'AI service unavailable. Please try again.' });
    }

    const data = await response.json();

    // Check for Gemini safety blocks
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      console.error('Gemini safety block:', data);
      return res.status(500).json({ error: 'Response blocked by safety filter' });
    }

    const brief = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!brief) {
      console.error('No brief in Gemini response:', JSON.stringify(data));
      return res.status(500).json({ error: 'No response generated' });
    }

    return res.status(200).json({ brief });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
