#!/usr/bin/env ts-node
// backend/scripts/judge-self-test.ts
//
// Self-test script for the self-hosted Judge0 integration.
// Run with: npm run judge:test
//
// Process:
//   1. Verify Judge0 is healthy (GET /languages)
//   2. Submit a known-correct C++ Two-Sum solution with 1 test case
//   3. Poll for the result
//   4. Print verdict, execution time, and memory

import 'dotenv/config';
import { judge0Client } from '../src/services/judge0Client.service';
import { config } from '../src/config';

// ── Known-correct C++ program ─────────────────────────────────────────────────
// Two Sum — reads N, then N numbers, then K; prints indices of two numbers that sum to K
const CPP_SOURCE = `
#include<bits/stdc++.h>
using namespace std;
int main(){
    int n;
    cin >> n;
    vector<int> arr(n);
    for(int i = 0; i < n; i++) cin >> arr[i];
    int k;
    cin >> k;
    vector<int> ans = {-1, -1};
    for(int i = 0; i < n; i++){
        for(int j = i + 1; j < n; j++){
            if(arr[i] + arr[j] == k){
                ans[0] = i;
                ans[1] = j;
                break;
            }
        }
        if(ans[0] != -1) break;
    }
    cout << ans[0] << " " << ans[1] << endl;
    return 0;
}
`.trim();

// Test case matching the problem seen in the screenshot
const TEST_INPUT = '4\n2 7 11 15\n9';
const TEST_EXPECTED = '0 1';

async function main() {
    const judgeUrl = process.env.JUDGE0_URL || config.judge.apiUrl;
    console.log(`\n🔍 Judge0 Self-Test`);
    console.log(`   URL: ${judgeUrl}\n`);

    // ── 1. Health check ───────────────────────────────────────────────────────
    process.stdout.write('1️⃣  Checking Judge0 health ... ');
    const healthy = await judge0Client.isHealthy();
    if (healthy) {
        console.log('✅ Judge0 is healthy\n');
    } else {
        console.log(`❌ Judge0 is NOT reachable at ${judgeUrl}`);
        console.log('   Start it with: docker compose up -d judge0-server judge0-worker judge0-postgres judge0-redis');
        console.log('   Wait ~30s for initialisation, then re-run this script.\n');
        process.exit(1);
    }

    // ── 2. Submit ─────────────────────────────────────────────────────────────
    process.stdout.write('2️⃣  Submitting C++ Two-Sum solution ... ');
    let token: string;
    try {
        token = await judge0Client.submit({
            code: CPP_SOURCE,
            language: 'CPP',
            stdin: TEST_INPUT,
            expectedOutput: TEST_EXPECTED,
        });
        console.log(`✅ Token: ${token}\n`);
    } catch (err: any) {
        console.log(`❌ Submission failed: ${err.message}\n`);
        process.exit(1);
    }

    // ── 3. Poll ───────────────────────────────────────────────────────────────
    console.log('3️⃣  Polling for result (max 45s) ...');
    let result;
    try {
        result = await judge0Client.pollResult(token);
    } catch (err: any) {
        console.log(`❌ Polling timed out: ${err.message}\n`);
        process.exit(1);
    }

    // ── 4. Print result ───────────────────────────────────────────────────────
    const status = result.status;
    const execTime = result.time ? `${parseFloat(result.time) * 1000}ms` : 'n/a';
    const memKb = result.memory ? `${(result.memory / 1024).toFixed(1)} MB` : 'n/a';

    console.log(`\n─────────────────────────────────────`);
    if (status.id === 3) {
        console.log(`✅ Verdict:        Accepted`);
    } else {
        console.log(`❌ Verdict:        ${status.description} (id=${status.id})`);
        if (result.stderr) console.log(`   Stderr:         ${result.stderr.slice(0, 300)}`);
        if (result.compile_output) console.log(`   Compile output: ${result.compile_output.slice(0, 300)}`);
    }
    console.log(`⏱  Execution time: ${execTime}`);
    console.log(`🧠 Memory used:    ${memKb}`);
    console.log(`📤 Stdout:         ${result.stdout?.trim() ?? '(empty)'}`);
    console.log(`─────────────────────────────────────\n`);

    process.exit(status.id === 3 ? 0 : 1);
}

main().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
