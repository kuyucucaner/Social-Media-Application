var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const FacebookStrategy = require('passport-facebook');
const dbConfig = require('./dbConfig');
const dotenv = require('dotenv');
dotenv.config();
const mssql = require('mssql');
const registerModel = require('./models/registerModel');
const jwt = require('jsonwebtoken');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Uygulamayı istediğiniz gibi durdurabilir veya hata raporu oluşturabilirsiniz.
});
// Facebook kimlik doğrulama stratejisi
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/oauth2/redirect/facebook',
  profileFields: ['id', 'displayName', 'emails', 'photos']
},
  async function (accessToken, refreshToken, profile, cb) {
    try {
      console.log('Facebook Access Token:', accessToken);
      console.log('Facebook Refresh Token:', refreshToken);
      console.log('Facebook Profile:', profile);
      // MSSQL bağlantısı
      const pool = await mssql.connect(dbConfig);

      try {
        // Facebook kimlik doğrulama bilgileri ile sorguyu gerçekleştir
        const queryResult = await pool.request()
          .input('provider', mssql.NVarChar, 'https://www.facebook.com')
          .input('subject', mssql.NVarChar, profile.id)
          .query('SELECT * FROM Federated_Credentials WHERE Provider = @provider AND Subject = @subject');

        // Sorgu sonuçlarına göre işlemleri gerçekleştir
        if (queryResult.recordset.length === 0) {
          const newUser = {
            firstName: profile.displayName || '',
            lastName: profile.name.familyName || '',
            userName: profile.username || '',
            email: (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '',
            password: '',
          };
          console.log('Profile:', profile);

          const insertUserResult = await registerModel.registerUser(newUser);


          if (insertUserResult && insertUserResult.rowsAffected && insertUserResult.rowsAffected[0] === 1) {
            console.log('insertUserResult:', insertUserResult);

            const userId = insertUserResult.recordset && insertUserResult.recordset.length > 0 ? insertUserResult.recordset[0].Id : null;

            if (userId) {
              console.log('Kullanıcı başarıyla eklendi. Kullanıcı ID:', userId);

              // Federated Credentials tablosuna bağlantı bilgilerini ekleme işlemi
              const insertCredentialsQuery = `
              INSERT INTO Federated_Credentials (UserID, Provider, Subject)
              VALUES (@userId, @provider, @subject);
            `;

              const insertCredentialsResult = await pool.request()
                .input('userId', mssql.Int, userId)
                .input('provider', mssql.NVarChar, 'https://www.facebook.com')
                .input('subject', mssql.NVarChar, profile.id)
                .query(insertCredentialsQuery);

              console.log('insertCredentialsResult:', insertCredentialsResult);

              if (insertCredentialsResult && insertCredentialsResult.rowsAffected && insertCredentialsResult.rowsAffected[0] === 1) {
                console.log('Federated_Credentials tablosuna başarıyla eklendi.');

                // Yeni kullanıcıyı oturum açtırma işlemi
                return cb(null, {
                  id: userId.toString(),
                  name: newUser.firstName,
                  accessToken: accessToken

                });
              } else {
                console.error('Federated_Credentials tablosuna eklenirken bir hata oluştu.');
              }
            } else {
              console.error('Kullanıcı ID alınamadı. Recordset boş veya tanımsız.');
            }
          } else {
            // Hata durumunu ele alabilir veya hata mesajını loglayabilirsiniz
            console.error('Kullanıcı ekleme sorgusu beklenen sonucu döndürmedi.');
            return cb(null, false, { message: 'Kullanıcı eklenirken bir hata oluştu' });
          }
        } else {
          // Facebook hesabı daha önce uygulamaya giriş yapmış. Facebook hesabına bağlı kullanıcı kaydını al ve kullanıcıyı oturum açtır.
          const existingUser = queryResult.recordset[0];
          console.log('existingUser:', existingUser);

          // Var olan kullanıcıyı oturum açtırma işlemi
          if (existingUser && existingUser.ID !== undefined) {
            const userId = existingUser.ID.toString();
            console.log('Kullanıcı başarıyla oturum açtı. Kullanıcı ID:', userId);

            // Kullanıcı adı kontrolü
            const name = existingUser.firstName || 'Bilinmeyen';
            const realUserId = existingUser.UserID || 'null';
            const queryResult = await pool.request()
            .input('id', mssql.Int, realUserId)
            .query('SELECT * FROM Users WHERE ID = @id');
            const firstName = queryResult.recordset[0].FirstName;
            const lastName = queryResult.recordset[0].LastName;
            const userName = queryResult.recordset[0].UserName;
            const email = queryResult.recordset[0].Email;
            const photo = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined;
            return cb(null, {
              id: userId,
              name: name,
              userId : realUserId,
              firstName : firstName,
              lastName : lastName,
              userName : userName,
              email : email,
              photo : photo
            });
          } else {
            console.error('Kullanıcı ID alınamadı. existingUser veya userId tanımsız.');
            return cb(null, false, { message: 'Kullanıcı oturum açarken bir hata oluştu' });
          }
        }
      } finally {
        // Bağlantıyı kapat
        pool.close();
      }
    } catch (err) {
      // Hata durumunda işlemleri ele al
      console.error('Hata oluştu:', err);
      return cb(err);
    }
  }));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
