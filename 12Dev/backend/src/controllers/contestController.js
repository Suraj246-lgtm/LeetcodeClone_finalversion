const Contest = require('../models/contest');
const ContestRegistration = require('../models/contestRegistration');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility');

// Self-healing contest seeding
const ensureContests = async (userId) => {
  try {
    const count = await Contest.countDocuments();
    if (count === 0) {
      console.log("No contests found. Seeding demo contests...");
      const problems = await Problem.find({}).limit(3);
      const problemIds = problems.map(p => p._id);

      if (problemIds.length === 0) {
        console.log("No problems to add to contests yet.");
        return;
      }

      const now = new Date();

      // 1. Active Contest (starts 1 hour ago, ends in 1 hour)
      const activeStart = new Date(now.getTime() - 60 * 60 * 1000);
      const activeEnd = new Date(now.getTime() + 60 * 60 * 1000);
      await Contest.create({
        title: "Weekly Contest 101 (Active)",
        description: "Show off your speed and accuracy in our flagship weekly coding challenge!",
        startTime: activeStart,
        endTime: activeEnd,
        duration: 90,
        problems: problemIds,
        createdBy: userId,
        status: 'active'
      });

      // 2. Upcoming Contest (starts in 2 days)
      const upcomingStart = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
      const upcomingEnd = new Date(upcomingStart.getTime() + 2 * 60 * 60 * 1000);
      await Contest.create({
        title: "Biweekly Challenge 42 (Upcoming)",
        description: "Join our global community for this mid-week algorithmic sprint.",
        startTime: upcomingStart,
        endTime: upcomingEnd,
        duration: 120,
        problems: problemIds,
        createdBy: userId,
        status: 'upcoming'
      });

      // 3. Past Contest (ended 3 days ago)
      const pastStart = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
      const pastEnd = new Date(pastStart.getTime() + 2 * 60 * 60 * 1000);
      await Contest.create({
        title: "Algorithm Sprint #1 (Ended)",
        description: "Practice problems from our inaugural contest event.",
        startTime: pastStart,
        endTime: pastEnd,
        duration: 90,
        problems: problemIds,
        createdBy: userId,
        status: 'ended'
      });

      console.log("Successfully seeded 3 demo contests.");
    }
  } catch (err) {
    console.error("Contest seeding failed:", err);
  }
};

const createContest = async (req, res) => {
  try {
    const { title, description, startTime, endTime, duration, problems } = req.body;
    const userId = req.result._id;

    if (!title || !startTime || !endTime || !duration) {
      return res.status(400).json({ message: "Title, startTime, endTime, and duration are required." });
    }

    const contestProblems = problems && problems.length > 0
      ? problems
      : (await Problem.find({}).limit(3)).map(p => p._id);

    const contest = await Contest.create({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration: Number(duration),
      problems: contestProblems,
      createdBy: userId
    });

    res.status(201).json(contest);
  } catch (err) {
    res.status(500).json({ message: "Error creating contest: " + err.message });
  }
};

const getContests = async (req, res) => {
  try {
    const userId = req.result._id;
    await ensureContests(userId);

    const now = new Date();
    
    // Update statuses dynamically before fetching
    const contests = await Contest.find({});
    for (const c of contests) {
      let status = 'upcoming';
      if (now >= c.startTime && now <= c.endTime) {
        status = 'active';
      } else if (now > c.endTime) {
        status = 'ended';
      }
      if (c.status !== status) {
        c.status = status;
        await c.save();
      }
    }

    const allContests = await Contest.find({}).sort({ startTime: -1 });
    res.status(200).json(allContests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contests: " + err.message });
  }
};

const getContestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await Contest.findById(id).populate('problems', '_id title difficulty tags');
    if (!contest) {
      return res.status(404).json({ message: "Contest not found." });
    }
    res.status(200).json(contest);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contest details: " + err.message });
  }
};

const registerForContest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.result._id;

    const contest = await Contest.findById(id);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found." });
    }

    // Check if already registered
    const existing = await ContestRegistration.findOne({ contestId: id, userId });
    if (existing) {
      return res.status(200).json({ message: "Already registered.", registration: existing });
    }

    const reg = await ContestRegistration.create({
      contestId: id,
      userId
    });

    res.status(201).json({ message: "Successfully registered.", registration: reg });
  } catch (err) {
    res.status(500).json({ message: "Registration failed: " + err.message });
  }
};

