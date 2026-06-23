const { GoogleGenAI } = require("@google/genai");
const HintUsage = require("../models/hintUsage");
const Problem = require("../models/problem");

const getOrCreateHint = async (req, res) => {
  try {
    const userId = req.result._id;
    const { problemId } = req.params;
    const { level } = req.body; // 1, 2, or 3

    if (!problemId || !level || ![1, 2, 3].includes(Number(level))) {
      return res.status(400).json({ message: "Invalid parameters. Problem ID and Level (1, 2, 3) are required." });
    }

    // 1. Check if the hint has already been generated for this user, problem, and level
    const existingHint = await HintUsage.findOne({ userId, problemId, level: Number(level) });
    if (existingHint) {
      return res.status(200).json({
        level: existingHint.level,
        hint: existingHint.hint,
        cached: true
      });
    }

    // 2. Fetch problem details for AI prompt context
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found." });
    }

    // 3. Initialize GenAI client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
    
    // Level-specific instruction prompts to keep hints graded without spoiling
    let levelInstruction = "";
    if (Number(level) === 1) {
      levelInstruction = "Level 1 (Subtle Nudge): Give a high-level conceptual hint. Hint at the classification of the problem (e.g., dynamic programming, two-pointers, dfs) and the core intuition. Do NOT outline concrete algorithmic steps or write code.";
    } else if (Number(level) === 2) {
      levelInstruction = "Level 2 (Algorithm/Approach): Describe the detailed step-by-step logic of the approach/algorithm (e.g. how pointers move, what state to transition in DP). Explain how it works theoretically. Do NOT provide any source code or pseudocode.";
    } else {
      levelInstruction = "Level 3 (Pseudocode): Provide a logical structure or high-level pseudocode representing the solution. Write clean, readable pseudocode, but do NOT write the complete executable code in a real language. Explain the complexity.";
    }

    const systemInstruction = `
You are a expert DSA tutor helping a student solve a coding challenge. Your job is to output a single hint corresponding to the requested difficulty level.
You must adhere strictly to the requested hint level without over-revealing.

PROBLEM CONTEXT:
Title: ${problem.title}
Description: ${problem.description}
Visible Testcases: ${JSON.stringify(problem.visibleTestCases)}

INSTRUCTION FOR REQUESTED LEVEL:
${levelInstruction}

STRICT LIMITATION:
- Do NOT provide a full working solution in C++, Java, or JavaScript.
- Keep your response formatting clean, concise, and professional using markdown.
`;

    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash-latest",
      contents: [{ role: "user", parts: [{ text: `Generate Hint Level ${level} for the problem: ${problem.title}` }] }],
      config: {
        systemInstruction
      }
    });

    const generatedHintText = response.text || "Sorry, I could not generate a hint. Please try again.";

    // 4. Save the hint in MongoDB to cache it
    const newHint = await HintUsage.create({
      userId,
      problemId,
      level: Number(level),
      hint: generatedHintText
    });

    res.status(201).json({
      level: newHint.level,
      hint: newHint.hint,
      cached: false
    });

  } catch (err) {
    console.error("AI Hint Error:", err);
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

const getRevealedHints = async (req, res) => {
  try {
    const userId = req.result._id;
    const { problemId } = req.params;

    if (!problemId) {
      return res.status(400).json({ message: "Problem ID is required." });
    }

    const revealed = await HintUsage.find({ userId, problemId }).select("level hint createdAt");
    res.status(200).json(revealed);
  } catch (err) {
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

module.exports = {
  getOrCreateHint,
  getRevealedHints
};
