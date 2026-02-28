import React from 'react';
import { Mail, Send } from 'lucide-react';

const EmailAutomationPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent">
                        Email Automation Center
                    </h1>
                    <p className="text-gray-500 mt-2">Configure automated dispatch of reports, performance alerts, and assignments.</p>
                </div>
                <Mail className="text-accent" size={40} />
            </div>

            <div className="card p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <Send size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Automated Triggers</h3>
                <p className="text-gray-500 max-w-md">
                    Configure rule-based emails for your students: low activity, streak warnings, or congratulations flags.
                </p>
            </div>
        </div>
    );
};

export default EmailAutomationPage;