const startVirtualContest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.result._id;

    const contest = await Contest.findById(id);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found." });
    }

    let reg = await ContestRegistration.findOne({ contestId: id, userId });
    if (!reg) {
      reg = await ContestRegistration.create({
        contestId: id,
        userId,
        startedAt: new Date()
      });
    } else if (!reg.startedAt) {
      reg.startedAt = new Date();
      await reg.save();
    }

    res.status(200).json({ message: "Virtual contest started.", registration: reg });
  } catch (err) {
    res.status(500).json({ message: "Failed to start virtual contest: " + err.message });
  }
};

const submitContestProblem = async (req, res) => {
  try {
    const { id, problemId } = req.params;
    const { code, languageId } = req.body;
    const userId = req.result._id;

    const contest = await Contest.findById(id);
    if (!contest) return res.status(404).json({ message: "Contest not found." });

    const registration = await ContestRegistration.findOne({ contestId: id, userId });
    if (!registration) {
      return res.status(403).json({ message: "You are not registered for this contest." });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found." });

    // 1. Submit Code to Judge0 (similar to core flow)
    const activeTestCases = problem.visibleTestCases.concat(problem.hiddenTestCases);
    const submissionsData = activeTestCases.map(tc => ({
      language_id: languageId,
      source_code: code,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const tokens = await submitBatch(submissionsData);
    const results = await submitToken(tokens);

    let testCasesPassed = 0;
    let status = 'accepted';
    let errorMessage = '';

    for (const r of results) {
      if (r.status.id === 3) {
        testCasesPassed++;
      } else {
        status = r.status.description.toLowerCase();
        errorMessage = r.stderr || r.compile_output || 'Failed testcase';
        break;
      }
    }

    const accepted = (status === 'accepted');

    // Create database submission entry
    await Submission.create({
      userId,
      problemId,
      code,
      language: getLanguageById(languageId),
      status,
      testCasesTotal: activeTestCases.length,
      testCasesPassed,
      errorMessage
    });

    // 2. Score Contest Registration if accepted or increment attempt count
    let problemEntry = registration.solvedProblems.find(sp => sp.problemId.toString() === problemId);
    if (!problemEntry) {
      problemEntry = { problemId, attempts: 0 };
      registration.solvedProblems.push(problemEntry);
      // Re-fetch reference
      problemEntry = registration.solvedProblems[registration.solvedProblems.length - 1];
    }

    if (accepted && !problemEntry.solvedAt) {
      problemEntry.solvedAt = new Date();
      
      // Calculate duration/offset in seconds
      const startTime = registration.startedAt || contest.startTime;
      const solvedOffsetSeconds = Math.floor((problemEntry.solvedAt.getTime() - startTime.getTime()) / 1000);
      
      // Penalty: offset in seconds + 300 seconds (5 min) for each wrong submission prior to accepted
      const wrongAttemptsPenalty = (problemEntry.attempts || 0) * 300;
      
      registration.score += 100;
      registration.penalty += (solvedOffsetSeconds + wrongAttemptsPenalty);
      
      await registration.save();
    } else if (!accepted && !problemEntry.solvedAt) {
      problemEntry.attempts += 1;
      await registration.save();
    }

    res.status(200).json({
      accepted,
      status,
      testCasesPassed,
      totalTestCases: activeTestCases.length,
      errorMessage
    });

  } catch (err) {
    console.error("Contest Submission Error:", err);
    res.status(500).json({ message: "Contest submission failed: " + err.message });
  }
};

const getContestLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const registrations = await ContestRegistration.find({ contestId: id })
      .populate('userId', 'firstName lastName')
      .sort({ score: -1, penalty: 1 });

    // Assign ranks
    const leaderboard = registrations.map((reg, index) => ({
      rank: index + 1,
      userId: reg.userId?._id,
      name: reg.userId ? `${reg.userId.firstName} ${reg.userId.lastName}` : 'Anonymous',
      score: reg.score,
      penalty: Math.round(reg.penalty / 60), // in minutes for easy viewing
      solvedCount: reg.solvedProblems.filter(sp => !!sp.solvedAt).length
    }));

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard: " + err.message });
  }
};

const getContestRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.result._id;

    const registration = await ContestRegistration.findOne({ contestId: id, userId });
    res.status(200).json(registration || null);
  } catch (err) {
    res.status(500).json({ message: "Error fetching registration: " + err.message });
  }
};

module.exports = {
  createContest,
  getContests,
  getContestDetails,
  registerForContest,
  startVirtualContest,
  submitContestProblem,
  getContestLeaderboard,
  getContestRegistration
};
