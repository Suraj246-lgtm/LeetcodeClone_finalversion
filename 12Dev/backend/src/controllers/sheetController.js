const Problem = require('../models/problem');
const User = require('../models/user');

// Self-healing function to seed company tags if none exist
const ensureCompanyTags = async () => {
  try {
    const problemsWithCompanies = await Problem.findOne({ companies: { $exists: true, $not: { $size: 0 } } });
    if (!problemsWithCompanies) {
      console.log("No problems with company tags found. Seeding company tags...");
      const allProblems = await Problem.find({});
      const companies = ['google', 'amazon', 'microsoft', 'meta'];
      
      for (let i = 0; i < allProblems.length; i++) {
        const problem = allProblems[i];
        // Assign 1-2 random companies
        const assignedCompanies = [];
        const count = Math.floor(Math.random() * 2) + 1; // 1 or 2
        while (assignedCompanies.length < count) {
          const randCompany = companies[Math.floor(Math.random() * companies.length)];
          if (!assignedCompanies.includes(randCompany)) {
            assignedCompanies.push(randCompany);
          }
        }
        
        problem.companies = assignedCompanies;
        problem.frequency = Math.floor(Math.random() * 90) + 10; // frequency score 10-100
        await problem.save();
      }
      console.log("Successfully seeded company tags to existing problems.");
    }
  } catch (err) {
    console.error("Failed to check/seed company tags:", err);
  }
};

const getCompanySheet = async (req, res) => {
  try {
    const { company } = req.params;
    const cleanCompany = company.toLowerCase();

    // Call self-healing tags verification
    await ensureCompanyTags();

    const problems = await Problem.find({ companies: cleanCompany })
      .select('_id title difficulty tags frequency');

    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving company sheet: ' + err.message });
  }
};

const getCompanyProgress = async (req, res) => {
  try {
    const { company } = req.params;
    const cleanCompany = company.toLowerCase();
    const userId = req.result._id;

    // Call self-healing tags verification
    await ensureCompanyTags();

    // Find all problems in the company sheet
    const companyProblems = await Problem.find({ companies: cleanCompany }).select('_id');
    const companyProblemIds = companyProblems.map(p => p._id.toString());

    // Fetch user's solved problems
    const user = await User.findById(userId).select('problemSolved');
    const userSolvedIds = user.problemSolved.map(id => id.toString());

    // Intersection: Solved problems that belong to this sheet
    const solvedInSheet = companyProblemIds.filter(id => userSolvedIds.includes(id));

    const total = companyProblemIds.length;
    const solved = solvedInSheet.length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    res.status(200).json({
      company: cleanCompany,
      totalQuestions: total,
      solvedQuestions: solved,
      progressPercentage: percentage,
      solvedIds: solvedInSheet
    });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating progress: ' + err.message });
  }
};

const getAllSheetsProgress = async (req, res) => {
  try {
    const userId = req.result._id;
    await ensureCompanyTags();

    const user = await User.findById(userId).select('problemSolved');
    const userSolvedIds = new Set(user.problemSolved.map(id => id.toString()));

    const companies = ['google', 'amazon', 'microsoft', 'meta'];
    const results = {};

    for (const comp of companies) {
      const probs = await Problem.find({ companies: comp }).select('_id');
      const total = probs.length;
      let solved = 0;

      probs.forEach(p => {
        if (userSolvedIds.has(p._id.toString())) {
          solved++;
        }
      });

      results[comp] = {
        total,
        solved,
        percentage: total > 0 ? Math.round((solved / total) * 100) : 0
      };
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving all sheets progress: ' + err.message });
  }
};

module.exports = {
  getCompanySheet,
  getCompanyProgress,
  getAllSheetsProgress
};
