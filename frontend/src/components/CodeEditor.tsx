// frontend/src/components/CodeEditor.tsx
import React, { useState, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Play, Settings, Copy, Download, ChevronDown, RefreshCw } from 'lucide-react';
import { useEditorStore } from '@/store';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeEditorProps {
  onSubmit: (code: string, language: string) => void;
  onRun?: (code: string, language: string) => void;
  isSubmitting?: boolean;
  isRunning?: boolean;
}

const LANGUAGES = [
  { value: 'JAVASCRIPT', label: 'JavaScript', monaco: 'javascript', icon: 'JS' },
  { value: 'PYTHON', label: 'Python', monaco: 'python', icon: 'PY' },
  { value: 'JAVA', label: 'Java', monaco: 'java', icon: 'JV' },
  { value: 'CPP', label: 'C++', monaco: 'cpp', icon: 'C++' },
  { value: 'C', label: 'C', monaco: 'c', icon: 'C' },
];

const CODE_TEMPLATES: Record<string, string> = {
  JAVASCRIPT: `// Write your code here
`,

  PYTHON: `# Write your code here
`,

  JAVA: `class Solution {
    public static void main(String[] args) {
        // Write your code here
    }
}`,

  CPP: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,

  C: `#include <stdio.h>

int main() {
    // Write your code here
    return 0;
}`,
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ onSubmit, onRun, isSubmitting, isRunning }) => {
  const { code, language, theme, fontSize, setCode, setLanguage, setTheme, setFontSize } = useEditorStore();
  const [showSettings, setShowSettings] = useState(false);
  const monaco = useMonaco();

  const currentLang = LANGUAGES.find(l => l.value === language) || LANGUAGES[0];

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('premium-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' },
          { token: 'identifier', foreground: '9CDCFE' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
        ],
        colors: {
          'editor.background': '#0F1115',
          'editor.foreground': '#D4D4D4',
          'editor.lineHighlightBackground': '#1E2229',
          'editorCursor.foreground': '#FFB22C',
          'editor.selectionBackground': '#264F78',
          'editorIndentGuide.background': '#2B303B',
          'editorIndentGuide.activeBackground': '#5C6370',
        },
      });
      monaco.editor.setTheme('premium-dark');
    }
  }, [monaco]);

  const handleLanguageChange = (newLang: string) => {
    const isDefault = !code || Object.values(CODE_TEMPLATES).includes(code);
    if (isDefault) {
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

  const resetCode = () => {
    if (window.confirm('Are you sure you want to reset the code?')) {
      setCode(CODE_TEMPLATES[language]);
      toast.success('Code reset to default');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0F1115] rounded-xl overflow-hidden border border-[#2B303B] shadow-2xl">
      {/* Premium Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#15181E] border-b border-[#2B303B]">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-[#1E2229] hover:bg-[#2B303B] border border-[#2B303B] rounded-lg text-sm text-gray-200 focus:ring-2 focus:ring-accent/50 focus:border-accent font-medium transition-all cursor-pointer outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="h-4 w-px bg-[#2B303B]" />

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-[#2B303B] rounded-lg transition-all text-gray-400 hover:text-white"
              title="Copy code"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-[#2B303B] rounded-lg transition-all text-gray-400 hover:text-white"
              title="Download code"
            >
              <Download size={16} />
            </button>
            <button
              onClick={resetCode}
              className="p-2 hover:bg-[#2B303B] rounded-lg transition-all text-gray-400 hover:text-white"
              title="Reset code"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-accent/10 text-accent' : 'hover:bg-[#2B303B] text-gray-400 hover:text-white'}`}
              title="Editor Settings"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onRun && (
            <button
              onClick={() => onRun(code, language)}
              disabled={isRunning || !code.trim()}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#2B303B] hover:bg-[#383E4B] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium text-sm border border-[#383E4B]"
            >
              <Play size={14} className={isRunning ? 'animate-spin' : ''} />
              {isRunning ? 'Running...' : 'Run'}
            </button>
          )}

          <button
            onClick={() => onSubmit(code, language)}
            disabled={isSubmitting || !code.trim()}
            className="flex items-center gap-2 px-5 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium text-sm shadow-lg shadow-accent/20"
          >
            {isSubmitting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#15181E] border-b border-[#2B303B]"
          >
            <div className="px-4 py-3 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Font Size</label>
                <div className="flex items-center gap-2 bg-[#1E2229] rounded-lg p-1 border border-[#2B303B]">
                  <button
                    onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                    className="w-6 h-6 flex items-center justify-center hover:bg-[#2B303B] rounded text-gray-400 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-white">{fontSize}</span>
                  <button
                    onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                    className="w-6 h-6 flex items-center justify-center hover:bg-[#2B303B] rounded text-gray-400 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="px-2 py-1 bg-[#1E2229] border border-[#2B303B] rounded text-sm text-gray-300 focus:outline-none focus:border-accent"
                >
                  <option value="premium-dark">Premium Dark</option>
                  <option value="vs-dark">VS Code Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="flex-1 overflow-hidden relative group">
        <Editor
          height="100%"
          language={currentLang.monaco}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme={theme === 'vs-dark' ? 'vs-dark' : 'premium-dark'} // Fallback allowed
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false }, // Cleaner look
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false, // Cleaner
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
          className="bg-[#0F1115]"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
