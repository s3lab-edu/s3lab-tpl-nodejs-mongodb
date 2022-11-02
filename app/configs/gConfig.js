module.exports = {
    https: false,
    port: 3000,
    url: 'https://localhost:3000/',
    authenticationkey: 'fdhjfdfuejfkjdhfaueyrujhgesfhjs',
    paths:{
        public: '/public',
        tmp: '/tmp',
        docs:'/docs',
    },
    mongodb: {
        uri: 'mongodb+srv://dientv:dientv@cluster0.c4eivn9.mongodb.net/?retryWrites=true&w=majority',
    },
    socialNetwork: {
        // OAuth 2.0
        facebook:{
            key: '',
            secret: '6c0d7108856b7599eb8e17024f37f251'
        },
        google:{
            key: '393842kjh627090-5acn4hfn1j7f776gni8sgjhequp8dh5i.apps.googleusercontent.com',
            secret: 'cAFio2A0KOMq2eiuSnwOpGbOkljz',
            reCaptchaSecret: '6LfjNjEUAAAAAH04tVC0N5GiMkG544exLBEihkaiahju',
            reCaptcharVerifyUrl: 'https://www.google.com/recaptcha/api/siteverify'
        },
        github:{
            key: '',
            secret: ''
        },
        twitter: {
            key: 'vdrg4sqxyTPSRdJHKu4UVVdeD',
            secret: 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA'
        },
        tumblr: {
            key: '',
            secret: ''
        },
        instagram: {
            key: '',
            secret: ''
        },
        linkedin: {
            key: '',
            secret: ''
        }
    }
};
