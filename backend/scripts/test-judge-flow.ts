import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Sample problem: Two Sum (make sure it's seeded)
const SAMPLE_PROBLEM_ID = 'two-sum'; // This might need to be a real UUID depending on your DB
const SAMPLE_CODE = `
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};
`;

async function main() {
    try {
        console.log('🚀 Testing Judge0 Flow...');

        // 1. Login as Admin
        console.log('🔑 Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@codingbuddy.com',
            password: 'admin123'
        });
        const token = loginRes.data.data.token;
        console.log('✅ Logged in!');



        // 2. Submit Code
        // Note: You need to get the real problem ID from the database first
        // For now, let's assume we can fetch it via slug if endpoint exists, or I'll just hardcode a fetch

        console.log('🔍 Fetching Two Sum problem...');
        const problemRes = await axios.get(`${API_URL}/problems/two-sum`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const problemId = problemRes.data.data.id;
        console.log(`✅ Found problem: ${problemId}`);

        console.log('📤 Submitting solution...');
        const submitRes = await axios.post(`${API_URL}/submissions`, {
            problemId: problemId,
            code: SAMPLE_CODE,
            language: 'JAVASCRIPT'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`✅ Submission created! ID: ${submitRes.data.data.id}`);
        console.log('⏳ Waiting for results (check worker logs)...');

    } catch (error: any) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

main();
