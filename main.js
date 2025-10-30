(function(){
    var USERS_KEY = 'smart_users';
    var SESSION_KEY = 'smart_session_email';

    var loginView = document.getElementById('loginView');
    var signupView = document.getElementById('signupView');
    var homeView = document.getElementById('homeView');

    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');
    var loginMsg = document.getElementById('loginMsg');
    var signupMsg = document.getElementById('signupMsg');

    var goToSignup = document.getElementById('goToSignup');
    var goToSignin = document.getElementById('goToSignin');
    var welcomeName = document.getElementById('welcomeName');
    var logoutBtn = document.getElementById('logoutBtn');

    function getUsers(){
        var raw = localStorage.getItem(USERS_KEY);
        if(!raw){ return []; }
        try{ return JSON.parse(raw) || []; }catch(e){ return []; }
    }

    function saveUsers(users){
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function findUserByEmail(email){
        var users = getUsers();
        for(var i=0;i<users.length;i++){
            if(users[i].email.toLowerCase() === String(email).toLowerCase()){
                return users[i];
            }
        }
        return null;
    }

    function setSession(email){
        localStorage.setItem(SESSION_KEY, String(email));
    }

    function getSessionEmail(){
        return localStorage.getItem(SESSION_KEY);
    }

    function clearSession(){
        localStorage.removeItem(SESSION_KEY);
    }

    function show(el){ el.classList.remove('d-none'); }
    function hide(el){ el.classList.add('d-none'); }

    function showView(name){
        hide(loginView); hide(signupView); hide(homeView);
        if(name === 'login'){ show(loginView); }
        else if(name === 'signup'){ show(signupView); }
        else if(name === 'home'){ show(homeView); }
    }

    function setText(el, text, cls){
        el.className = 'small text-center mb-3';
        if(cls){ el.className += ' ' + cls; }
        el.innerHTML = text || '';
    }

    function isEmail(str){
        var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
        return re.test(String(str).toLowerCase());
    }

    function init(){
        
        var sessionEmail = getSessionEmail();
        if(sessionEmail){
            var u = findUserByEmail(sessionEmail);
            if(u){
                welcomeName.innerHTML = sanitize(u.name || u.email);
                showView('home');
            }else{
                clearSession();
                showView('login');
            }
        }else{
            showView('login');
        }
    }

    function sanitize(str){
        return String(str || '').replace(/[&<>"']/g,function(c){
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c];
        });
    }

 
    if(goToSignup){
        goToSignup.onclick = function(e){ e.preventDefault(); setText(loginMsg,''); showView('signup'); };
    }
    if(goToSignin){
        goToSignin.onclick = function(e){ e.preventDefault(); setText(signupMsg,''); showView('login'); };
    }

 
    if(signupForm){
        signupForm.onsubmit = function(e){
            e.preventDefault();
            var name = document.getElementById('suName').value.replace(/^\s+|\s+$/g,'');
            var email = document.getElementById('suEmail').value.replace(/^\s+|\s+$/g,'');
            var password = document.getElementById('suPassword').value;

            if(!name || !email || !password){
                setText(signupMsg, 'enter the in but', 'text-danger');
                return;
            }
            if(!isEmail(email)){
                setText(signupMsg, 'cheik yor email ', 'text-danger');
                return;
            }
            if(password.length < 6){
                setText(signupMsg, 'minmom 6 numper', 'text-danger');
                return;
            }
            if(findUserByEmail(email)){
                setText(signupMsg, 'email already exists', 'text-danger');
                return;
            }

            var users = getUsers();
            users.push({name:name, email:email, password:password});
            saveUsers(users);
            setText(signupMsg, 'trou', 'text-success');
            
            setTimeout(function(){ setText(signupMsg,''); showView('login'); }, 800);
        };
    }

   
    if(loginForm){
        loginForm.onsubmit = function(e){
            e.preventDefault();
            var email = document.getElementById('loginEmail').value.replace(/^\s+|\s+$/g,'');
            var password = document.getElementById('loginPassword').value;

            if(!email || !password){
                setText(loginMsg, 'please enter your email and pasword', 'text-danger');
                return;
            }
            var user = findUserByEmail(email);
            if(!user){
                setText(loginMsg, 'erorr', 'text-danger');
                return;
            }
            if(user.password !== password){
                setText(loginMsg, 'paswourd erorr', 'text-danger');
                return;
            }

            setSession(user.email);
            welcomeName.innerHTML = sanitize(user.name || user.email);
            setText(loginMsg,'','');
            showView('home');
        };
    }

    
    if(logoutBtn){
        logoutBtn.onclick = function(){
            clearSession();
            showView('login');
        };
    }

 
    init();
})();