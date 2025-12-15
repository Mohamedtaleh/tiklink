'use server';

import { callGeminiDirect } from '@/ai/genkit';

export interface AnalysisCategory {
  score: number;
  feedback: string;
}

export interface PredictViralScoreInput {
  videoTitle: string;
  videoAuthor: string;
  likes: string;
  duration: string;
  mode: string;
}

export interface PredictViralScoreOutput {
  score: number;
  verdict: string;
  analysis: {
    hook: AnalysisCategory;
    content: AnalysisCategory;
    engagement: AnalysisCategory;
    trending: AnalysisCategory;
  };
  improvements: string[];
  roast?: string;
  debug?: {
    error?: string;
    usedFallback: boolean;
  };
}

export async function predictViralScore(input: PredictViralScoreInput): Promise<PredictViralScoreOutput> {
  const prompt = `You are a TikTok algorithm expert and content strategist. Analyze this video's viral potential with ACTIONABLE insights.

VIDEO DETAILS:
- Title/Description: "${input.videoTitle}"
- Creator: @${input.videoAuthor}
- Current Likes: ${input.likes}
- Duration: ${input.duration}
- Analysis Mode: ${input.mode}

SCORING CRITERIA (0-100):
1. HOOK (First 1-3 seconds): Does the title suggest a strong pattern interrupt? Curiosity gap? Immediate value?
2. CONTENT QUALITY: Is the topic trending? Original? Entertaining/Educational value?
3. ENGAGEMENT POTENTIAL: Would viewers comment, share, duet, or stitch this?
4. TRENDING ALIGNMENT: Does it use current sounds, effects, or participate in trends?

${input.mode === 'roast' ? 'ROAST MODE: Include a hilarious Gen-Z style roast of this content (savage but helpful).' : ''}

Provide 5 SPECIFIC, ACTIONABLE improvements - not generic advice. Reference the actual content.

Return ONLY valid JSON:
{"score":75,"verdict":"High Potential","analysis":{"hook":{"score":80,"feedback":"specific feedback"},"content":{"score":70,"feedback":"specific feedback"},"engagement":{"score":75,"feedback":"specific feedback"},"trending":{"score":72,"feedback":"specific feedback"}},"improvements":["specific tip 1","specific tip 2","specific tip 3","specific tip 4","specific tip 5"]${input.mode === 'roast' ? ',"roast":"funny roast"' : ''}}`;

  try {
    const text = await callGeminiDirect(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return { ...result, debug: { usedFallback: false } };
  } catch (error: any) {
    return createFallbackResponse(input, error.message);
  }
}

function createFallbackResponse(input: PredictViralScoreInput, errorMessage?: string): PredictViralScoreOutput {
  const likesNum = parseInt(input.likes.replace(/[^0-9]/g, '')) || 1000;
  const durationNum = parseInt(input.duration) || 30;
  const titleLength = input.videoTitle.length;
  const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(input.videoTitle);
  const hasQuestion = input.videoTitle.includes('?');
  const hasNumber = /\d/.test(input.videoTitle);
  
  // More sophisticated scoring algorithm
  let baseScore = 50;
  
  // Likes impact (logarithmic scale)
  baseScore += Math.min(25, Math.floor(Math.log10(likesNum + 1) * 5));
  
  // Duration sweet spot (15-45 seconds is ideal)
  if (durationNum >= 15 && durationNum <= 45) baseScore += 10;
  else if (durationNum > 45 && durationNum <= 60) baseScore += 5;
  else if (durationNum > 60) baseScore -= 5;
  
  // Title optimization
  if (hasQuestion) baseScore += 5; // Questions drive engagement
  if (hasEmoji) baseScore += 3; // Emojis catch attention
  if (hasNumber) baseScore += 4; // Numbers create specificity
  if (titleLength > 20 && titleLength < 100) baseScore += 3;
  
  baseScore = Math.min(95, Math.max(25, baseScore));

  const hookScore = Math.min(100, baseScore + (hasQuestion ? 8 : 0) + (hasEmoji ? 5 : -3));
  const contentScore = baseScore;
  const engagementScore = Math.min(100, baseScore + Math.floor(Math.log10(likesNum + 1) * 3));
  const trendingScore = Math.min(100, baseScore + (durationNum <= 30 ? 8 : -5));

  const verdicts: Record<string, string> = {
    high: "🔥 High Viral Potential",
    medium: "📈 Good Growth Potential",
    low: "💪 Needs Optimization"
  };

  const verdict = baseScore >= 70 ? verdicts.high : baseScore >= 50 ? verdicts.medium : verdicts.low;

  return {
    score: baseScore,
    verdict,
    analysis: {
      hook: { 
        score: hookScore, 
        feedback: hookScore >= 75 
          ? "Strong opening potential! The title suggests you're grabbing attention early. Consider adding a visual hook within the first 0.5 seconds." 
          : "Your hook could be stronger. Start with movement, text on screen, or a controversial statement to stop the scroll."
      },
      content: { 
        score: contentScore, 
        feedback: contentScore >= 70
          ? "Solid content framework. Focus on delivering value quickly and maintaining energy throughout."
          : "Content needs more punch. Try the 'expectation subversion' technique - set up one thing, deliver another."
      },
      engagement: { 
        score: engagementScore, 
        feedback: engagementScore >= 70
          ? `Current engagement (${input.likes} likes) shows promise. Maximize it with a clear CTA in the last 2 seconds.`
          : "Engagement could improve. End with a question, controversial take, or 'reply for part 2' to boost comments."
      },
      trending: { 
        score: trendingScore, 
        feedback: trendingScore >= 70
          ? `${durationNum}s duration is within the sweet spot. Pair this with a trending sound for algorithm boost.`
          : "Consider optimizing duration. TikTok currently favors 15-45 second videos for maximum distribution."
      },
    },
    improvements: [
      `🎯 Hook Enhancement: Add text overlay in the first frame that creates curiosity ("Watch what happens..." or "Nobody talks about this...")`,
      `🎵 Audio Strategy: Use a trending sound from the past 7 days - check the 'Add Sound' page for viral audio`,
      `💬 Comment Bait: End with "Do you agree? Comment below" or ask viewers to guess what happens next`,
      `⏰ Timing: Post between 7-9 PM in your target audience's timezone for maximum initial velocity`,
      `🔄 Series Content: Turn this into a 3-part series with cliffhangers to build follower retention`,
    ],
    roast: input.mode === 'roast' 
      ? `Okay bestie, let's have a talk 💀 You really posted "${input.videoTitle.substring(0, 30)}..." and thought the FYP would just FIND you? The algorithm is sitting there like 🤨 waiting for you to give it something to work with. ${likesNum > 1000 ? "At least you got some likes, that's giving participation trophy energy fr" : "The like count is giving 'my mom and my alt account'"} but no cap, with some tweaks this could actually eat. Just needs that ✨main character energy✨ instead of background character vibes 💅`
      : undefined,
    debug: {
      error: errorMessage,
      usedFallback: true,
    }
  };
}
