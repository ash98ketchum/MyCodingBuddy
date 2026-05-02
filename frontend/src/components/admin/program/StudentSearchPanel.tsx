import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Search } from 'lucide-react';
import { useProgramAdminStore } from '../../../store/programAdminStore';
import ExistenceIndicator, { IndicatorState } from './ExistenceIndicator';
import StudentPreviewCard from './StudentPreviewCard';

// --- Bloom Filter Hashing Match ---
function fnv1a(str: string): number {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
}

const StudentSearchPanel: React.FC = () => {
    const [emailInput, setEmailInput] = useState('');
    const [indicatorState, setIndicatorState] = useState<IndicatorState>('idle');

    const {
        bloomData,
        verifyStudentExact,
        setSelectedStudent,
        selectedStudent
    } = useProgramAdminStore();

    const checkBloomFilter = useCallback((email: string): boolean => {
        if (!bloomData) return false;

        const normalized = email.toLowerCase().trim();
        const hexString = bloomData.filter;

        for (let i = 0; i < bloomData.hashCount; i++) {
            const hash = fnv1a(`${normalized}_${i}`);
            const idx = hash % bloomData.bitSize;

            const byteIndex = Math.floor(idx / 8);
            const bitPosition = idx % 8;

            // Extract the specific byte from the hex string
            // 2 hex chars = 1 byte.
            const hexByte = hexString.substring(byteIndex * 2, byteIndex * 2 + 2);
            if (!hexByte) return false;

            // Parse hex to integer
            const byteValue = parseInt(hexByte, 16);

            // If any bit is 0, it definitely does not exist
            if ((byteValue & (1 << bitPosition)) === 0) {
                return false;
            }
        }
        return true; // "Probably exists"
    }, [bloomData]);

    // Handle debounced search pipeline
    useEffect(() => {
        const email = emailInput.trim();

        // Reset if empty
        if (!email) {
            setIndicatorState('idle');
            setSelectedStudent(null);
            return;
        }

        // Basic validation before checking
        if (!email.includes('@')) {
            setIndicatorState('idle');
            setSelectedStudent(null);
            return;
        }

        // 1. Instant Bloom Check
        const probablyExists = checkBloomFilter(email);

        // 2. Exact Verification
        // We use a shorter debounce (400ms) if the Bloom filter says it likely exists.
        // we use a longer debounce (1000ms) if it says it doesn't, assuming the filter might be stale.
        const debounceTime = probablyExists ? 400 : 1000;

        setIndicatorState('checking');
        const timeoutId = setTimeout(async () => {
            const student = await verifyStudentExact(email);
            if (student) {
                setIndicatorState('exists');
                setSelectedStudent(student);
            } else {
                setIndicatorState('not_found');
                setSelectedStudent(null);
            }
        }, debounceTime);

        return () => clearTimeout(timeoutId);
    }, [emailInput, checkBloomFilter, verifyStudentExact, setSelectedStudent]);

    // Handle typing
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setEmailInput(val);
        // Clear selection immediately when typing
        if (selectedStudent && val.trim().toLowerCase() !== selectedStudent.email.toLowerCase()) {
            setSelectedStudent(null);
        }
    };

    return (
        <div className="card p-6 border-l-4 border-l-accent flex flex-col h-full bg-white shadow-md">
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
                    <Search className="w-5 h-5 text-accent" />
                    Student Search
                </h3>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                    Locate via the optimized Bloom filter. Validation occurs instantaneously as you type.
                </p>
            </div>

            <div className="relative group flex-1">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block ml-1">
                    Student Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                        type="email"
                        value={emailInput}
                        onChange={handleInputChange}
                        className="input pl-12 pr-14 py-3.5 shadow-sm w-full bg-gray-50/50"
                        placeholder="student@example.edu"
                        spellCheck={false}
                    />

                    {/* Visual Status Indicator */}
                    <ExistenceIndicator state={indicatorState} />
                </div>

                {/* Match Preview Card */}
                <StudentPreviewCard />
            </div>

            {/* Meta insight */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-text-tertiary font-medium">
                <span>Filter Cache Size:</span>
                <span>{bloomData ? `${(bloomData.bitSize / 8 / 1024).toFixed(1)} KB` : 'Loading...'}</span>
            </div>
        </div>
    );
};

export default StudentSearchPanel;
