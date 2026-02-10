const { getGeminiModel } = require('../config/gemini');

// Generate interview questions based on role and experience
const generateQuestions = async (req, res) => {
  try {
    const { jobRole, experienceLevel, category, numQuestions = 5 } = req.body;

    if (!jobRole || !experienceLevel || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide jobRole, experienceLevel, and category'
      });
    }

    const model = getGeminiModel();

    const prompt = `Generate ${numQuestions} interview questions for a ${jobRole} position at ${experienceLevel} level.
    Category: ${category}
    
    For each question, provide:
    1. The question itself
    2. A comprehensive answer
    3. Difficulty level (easy, medium, hard, or expert)
    4. Tags/keywords related to the topic
    
    Format the response as a JSON array with this structure:
    [
      {
        "question": "...",
        "answer": "...",
        "difficulty": "...",
        "tags": ["tag1", "tag2"]
      }
    ]
    
    Make questions realistic, practical, and relevant to actual interview scenarios.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    let questions = [];
    
    if (jsonMatch) {
      try {
        questions = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('JSON parse error:', e);
        // Fallback: try to parse the entire text
        questions = JSON.parse(text);
      }
    }

    // Add category to each question
    questions = questions.map(q => ({
      ...q,
      category: category === 'mixed' ? 'technical' : category
    }));

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating questions',
      error: error.message
    });
  }
};

// Generate AI explanation for a concept
const generateExplanation = async (req, res) => {
  try {
    const { concept, context } = req.body;

    if (!concept) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a concept'
      });
    }

    const model = getGeminiModel();

    const prompt = `Explain the following concept in detail, suitable for interview preparation:
    
    Concept: ${concept}
    ${context ? `Context: ${context}` : ''}
    
    Please provide:
    1. A clear, concise definition
    2. Key points to remember
    3. Common interview questions related to this concept
    4. Practical examples or use cases
    5. Any related concepts that might be asked
    
    Format the response in a structured way that's easy to study.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation
      }
    });

  } catch (error) {
    console.error('Error generating explanation:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating explanation',
      error: error.message
    });
  }
};

// Generate answer improvement suggestions
const improveAnswer = async (req, res) => {
  try {
    const { question, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both question and userAnswer'
      });
    }

    const model = getGeminiModel();

    const prompt = `Review this interview answer and provide improvement suggestions:
    
    Question: ${question}
    User's Answer: ${userAnswer}
    
    Please provide:
    1. Strengths of the answer
    2. Areas for improvement
    3. A model answer that would be excellent in an interview
    4. Tips for delivering this answer confidently
    
    Be constructive and encouraging.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    res.status(200).json({
      success: true,
      data: {
        feedback
      }
    });

  } catch (error) {
    console.error('Error improving answer:', error);
    res.status(500).json({
      success: false,
      message: 'Error improving answer',
      error: error.message
    });
  }
};

module.exports = {
  generateQuestions,
  generateExplanation,
  improveAnswer
};
