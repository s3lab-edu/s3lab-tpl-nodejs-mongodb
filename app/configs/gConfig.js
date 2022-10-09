let MONGODB_URL;
let APIROOT_URL;

if (process.env.RUN_MODE === 'PROD') {
    MONGODB_URL = 'mongodb+srv://dientv:dientv@cluster0.c4eivn9.mongodb.net/?retryWrites=true&w=majority';
    APIROOT_URL = 'http://localhost:3000/';
} else if (process.env.RUN_MODE === 'DEV') {
    MONGODB_URL = 'mongodb+srv://dientv:dientv@cluster0.c4eivn9.mongodb.net/?retryWrites=true&w=majority';
    APIROOT_URL = 'http://localhost:3000/';
} else if  (process.env.RUN_MODE === 'SLAB') {
    MONGODB_URL = 'mongodb+srv://dientv:dientv@cluster0.c4eivn9.mongodb.net/?retryWrites=true&w=majority';
    APIROOT_URL = 'http://localhost:3000/';
} else {
    MONGODB_URL = 'mongodb+srv://dientv:dientv@cluster0.c4eivn9.mongodb.net/?retryWrites=true&w=majority';
    APIROOT_URL = 'http://localhost:3000/';
}

module.exports = {
    https: false,
    appname: 's3lab.',
    port: process.env.PORT || 3001,
    url: APIROOT_URL,
    authenticationkey: 'fdhjfdfuejfkjdhfaueyrujhgesfhjs',
    paths:{
        public: '/public',
        tmp: '/tmp',
        docs:'/docs',
        tag:'/tag'
    },
    mongodb: {
        uri: MONGODB_URL ='mongodb+srv://dientv:dientv@cluster0.c4eivn9.mongodb.net/?retryWrites=true&w=majority',
        username: ''
    },
    socialNetwork: {
        // OAuth 2.0
        facebook:{
            key: process.env.FACEBOOK_OAUTH_KEY || '',
            secret: process.env.FACEBOOK_OAUTH_SECRET || '6c0d7108856b7599eb8e17024f37f251'
        },
        google:{
            key: process.env.GOOGLE_OAUTH_KEY || '393842kjh627090-5acn4hfn1j7f776gni8sgjhequp8dh5i.apps.googleusercontent.com',
            secret: process.env.GOOGLE_OAUTH_SECRET || 'cAFio2A0KOMq2eiuSnwOpGbOkljz',
            reCaptchaSecret: '6LfjNjEUAAAAAH04tVC0N5GiMkG544exLBEihkaiahju',
            reCaptcharVerifyUrl: 'https://www.google.com/recaptcha/api/siteverify'
        },
        github:{
            key: process.env.GITHUB_OAUTH_KEY || '',
            secret: process.env.GITHUB_OAUTH_SECRET || ''
        },
        twitter: {
            key: process.env.TWITTER_OAUTH_KEY || 'vdrg4sqxyTPSRdJHKu4UVVdeD',
            secret: process.env.TWITTER_OAUTH_SECRET || 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA'
        },
        tumblr: {
            key: process.env.TUMBLR_OAUTH_KEY || '',
            secret: process.env.TUMBLR_OAUTH_SECRET || ''
        },
        instagram: {
            key: process.env.INSTAGRAM_OAUTH_KEY || '',
            secret: process.env.INSTAGRAM_OAUTH_SECRET || ''
        },
        linkedin: {
            key: process.env.LINKEDIN_OAUTH_KEY || '',
            secret: process.env.LINKEDIN_OAUTH_SECRET || ''
        }
    }
};
