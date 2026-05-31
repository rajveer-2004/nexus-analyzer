import { Router } from 'express';

const router = Router();

router.post('/brief', async (req, res) => {
  try {
    const { states, summary } = req.body;
    
    if (!states || !summary) {
      return res.status(400).json({ error: "Missing required data: states and summary." });
    }

    const { totalRevenue, nexusCount, approachingCount, nexusStates, approachingStates } = summary;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_key_here' || apiKey.trim() === '' || apiKey === 'PASTE_NEW_KEY_HERE') {
      const mockBrief = `Zamp's nexus exposure scan reveals high risk. Your transaction volume has officially triggered sales tax nexus in ${nexusCount} state${nexusCount !== 1 ? 's' : ''} (including ${nexusStates.slice(0, 3).join(', ')}${nexusStates.length > 3 ? ' and others' : ''}), placing a total of $${totalRevenue.toLocaleString()} in revenue under state tax liability. Additionally, you are approaching economic thresholds in ${approachingCount} state${approachingCount !== 1 ? 's' : ''} (including ${approachingStates.slice(0, 3).join(', ')}). We recommend immediate registration in all triggered states to avoid retroactive penalties and interest. Talk to Zamp today to get registered, automate your calculations, and secure full compliance.`;
      
      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json({ brief: mockBrief });
    }

    const systemPrompt = `You are an elite US sales tax compliance expert at Zamp (zamp.ai). Your job is to analyze transaction data for a US business and write a highly professional, direct, and high-impact risk brief in exactly 3 to 4 sentences.
Tone: "Velocity is Survival" energy — direct, high-stakes, professional, and no fluff. Avoid generic filler text like "Based on the data you provided" or "Here is your report."
Instructions:
1. Direct attention to the top states where they have immediate risk (nexus triggered) or approaching risk.
2. Quantify the total exposure (number of states and total revenue exposed).
3. Warn them about the financial and regulatory risks of not filing (e.g., retroactive penalties, audit exposure).
4. Provide one clear action: book a demo with Zamp to register and automate compliance.`;

    const userPrompt = `Here is the economic sales tax nexus data:
Total States with Nexus Triggered: ${nexusCount} (${nexusStates.join(', ') || 'None'})
Total States Approaching Nexus (>=80% of threshold): ${approachingCount} (${approachingStates.join(', ') || 'None'})
Total Annual Revenue: $${totalRevenue.toLocaleString()}

State-by-State breakdown:
${states.map(s => `- ${s.state}: Revenue $${s.revenue.toLocaleString()}, Transactions ${s.transactions}, Nexus: ${s.nexus ? 'TRIGGERED' : 'NO'}, Risk: ${s.risk}`).join('\n')}

Provide the 3-4 sentence risk brief.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1024
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

    const brief = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!brief) {
      console.error('No brief in Gemini response:', JSON.stringify(data));
      return res.status(500).json({ error: 'No response generated' });
    }

    res.json({ brief });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Internal server error while generating risk brief." });
  }
});

export default router;
