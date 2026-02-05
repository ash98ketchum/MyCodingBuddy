import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Trophy, Users, TrendingUp } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold gradient-text mb-4">Welcome to CodingBuddy</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Master competitive programming, one problem at a time</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="card p-6 text-center">
          <Code2 className="mx-auto mb-4 text-primary-600" size={48} />
          <h3 className="text-xl font-bold mb-2">500+ Problems</h3>
          <p className="text-gray-600 dark:text-gray-400">From easy to hard</p>
        </div>
        <div className="card p-6 text-center">
          <Trophy className="mx-auto mb-4 text-yellow-600" size={48} />
          <h3 className="text-xl font-bold mb-2">Weekly Contests</h3>
          <p className="text-gray-600 dark:text-gray-400">Compete with others</p>
        </div>
        <div className="card p-6 text-center">
          <TrendingUp className="mx-auto mb-4 text-green-600" size={48} />
          <h3 className="text-xl font-bold mb-2">Track Progress</h3>
          <p className="text-gray-600 dark:text-gray-400">Analytics & insights</p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/problems" className="btn btn-primary text-lg px-8 py-3 inline-block">
          Start Practicing
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
