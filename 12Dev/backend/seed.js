const mongoose = require('mongoose');
const Problem = require('./src/models/problem');
const User = require('./src/models/user');

mongoose.connect('mongodb+srv://surajlalwani234567_db_user:Radha123%40@coding.aoblqyl.mongodb.net/Leetcode');

mongoose.connection.once('open', async () => {
  console.log('Connected to DB');

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) { console.log('No admin found'); process.exit(1); }

  const existing = await Problem.countDocuments();
  if (existing >= 10) {
    console.log(`Already have ${existing} problems. Skipping.`);
    mongoose.disconnect();
    return;
  }

  const problems = [
    {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
      difficulty: 'easy', tags: 'array',
      companies: ['google', 'amazon', 'meta'],
      frequency: 95,
      visibleTestCases: [
        { input: '[2,7,11,15]\n9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9, return [0, 1].' },
        { input: '[3,2,4]\n6', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6.' }
      ],
      hiddenTestCases: [
        { input: '[3,3]\n6', output: '[0,1]' },
        { input: '[1,5,8,3]\n11', output: '[1,2]' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function twoSum(nums, target) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'vector<int> twoSum(vector<int>& nums, int target) {\n  // write your solution\n}' },
        { language: 'java', initialCode: 'public int[] twoSum(int[] nums, int target) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map[comp] !== undefined) return [map[comp], i];\n    map[nums[i]] = i;\n  }\n};' }
      ]
    },
    {
      title: 'Reverse Linked List',
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
      difficulty: 'easy', tags: 'linkedList',
      companies: ['amazon', 'microsoft'],
      frequency: 88,
      visibleTestCases: [
        { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed the list.' },
        { input: '[1,2]', output: '[2,1]', explanation: 'Two node list reversed.' }
      ],
      hiddenTestCases: [
        { input: '[1]', output: '[1]' },
        { input: '[1,2,3]', output: '[3,2,1]' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function reverseList(head) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'ListNode* reverseList(ListNode* head) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) { let next = curr.next; curr.next = prev; prev = curr; curr = next; }\n  return prev;\n};' }
      ]
    },
    {
      title: 'Best Time to Buy and Sell Stock',
      description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
      difficulty: 'easy', tags: 'array',
      companies: ['amazon', 'google', 'microsoft'],
      frequency: 90,
      visibleTestCases: [
        { input: '[7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6), profit = 5.' },
        { input: '[7,6,4,3,1]', output: '0', explanation: 'No transactions done, max profit = 0.' }
      ],
      hiddenTestCases: [
        { input: '[1,2]', output: '1' },
        { input: '[2,4,1]', output: '2' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function maxProfit(prices) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'int maxProfit(vector<int>& prices) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function maxProfit(prices) {\n  let min = Infinity, max = 0;\n  for (let p of prices) { min = Math.min(min, p); max = Math.max(max, p - min); }\n  return max;\n};' }
      ]
    },
    {
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\nAn input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.',
      difficulty: 'easy', tags: 'array',
      companies: ['google', 'meta', 'amazon'],
      frequency: 85,
      visibleTestCases: [
        { input: '()', output: 'true', explanation: 'Valid pair.' },
        { input: '()[]{)', output: 'false', explanation: 'Mismatched bracket at end.' }
      ],
      hiddenTestCases: [
        { input: '{[]}', output: 'true' },
        { input: '([)]', output: 'false' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function isValid(s) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'bool isValid(string s) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function isValid(s) {\n  const stack = [], map = {")":"(","]":"[","}":"{"};\n  for (let c of s) {\n    if ("([{".includes(c)) stack.push(c);\n    else if (stack.pop() !== map[c]) return false;\n  }\n  return stack.length === 0;\n};' }
      ]
    },
    {
      title: 'Maximum Subarray',
      description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
      difficulty: 'medium', tags: 'dp',
      companies: ['amazon', 'microsoft', 'google'],
      frequency: 87,
      visibleTestCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum = 6.' },
        { input: '[1]', output: '1', explanation: 'Only one element.' }
      ],
      hiddenTestCases: [
        { input: '[5,4,-1,7,8]', output: '23' },
        { input: '[-1,-2,-3]', output: '-1' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function maxSubArray(nums) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'int maxSubArray(vector<int>& nums) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function maxSubArray(nums) {\n  let max = nums[0], curr = nums[0];\n  for (let i = 1; i < nums.length; i++) { curr = Math.max(nums[i], curr + nums[i]); max = Math.max(max, curr); }\n  return max;\n};' }
      ]
    },
    {
      title: 'Climbing Stairs',
      description: 'You are climbing a staircase. It takes n steps to reach the top.\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      difficulty: 'easy', tags: 'dp',
      companies: ['amazon', 'google'],
      frequency: 80,
      visibleTestCases: [
        { input: '2', output: '2', explanation: '1+1 or 2.' },
        { input: '3', output: '3', explanation: '1+1+1, 1+2, 2+1.' }
      ],
      hiddenTestCases: [
        { input: '5', output: '8' },
        { input: '10', output: '89' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function climbStairs(n) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'int climbStairs(int n) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function climbStairs(n) {\n  let a = 1, b = 1;\n  for (let i = 2; i <= n; i++) { [a, b] = [b, a + b]; }\n  return b;\n};' }
      ]
    },
    {
      title: 'Merge Two Sorted Lists',
      description: 'You are given the heads of two sorted linked lists list1 and list2.\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\nReturn the head of the merged linked list.',
      difficulty: 'easy', tags: 'linkedList',
      companies: ['amazon', 'microsoft', 'meta'],
      frequency: 82,
      visibleTestCases: [
        { input: '[1,2,4]\n[1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Both lists merged and sorted.' },
        { input: '[]\n[]', output: '[]', explanation: 'Both empty.' }
      ],
      hiddenTestCases: [
        { input: '[]\n[0]', output: '[0]' },
        { input: '[1,3,5]\n[2,4,6]', output: '[1,2,3,4,5,6]' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function mergeTwoLists(list1, list2) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function mergeTwoLists(l1, l2) {\n  if (!l1) return l2; if (!l2) return l1;\n  if (l1.val <= l2.val) { l1.next = mergeTwoLists(l1.next, l2); return l1; }\n  l2.next = mergeTwoLists(l1, l2.next); return l2;\n};' }
      ]
    },
    {
      title: 'Number of Islands',
      description: 'Given an m x n 2D binary grid grid which represents a map of 1s (land) and 0s (water), return the number of islands.\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
      difficulty: 'medium', tags: 'graph',
      companies: ['amazon', 'google', 'microsoft'],
      frequency: 88,
      visibleTestCases: [
        { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: 'One large island.' },
        { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: 'Three distinct islands.' }
      ],
      hiddenTestCases: [
        { input: '[["1"]]', output: '1' },
        { input: '[["0"]]', output: '0' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function numIslands(grid) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'int numIslands(vector<vector<char>>& grid) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function numIslands(grid) {\n  let count = 0;\n  const dfs = (r, c) => {\n    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === "0") return;\n    grid[r][c] = "0";\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n  };\n  for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid[0].length; c++) if (grid[r][c]==="1") { count++; dfs(r,c); }\n  return count;\n};' }
      ]
    },
    {
      title: 'Longest Common Subsequence',
      description: 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.',
      difficulty: 'medium', tags: 'dp',
      companies: ['google', 'amazon', 'microsoft'],
      frequency: 78,
      visibleTestCases: [
        { input: 'abcde\nace', output: '3', explanation: 'LCS is "ace".' },
        { input: 'abc\nabc', output: '3', explanation: 'LCS is "abc".' }
      ],
      hiddenTestCases: [
        { input: 'abc\ndef', output: '0' },
        { input: 'abcba\nabcbcba', output: '5' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function longestCommonSubsequence(text1, text2) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'int longestCommonSubsequence(string text1, string text2) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function longestCommonSubsequence(t1, t2) {\n  const dp = Array(t1.length+1).fill(0).map(()=>Array(t2.length+1).fill(0));\n  for (let i = 1; i <= t1.length; i++) for (let j = 1; j <= t2.length; j++) dp[i][j] = t1[i-1]===t2[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j],dp[i][j-1]);\n  return dp[t1.length][t2.length];\n};' }
      ]
    },
    {
      title: 'Detect Cycle in Linked List',
      description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.\nReturn true if there is a cycle in the linked list, otherwise return false.',
      difficulty: 'easy', tags: 'linkedList',
      companies: ['amazon', 'microsoft'],
      frequency: 75,
      visibleTestCases: [
        { input: '[3,2,0,-4]\npos=1', output: 'true', explanation: 'There is a cycle, tail connects to node index 1.' },
        { input: '[1,2]\npos=0', output: 'true', explanation: 'Cycle at index 0.' }
      ],
      hiddenTestCases: [
        { input: '[1]\npos=-1', output: 'false' },
        { input: '[1,2,3,4]\npos=-1', output: 'false' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function hasCycle(head) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'bool hasCycle(ListNode *head) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true; }\n  return false;\n};' }
      ]
    },
    {
      title: 'Course Schedule',
      description: 'There are numCourses courses you have to take, labeled from 0 to numCourses - 1.\nYou are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\nReturn true if you can finish all courses.',
      difficulty: 'medium', tags: 'graph',
      companies: ['google', 'amazon', 'meta'],
      frequency: 82,
      visibleTestCases: [
        { input: '2\n[[1,0]]', output: 'true', explanation: 'Take 0 then 1.' },
        { input: '2\n[[1,0],[0,1]]', output: 'false', explanation: 'Cycle: 0->1->0.' }
      ],
      hiddenTestCases: [
        { input: '1\n[]', output: 'true' },
        { input: '3\n[[0,1],[1,2],[2,0]]', output: 'false' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function canFinish(numCourses, prerequisites) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function canFinish(n, pre) {\n  const graph = Array.from({length:n},()=>[]), visited = new Array(n).fill(0);\n  for (const [a,b] of pre) graph[b].push(a);\n  const dfs = (node) => { if (visited[node]===1) return false; if (visited[node]===2) return true; visited[node]=1; for (const nb of graph[node]) if (!dfs(nb)) return false; visited[node]=2; return true; };\n  for (let i=0;i<n;i++) if (!dfs(i)) return false;\n  return true;\n};' }
      ]
    },
    {
      title: 'Coin Change',
      description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
      difficulty: 'medium', tags: 'dp',
      companies: ['amazon', 'microsoft', 'google'],
      frequency: 83,
      visibleTestCases: [
        { input: '[1,5,11]\n11', output: '1', explanation: '11 itself.' },
        { input: '[2]\n3', output: '-1', explanation: 'Cannot make 3 with only 2s.' }
      ],
      hiddenTestCases: [
        { input: '[1,2,5]\n11', output: '3' },
        { input: '[1]\n0', output: '0' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function coinChange(coins, amount) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'int coinChange(vector<int>& coins, int amount) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function coinChange(coins, amount) {\n  const dp = new Array(amount+1).fill(Infinity); dp[0]=0;\n  for (let i=1;i<=amount;i++) for (const c of coins) if (c<=i) dp[i]=Math.min(dp[i],dp[i-c]+1);\n  return dp[amount]===Infinity?-1:dp[amount];\n};' }
      ]
    },
    {
      title: 'Contains Duplicate',
      description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
      difficulty: 'easy', tags: 'array',
      companies: ['amazon', 'microsoft', 'meta'],
      frequency: 70,
      visibleTestCases: [
        { input: '[1,2,3,1]', output: 'true', explanation: '1 appears at index 0 and 3.' },
        { input: '[1,2,3,4]', output: 'false', explanation: 'All distinct.' }
      ],
      hiddenTestCases: [
        { input: '[1,1,1,3,3,4,3,2,4,2]', output: 'true' },
        { input: '[1]', output: 'false' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function containsDuplicate(nums) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'bool containsDuplicate(vector<int>& nums) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n};' }
      ]
    },
    {
      title: 'Flood Fill',
      description: 'An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image.\nYou are given three integers sr, sc, and color. Perform a flood fill starting from the pixel image[sr][sc].\nReturn the modified image after performing the flood fill.',
      difficulty: 'easy', tags: 'graph',
      companies: ['google', 'meta'],
      frequency: 72,
      visibleTestCases: [
        { input: '[[1,1,1],[1,1,0],[1,0,1]]\n1 1 2', output: '[[2,2,2],[2,2,0],[2,0,1]]', explanation: 'Fill connected 1s with 2.' },
        { input: '[[0,0,0],[0,0,0]]\n0 0 0', output: '[[0,0,0],[0,0,0]]', explanation: 'Already same color.' }
      ],
      hiddenTestCases: [
        { input: '[[1,1,1],[1,1,0],[1,0,1]]\n0 0 2', output: '[[2,2,2],[2,2,0],[2,0,1]]' },
        { input: '[[0,0,0],[0,1,1]]\n1 1 1', output: '[[0,0,0],[0,1,1]]' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function floodFill(image, sr, sc, color) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function floodFill(image, sr, sc, color) {\n  const orig = image[sr][sc]; if (orig === color) return image;\n  const dfs = (r,c) => { if (r<0||c<0||r>=image.length||c>=image[0].length||image[r][c]!==orig) return; image[r][c]=color; dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1); };\n  dfs(sr,sc); return image;\n};' }
      ]
    },
    {
      title: 'Longest Increasing Subsequence',
      description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
      difficulty: 'hard', tags: 'dp',
      companies: ['google', 'amazon', 'microsoft', 'meta'],
      frequency: 80,
      visibleTestCases: [
        { input: '[10,9,2,5,3,7,101,18]', output: '4', explanation: 'LIS: [2,3,7,101].' },
        { input: '[0,1,0,3,2,3]', output: '4', explanation: 'LIS: [0,1,2,3].' }
      ],
      hiddenTestCases: [
        { input: '[7,7,7,7,7]', output: '1' },
        { input: '[1,2,3,4,5]', output: '5' }
      ],
      startCode: [
        { language: 'javascript', initialCode: 'function lengthOfLIS(nums) {\n  // write your solution\n};' },
        { language: 'cpp', initialCode: 'int lengthOfLIS(vector<int>& nums) {\n  // write your solution\n}' }
      ],
      referenceSolution: [
        { language: 'javascript', completeCode: 'function lengthOfLIS(nums) {\n  const dp = new Array(nums.length).fill(1);\n  for (let i=1;i<nums.length;i++) for (let j=0;j<i;j++) if (nums[j]<nums[i]) dp[i]=Math.max(dp[i],dp[j]+1);\n  return Math.max(...dp);\n};' }
      ]
    }
  ];

  let inserted = 0;
  for (const p of problems) {
    try {
      await Problem.create({ ...p, problemCreator: admin._id });
      console.log(`✓ Inserted: ${p.title}`);
      inserted++;
    } catch (e) {
      console.log(`✗ Skipped ${p.title}: ${e.message}`);
    }
  }

  console.log(`\nDone! Inserted ${inserted} problems.`);
  mongoose.disconnect();
});
