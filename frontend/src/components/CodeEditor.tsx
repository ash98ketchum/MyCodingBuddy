import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Settings, Copy, Download } from 'lucide-react';
import { useEditorStore } from '@/store';
import toast from 'react-hot-toast';

interface CodeEditorProps {
  onSubmit: (code: string, language: string) => void;
  isSubmitting?: boolean;
}

const LANGUAGES = [
  { value: 'JAVASCRIPT', label: 'JavaScript', monaco: 'javascript' },
  { value: 'PYTHON', label: 'Python', monaco: 'python' },
  { value: 'JAVA', label: 'Java', monaco: 'java' },
  { value: 'CPP', label: 'C++', monaco: 'cpp' },
  { value: 'C', label: 'C', monaco: 'c' },
];

const CODE_TEMPLATES: Record<string, string> = {
  JAVASCRIPT: `function solution(input) {
  // Write your code here
  return input;
}

// Read input
const input = require('fs').readFileSync(0, 'utf-8').trim();
console.log(solution(input));`,
  
  PYTHON: `def solution(input_data):
    # Write your code here
    return input_data

# Read input
import sys
input_data = sys.stdin.read().strip()
print(solution(input_data))`,
  
  JAVA: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        System.out.println(solution(input));
    }
    
    public static String solution(String input) {
        // Write your code here
        return input;
    }
}`,
  
  CPP: `#include <iostream>
#include <string>
using namespace std;

string solution(string input) {
    // Write your code here
    return input;
}

int main() {
    string input;
    getline(cin, input);
    cout << solution(input) << endl;
    return 0;
}`,
  
  C: `#include <stdio.h>
#include <string.h>

int main() {
    char input[1000];
    fgets(input, sizeof(input), stdin);
    // Write your code here
    printf("%s", input);
    return 0;
}`,
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ onSubmit, isSubmitting }) => {
  const { code, language, theme, fontSize, setCode, setLanguage, setTheme, setFontSize } = useEditorStore();
  const [showSettings, setShowSettings] = useState(false);

  const currentLang = LANGUAGES.find(l => l.value === language) || LANGUAGES[0];

  const handleLanguageChange = (newLang: string) => {
    if (!code || code === CODE_TEMPLATES[language]) {
      setCode(CODE_TEMPLATES[newLang]);
    }
    setLanguage(newLang);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${currentLang.monaco}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  return (
    <div className="h-full flex flex-col bg-dark-900 rounded-xl overflow-hidden border border-dark-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-700">
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-sm text-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
              title="Copy code"
            >
              <Copy size={18} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
              title="Download code"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        <button
          onClick={() => onSubmit(code, language)}
          disabled={isSubmitting || !code.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          <Play size={18} />
          {isSubmitting ? 'Submitting...' : 'Run Code'}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-4 py-3 bg-dark-800 border-b border-dark-700 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-2 py-1 bg-dark-700 border border-dark-600 rounded text-sm text-gray-200"
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Font Size:</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              min="10"
              max="24"
              className="w-16 px-2 py-1 bg-dark-700 border border-dark-600 rounded text-sm text-gray-200"
            />
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={currentLang.monaco}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme={theme}
          options={{
            fontSize,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
            },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
