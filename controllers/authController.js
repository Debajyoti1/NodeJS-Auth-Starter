const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
const sendMail = require('../configs/mail')

//------------ User Model ------------//
const User = require('../models/user');

module.exports.dashboardPage = (req, res) => {
    res.render('dashboard', { title: 'Dashboard' })
}

module.exports.loginPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard')
    }
    res.render('login', { title: 'Login' })
}
//------------ Login Handle ------------//
module.exports.loginHandle = (req, res) => {
    // console.log('handle started');
    if (req.isAuthenticated()) {
        req.flash('success', 'Logged in successful')
        return res.redirect('/dashboard')
    }
    return res.redirect('/login')

}

module.exports.registerPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard')
    }
    res.render('register', {
        title: 'Register',
        success: '',
        error: ''
    })
}
module.exports.forgotPage = (req, res) => {
    res.render('forgot', {
        title: 'Forgot Password'
    })
}

module.exports.registerHandle = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard')
    }
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        req.flash('error', errors[0])
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            title: "Register",
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(async user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    title: "Register",
                });
            }
            else {

                const token = jwt.sign({ name, email, password }, JWT_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/auth/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `;

                let mailStatus = await sendMail(output, email)
                if (mailStatus) {
                    // console.log(error);
                    req.flash(
                        'error',
                        'Something went wrong on our end. Please register again.'
                    );
                    res.redirect('/auth/login');
                }
                else {
                    console.log('Mail sent');
                    req.flash(
                        'success',
                        'Activation link sent to email ID. Please activate to log in.'
                    );
                    res.redirect('/auth/login');
                }
            }

        }
        )

    }
}



//------------ Activate Account Handle ------------//
module.exports.activateHandle = (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('dashboard', {
            title: "Dashboard"
        })
    }
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error',
                    'Incorrect or expired link! Please register again.'
                );
                res.redirect('/auth/register');
            }
            else {
                const { name, email, password } = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        //------------ User already exists ------------//
                        req.flash(
                            'error',
                            'Email ID already registered! Please log in.'
                        );
                        res.redirect('/auth/login');
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            password
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        req.flash(
                                            'success',
                                            'Account activated. You can now log in.'
                                        );
                                        res.redirect('/auth/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    }
    else {
        console.log("Account activation error!")
    }
}

//------------ Forgot Password Handle ------------//
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    let errors = [];

    //------------ Checking required fields ------------//
    if (!email) {
        errors.push({ msg: 'Please enter an email ID' });
    }

    if (errors.length > 0) {
        res.render('forgot', {
            errors,
            email,
            title: 'Forgot Password'
        });
    } else {
        let user = await User.findOne({ email: email })
        if (!user) {
            //------------ User already exists ------------//
            errors.push({ msg: 'User with Email ID does not exist!' });
            res.render('forgot', {
                errors,
                email,
                title: 'Forgot Password'
            })
        }
        else {
            const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
            const CLIENT_URL = 'http://' + req.headers.host;
            const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/auth/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;
            let err = false
            try {
                await User.updateOne({ resetLink: token })
            }

            catch (err) { err = true }

            if (err) {
                errors.push({ msg: 'Error resetting password!' });
                res.render('forgot', {
                    errors,
                    email,
                    title: 'Forgot Password'
                });
            }
            else {

                let mailStatus = await sendMail(output, email)
                if (mailStatus) {
                    // console.log(error);
                    req.flash(
                        'error',
                        'Something went wrong on our end. Please register again.'
                    );
                    res.redirect('/auth/forgot');
                }
                else {
                    console.log('Mail sent');
                    req.flash(
                        'success',
                        'Password reset link sent to email ID. Please follow the instructions.'
                    );
                    res.redirect('/auth/login');
                }
            }
        }
    }
}


//------------ Redirect to Reset Handle ------------//
module.exports.gotoReset = async (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, async (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error',
                    'Incorrect or expired link! Please try again.'
                );
                res.redirect('/auth/login');
            }
            else {
                const { _id } = decodedToken;
                let user = await User.findById(_id)
                if (!user) {
                    req.flash(
                        'error',
                        'User with email ID does not exist! Please try again.'
                    );
                    res.redirect('/auth/login');
                }
                else {
                    res.redirect(`/auth/reset/${_id}`)
                }
            }
        }
        )
    }
}

module.exports.resetPage = async (req, res) => {
    const id = req.params.id;
    try {
        let user = await User.findById(id)
        return res.render('reset', {
            title: 'Reset Password',
            id: req.params.id
        })
    }
    catch (err) {
        req.flash(
            'error',
            'User with email ID does not exist! Please try again.'
        );
        res.redirect('/auth/login');

    }

}

module.exports.resetPassword = async (req, res) => {
    var { password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];
    let user = await User.findById(id)
    if (!user) {
        req.flash(
            'error',
            'User with email ID does not exist! Please try again.'
        );
        res.redirect('/auth/login');
    }
    //------------ Checking required fields ------------//
    if (!password || !password2) {
        req.flash(
            'error',
            'Please enter all fields.'
        );
        res.redirect(`/auth/reset/${id}`);
    }

    //------------ Checking password length ------------//
    else if (password.length < 8) {
        req.flash(
            'error',
            'Password must be at least 8 characters.'
        );
        res.redirect(`/auth/reset/${id}`);
    }

    //------------ Checking password mismatch ------------//
    else if (password != password2) {
        req.flash(
            'error',
            'Passwords do not match.'
        );
        res.redirect(`/auth/reset/${id}`);
    }

    else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, async (err, hash) => {
                if (err) throw err;
                password = hash;

                err = false
                try {
                    let updated = await User.findByIdAndUpdate({ _id: id }, { password })
                }
                catch (err) { err = true }

                if (err) {
                    req.flash(
                        'error',
                        'Error resetting password!'
                    );
                    res.redirect(`/auth/reset/${id}`);
                } else {
                    req.flash(
                        'success',
                        'Password reset successfully!'
                    );
                    res.redirect('/auth/login');
                }
            }
            );

        });
    }
}




//------------ Logout Handle ------------//
module.exports.logoutHandle = (req, res) => {
    req.logout((err) => {
        console.log(err);
    });
    req.flash('success', 'You are logged out');
    res.redirect('/auth/login');
}