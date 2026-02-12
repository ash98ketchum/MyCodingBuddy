
// backend/prisma/seed-problems.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding LeetCode problems...');

    // Find or create an admin user to be the creator
    let admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!admin) {
        console.log('⚠️  No admin user found. Creating default admin...');
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        admin = await prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@codingbuddy.com',
                password: hashedPassword,
                role: 'ADMIN',
                fullName: 'System Admin',
            },
        });
    }

    // Problem 1: Two Sum
    const twoSum = await prisma.problem.create({
        data: {
            title: 'Two Sum',
            slug: 'two-sum',
            description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
            difficulty: 'EASY',
            rating: 1200,
            tags: ['Array', 'Hash Table'],
            sampleInput: '4\\n2 7 11 15\\n9',
            sampleOutput: '0 1',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
            constraints: `2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.`,
            timeLimit: 2000,
            memoryLimit: 256,
            isFree: true,
            createdById: admin.id,
        },
    });

    await prisma.testCase.createMany({
        data: [
            { problemId: twoSum.id, input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isSample: true, isHidden: false, points: 10 },
            { problemId: twoSum.id, input: '3\n3 2 4\n6', expectedOutput: '1 2', isSample: false, isHidden: false, points: 10 },
            { problemId: twoSum.id, input: '2\n3 3\n6', expectedOutput: '0 1', isSample: false, isHidden: false, points: 10 },
            { problemId: twoSum.id, input: '5\n-1 -2 -3 -4 -5\n-8', expectedOutput: '2 4', isSample: false, isHidden: true, points: 10 },
            { problemId: twoSum.id, input: '4\n0 4 3 0\n0', expectedOutput: '0 3', isSample: false, isHidden: true, points: 10 },
            { problemId: twoSum.id, input: '10\n1 2 3 4 5 6 7 8 9 10\n19', expectedOutput: '8 9', isSample: false, isHidden: true, points: 10 },
            { problemId: twoSum.id, input: '3\n5 75 25\n100', expectedOutput: '1 2', isSample: false, isHidden: true, points: 10 },
            { problemId: twoSum.id, input: '6\n1 5 3 7 9 2\n10', expectedOutput: '3 4', isSample: false, isHidden: true, points: 10 },
            { problemId: twoSum.id, input: '5\n10 20 30 40 50\n90', expectedOutput: '3 4', isSample: false, isHidden: true, points: 10 },
            { problemId: twoSum.id, input: '3\n1000000 2000000 3000000\n5000000', expectedOutput: '1 2', isSample: false, isHidden: true, points: 10 },
        ],
    });

    // Problem 2: Add Two Numbers
    const addTwoNumbers = await prisma.problem.create({
        data: {
            title: 'Add Two Numbers',
            slug: 'add-two-numbers',
            description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
            difficulty: 'MEDIUM',
            rating: 1400,
            tags: ['Linked List', 'Math', 'Recursion'],
            sampleInput: '[2,4,3]\n[5,6,4]',
            sampleOutput: '[7,0,8]',
            explanation: 'Because 342 + 465 = 807.',
            constraints: `The number of nodes in each linked list is in the range [1, 100].
0 <= Node.val <= 9
It is guaranteed that the list represents a number that does not have leading zeros.`,
            timeLimit: 2000,
            memoryLimit: 256,
            isFree: true,
            createdById: admin.id,
        },
    });

    await prisma.testCase.createMany({
        data: [
            { problemId: addTwoNumbers.id, input: '[2,4,3]\n[5,6,4]', expectedOutput: '[7,0,8]', isSample: true, isHidden: false, points: 10 },
            { problemId: addTwoNumbers.id, input: '[0]\n[0]', expectedOutput: '[0]', isSample: false, isHidden: false, points: 10 },
            { problemId: addTwoNumbers.id, input: '[9,9,9,9,9,9,9]\n[9,9,9,9]', expectedOutput: '[8,9,9,9,0,0,0,1]', isSample: false, isHidden: false, points: 10 },
            { problemId: addTwoNumbers.id, input: '[1,8]\n[0]', expectedOutput: '[1,8]', isSample: false, isHidden: true, points: 10 },
            { problemId: addTwoNumbers.id, input: '[5]\n[5]', expectedOutput: '[0,1]', isSample: false, isHidden: true, points: 10 },
            { problemId: addTwoNumbers.id, input: '[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]\n[5,6,4]', expectedOutput: '[6,6,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]', isSample: false, isHidden: true, points: 10 },
            { problemId: addTwoNumbers.id, input: '[2,4,3,2,4,3,2,4,3,2,4,3]\n[5,6,4,5,6,4,5,6,4,5,6,4]', expectedOutput: '[7,0,8,7,0,8,7,0,8,7,0,8]', isSample: false, isHidden: true, points: 10 },
            { problemId: addTwoNumbers.id, input: '[9]\n[1,9,9,9,9,9,9,9,9,9]', expectedOutput: '[0,0,0,0,0,0,0,0,0,0,1]', isSample: false, isHidden: true, points: 10 },
            { problemId: addTwoNumbers.id, input: '[1,2,3,4,5]\n[6,7,8,9,0]', expectedOutput: '[7,9,1,4,5]', isSample: false, isHidden: true, points: 10 },
            { problemId: addTwoNumbers.id, input: '[9,9]\n[1]', expectedOutput: '[0,0,1]', isSample: false, isHidden: true, points: 10 },
        ],
    });

    // Problem 3: Longest Substring Without Repeating Characters
    const longestSubstring = await prisma.problem.create({
        data: {
            title: 'Longest Substring Without Repeating Characters',
            slug: 'longest-substring-without-repeating-characters',
            description: `Given a string s, find the length of the longest substring without repeating characters.`,
            difficulty: 'MEDIUM',
            rating: 1450,
            tags: ['Hash Table', 'String', 'Sliding Window'],
            sampleInput: 'abcabcbb',
            sampleOutput: '3',
            explanation: 'The answer is "abc", with the length of 3.',
            constraints: `0 <= s.length <= 5 * 10^4
s consists of English letters, digits, symbols and spaces.`,
            timeLimit: 2000,
            memoryLimit: 256,
            isFree: true,
            createdById: admin.id,
        },
    });

    await prisma.testCase.createMany({
        data: [
            { problemId: longestSubstring.id, input: 'abcabcbb', expectedOutput: '3', isSample: true, isHidden: false, points: 10 },
            { problemId: longestSubstring.id, input: 'bbbbb', expectedOutput: '1', isSample: false, isHidden: false, points: 10 },
            { problemId: longestSubstring.id, input: 'pwwkew', expectedOutput: '3', isSample: false, isHidden: false, points: 10 },
            { problemId: longestSubstring.id, input: '', expectedOutput: '0', isSample: false, isHidden: true, points: 10 },
            { problemId: longestSubstring.id, input: 'a', expectedOutput: '1', isSample: false, isHidden: true, points: 10 },
            { problemId: longestSubstring.id, input: 'abcdefghijklmnopqrstuvwxyz', expectedOutput: '26', isSample: false, isHidden: true, points: 10 },
            { problemId: longestSubstring.id, input: 'dvdf', expectedOutput: '3', isSample: false, isHidden: true, points: 10 },
            { problemId: longestSubstring.id, input: 'anviaj', expectedOutput: '5', isSample: false, isHidden: true, points: 10 },
            { problemId: longestSubstring.id, input: 'tmmzuxt', expectedOutput: '5', isSample: false, isHidden: true, points: 10 },
            { problemId: longestSubstring.id, input: ' ', expectedOutput: '1', isSample: false, isHidden: true, points: 10 },
        ],
    });

    // Problem 4: Median of Two Sorted Arrays
    const medianArrays = await prisma.problem.create({
        data: {
            title: 'Median of Two Sorted Arrays',
            slug: 'median-of-two-sorted-arrays',
            description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
            difficulty: 'HARD',
            rating: 1800,
            tags: ['Array', 'Binary Search', 'Divide and Conquer'],
            sampleInput: '[1,3]\n[2]',
            sampleOutput: '2.00000',
            explanation: 'Merged array = [1,2,3] and median is 2.',
            constraints: `nums1.length == m
nums2.length == n
0 <= m <= 1000
0 <= n <= 1000
1 <= m + n <= 2000
-10^6 <= nums1[i], nums2[i] <= 10^6`,
            timeLimit: 3000,
            memoryLimit: 256,
            isFree: true,
            createdById: admin.id,
        },
    });

    await prisma.testCase.createMany({
        data: [
            { problemId: medianArrays.id, input: '[1,3]\n[2]', expectedOutput: '2.00000', isSample: true, isHidden: false, points: 10 },
            { problemId: medianArrays.id, input: '[1,2]\n[3,4]', expectedOutput: '2.50000', isSample: false, isHidden: false, points: 10 },
            { problemId: medianArrays.id, input: '[]\n[1]', expectedOutput: '1.00000', isSample: false, isHidden: false, points: 10 },
            { problemId: medianArrays.id, input: '[2]\n[]', expectedOutput: '2.00000', isSample: false, isHidden: true, points: 10 },
            { problemId: medianArrays.id, input: '[1,2,3,4,5]\n[6,7,8,9,10]', expectedOutput: '5.50000', isSample: false, isHidden: true, points: 10 },
            { problemId: medianArrays.id, input: '[1]\n[2,3,4,5,6]', expectedOutput: '3.50000', isSample: false, isHidden: true, points: 10 },
            { problemId: medianArrays.id, input: '[1,3,5,7,9]\n[2,4,6,8,10]', expectedOutput: '5.50000', isSample: false, isHidden: true, points: 10 },
            { problemId: medianArrays.id, input: '[100000]\n[100001]', expectedOutput: '100000.50000', isSample: false, isHidden: true, points: 10 },
            { problemId: medianArrays.id, input: '[1,2]\n[1,2]', expectedOutput: '1.50000', isSample: false, isHidden: true, points: 10 },
            { problemId: medianArrays.id, input: '[-5,-3,-1]\n[-4,-2,0]', expectedOutput: '-2.50000', isSample: false, isHidden: true, points: 10 },
        ],
    });

    // Problem 5: Longest Palindromic Substring
    const longestPalindrome = await prisma.problem.create({
        data: {
            title: 'Longest Palindromic Substring',
            slug: 'longest-palindromic-substring',
            description: `Given a string s, return the longest palindromic substring in s.

A palindrome is a string that reads the same backward as forward.`,
            difficulty: 'MEDIUM',
            rating: 1500,
            tags: ['String', 'Dynamic Programming'],
            sampleInput: 'babad',
            sampleOutput: 'bab',
            explanation: 'Note: "aba" is also a valid answer.',
            constraints: `1 <= s.length <= 1000
s consist of only digits and English letters.`,
            timeLimit: 2000,
            memoryLimit: 256,
            isFree: true,
            createdById: admin.id,
        },
    });

    await prisma.testCase.createMany({
        data: [
            { problemId: longestPalindrome.id, input: 'babad', expectedOutput: 'bab', isSample: true, isHidden: false, points: 10 },
            { problemId: longestPalindrome.id, input: 'cbbd', expectedOutput: 'bb', isSample: false, isHidden: false, points: 10 },
            { problemId: longestPalindrome.id, input: 'a', expectedOutput: 'a', isSample: false, isHidden: false, points: 10 },
            { problemId: longestPalindrome.id, input: 'ac', expectedOutput: 'a', isSample: false, isHidden: true, points: 10 },
            { problemId: longestPalindrome.id, input: 'racecar', expectedOutput: 'racecar', isSample: false, isHidden: true, points: 10 },
            { problemId: longestPalindrome.id, input: 'noon', expectedOutput: 'noon', isSample: false, isHidden: true, points: 10 },
            { problemId: longestPalindrome.id, input: 'abcdefg', expectedOutput: 'a', isSample: false, isHidden: true, points: 10 },
            { problemId: longestPalindrome.id, input: 'aaaa', expectedOutput: 'aaaa', isSample: false, isHidden: true, points: 10 },
            { problemId: longestPalindrome.id, input: 'bananas', expectedOutput: 'anana', isSample: false, isHidden: true, points: 10 },
            { problemId: longestPalindrome.id, input: 'civilwartestingwhetherthatnaptionoranynartionsoconceivedandsodedicatedcanlongendure', expectedOutput: 'ranynar', isSample: false, isHidden: true, points: 10 },
        ],
    });

    console.log('✅ Successfully seeded 5 LeetCode problems:');
    console.log(`   1. ${twoSum.title} (${twoSum.difficulty}) - 10 test cases`);
    console.log(`   2. ${addTwoNumbers.title} (${addTwoNumbers.difficulty}) - 10 test cases`);
    console.log(`   3. ${longestSubstring.title} (${longestSubstring.difficulty}) - 10 test cases`);
    console.log(`   4. ${medianArrays.title} (${medianArrays.difficulty}) - 10 test cases`);
    console.log(`   5. ${longestPalindrome.title} (${longestPalindrome.difficulty}) - 10 test cases`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
