import axios from 'axios';

export class GroqService {
    private static readonly API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    private static readonly API_KEY = process.env.GROQ_API_KEY;

    /**
     * Evaluate student code using Groq
     */
    static async evaluateSubmission(problemStatement: string, code: string, approach?: string) {
        if (!this.API_KEY) {
            console.warn('⚠️ GROQ_API_KEY not found. Skipping AI evaluation.');
            return {
                approachQuality: 'PENDING CHECK',
                codeQuality: 'PENDING CHECK',
                optimizationFeedback: 'Configure Groq API Key to enable AI feedback.',
                cheatingFlag: false
            };
        }

        const prompt = `
    You are a strict code evaluator. Analyze the following student submission for a coding problem.
    
    Problem: ${problemStatement}
    Student Code: ${code}
    Student Approach (if any): ${approach || 'None provided'}

    Provide a structured evaluation in JSON format with these fields:
    - approachQuality: (String) Rating of the approach (e.g., "Optimal", "Brute Force", "Inefficient")
    - codeQuality: (String) Rating of code cleanliness (e.g., "Clean", "Messy", "Redundant")
    - optimizationFeedback: (String) Actionable advice to improve time/space complexity.
    - cheatingFlag: (Boolean) True if code looks suspiciously like AI-generated or copied (e.g., includes comments from other platforms, weird variable names).

    Return ONLY JSON.
    `;

        try {
            const response = await axios.post(
                this.API_URL,
                {
                    model: 'llama3-70b-8192', // Or whatever model is available
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.2
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const content = response.data.choices[0].message.content;
            // Basic cleanup to extract JSON
            const jsonStart = content.indexOf('{');
            const jsonEnd = content.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                return JSON.parse(content.substring(jsonStart, jsonEnd + 1));
            }
            return { optimizationFeedback: 'Failed to parse AI response' }; // Fallback

        } catch (error: any) {
            console.error('❌ Groq evaluation failed:', error.message);
            return {
                approachQuality: 'Error',
                codeQuality: 'Error',
                optimizationFeedback: 'AI service currently unavailable.',
                cheatingFlag: false
            };
        }
    }
}
