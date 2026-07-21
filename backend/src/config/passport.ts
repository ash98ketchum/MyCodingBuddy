// backend/src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import prisma from '@/config/database';

// Define the shape of our user for passport serialization (though we don't use sessions, it's good practice)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const generateUsername = async (email: string) => {
  const baseUsername = email.split('@')[0];
  let username = baseUsername;
  let counter = 1;

  while (true) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (!existing) return username;
    username = `${baseUsername}${counter}`;
    counter++;
  }
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'missing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'missing',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error('No email found from Google profile'), false);
        }

        // Check if user already exists
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId: profile.id }, { email }],
          },
        });

        if (user) {
          // If user exists but doesn't have googleId linked, link it
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: profile.id, avatar: user.avatar || profile.photos?.[0].value },
            });
          }
          return done(null, user);
        }

        // Create new user
        const username = await generateUsername(email);
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            email,
            username,
            fullName: profile.displayName,
            avatar: profile.photos?.[0].value,
          },
        });

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'missing',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'missing',
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0].value || `${profile.username}@github.com`;

        let user = await prisma.user.findFirst({
          where: {
            OR: [{ githubId: profile.id }, { email }],
          },
        });

        if (user) {
          if (!user.githubId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { githubId: profile.id, avatar: user.avatar || profile.photos?.[0].value },
            });
          }
          return done(null, user);
        }

        const username = await generateUsername(email);
        user = await prisma.user.create({
          data: {
            githubId: profile.id,
            email,
            username,
            fullName: profile.displayName || profile.username,
            avatar: profile.photos?.[0].value,
          },
        });

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

export default passport;
