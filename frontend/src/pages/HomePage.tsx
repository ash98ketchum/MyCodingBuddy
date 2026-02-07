import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Trophy, Users, TrendingUp, Zap, Target, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Button } from '../components/ui';

const HomePage = () => {
  const stats = [
    { value: 500, suffix: '+', label: 'Problems' },
    { value: 1000, suffix: '+', label: 'Active Users' },
    { value: 10000, suffix: '+', label: 'Submissions' },
    { value: 50, suffix: '+', label: 'Contests' },
  ];

  const features = [
    {
      icon: Code2,
      title: 'Monaco Code Editor',
      description: 'VS Code-powered editor with syntax highlighting, autocomplete, and multiple themes.',
      color: 'text-accent',
    },
    {
      icon: Zap,
      title: 'Real-time Execution',
      description: 'Run and test your code instantly with detailed feedback and execution metrics.',
      color: 'text-secondary',
    },
    {
      icon: Trophy,
      title: 'Weekly Contests',
      description: 'Compete with developers worldwide and climb the leaderboard to win prizes.',
      color: 'text-accent',
    },
    {
      icon: Target,
      title: 'Smart Practice',
      description: 'AI-curated problem recommendations based on your skill level and progress.',
      color: 'text-secondary',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Track your improvement with detailed statistics and performance insights.',
      color: 'text-success',
    },
    {
      icon: Award,
      title: 'Achievements',
      description: 'Earn badges and certificates as you solve problems and reach milestones.',
      color: 'text-accent',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-white to-accent/5">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #FFB22C 1px, transparent 1px), linear-gradient(to bottom, #FFB22C 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              🚀 Your Journey to Coding Excellence Starts Here
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Master <span className="gradient-text">Competitive</span>
              <br />
              <span className="gradient-text">Programming</span>
            </h1>

            <p className="text-xl sm:text-2xl text-text-secondary mb-10 max-w-2xl mx-auto">
              Practice 500+ problems, compete in contests, and level up your coding skills with our professional platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/problems">
                <Button size="lg" className="group">
                  Start Practicing
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="outline" size="lg">
                  <Trophy size={20} />
                  View Leaderboard
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">
                    <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Everything You Need to <span className="gradient-text">Excel</span>
            </motion.h2>
            <p className="text-xl text-text-secondary">
              Professional tools and features designed for serious developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-hover p-8 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`inline-flex p-3 rounded-lg bg-accent/10 ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-background to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-text-secondary">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Choose a Problem', description: 'Browse through 500+ curated problems across all difficulty levels' },
              { step: '02', title: 'Write Your Solution', description: 'Code in your favorite language with our advanced Monaco editor' },
              { step: '03', title: 'Submit & Learn', description: 'Get instant feedback and improve with detailed explanations' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-6xl font-bold text-accent/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-text-secondary">{item.description}</p>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-8 text-accent/30" size={32} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent to-secondary text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers improving their coding skills every day
            </p>
            <Link to="/register">
              <Button size="lg" variant="outline" className="bg-white text-accent hover:bg-white/90 border-white">
                Create Free Account
                <ArrowRight size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
