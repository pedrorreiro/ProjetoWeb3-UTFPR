const { write } = require("fs");

let http = require("http"),
    path = require("path"),
    express = require("express"),
    bodyParser = require('body-parser'),
    app = express();

    app.use(bodyParser.urlencoded({extended: true}));

const jwt = require("jsonwebtoken");

const session = require('express-session');

const multer = require('multer');

const cors = require('cors');

const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, "chars/");
    }, 
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({storage});

const jwtKey = 'p3dr0rr3ir0';

contas = require("./model/Contas");

//app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(session({
    secret: jwtKey,
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static(path.resolve(__dirname, "build")));

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.get("/", (req, res) => {
    res.send("oii");
})

app.get('/teste', (req,res) => {
    res.send({msg: "oi"});
})

app.post('/cadastrar/', async (req, res) =>{

    let email = req.body.email;
    let senha = req.body.password;

    const isRegister = await contas.cadastrar(email,senha);

    if(isRegister) res.status(200).send({msg: 'Cadastro com sucesso!', cor: 'green'});

    else res.status(200).send({msg: 'Conta já existe!', cor: 'orange'});

});

app.post('/logar/', async (req, res) =>{

    let email = req.body.email;
    let senha = req.body.senha;

    const sucessLogin = await contas.logar(email,senha);

    if(sucessLogin){
        const token = jwt.sign({
            email: email,
        }, jwtKey);
    
        jwt.verify(token, jwtKey, async function(err, decoded) {
            if (err) return res.status(500).send({ auth: false, sucess: false, cor: 'red', msg: 'Failed to authenticate token.' });
            
            res.send({msg: 'Logado!', sucess: true, cor: 'green', token: token, email: email});
        });
    }

    else res.send({msg: 'Dados incorretos!', cor: 'black', sucess: false});
    
});

app.post('/isAdm/', async (req, res) => {

    let token = req.body.token;

    try{
        var email = await jwt.verify(token, jwtKey).email;

    }catch(JsonWebTokenError){

    }

    const isAdm = await contas.isAdm(email);

    return res.status(200).send({isAdm: isAdm});

});

app.post('/post/', async (req, res) => {

    let id = req.body.id;
    let token = req.body.token;
    let titulo = req.body.titulo;
    let conteudo = req.body.conteudo;

    try{
        var email = await jwt.verify(token, jwtKey).email;

    }catch(JsonWebTokenError){
        console.log("token error");
    }

    if(email === null || email === ''){ // ele pega o email referente ao token. Caso o token não for válido, o email vai ser null
        res.send({msg: "authentication error!"});
    }

    else{
        await contas.enviaPost(titulo,conteudo,email);
        res.send({msg: "postado!"});
    }

});

app.get('/posts/', async (req, res) => {

    var token = req.headers.authorization;

    try{
        var email = await jwt.verify(token, jwtKey).email;

    }catch(JsonWebTokenError){
        console.log("token error");
    }

    if(email === null || email === ''){ // ele pega o email referente ao token. Caso o token não for válido, o email vai ser null
        res.send({msg: "authentication error!"});
    }

    else{
        var posts = await contas.getPosts("");

        res.send({posts: posts});
    }


});

app.get('/buscaPosts/:busca', async (req, res) => {

    var token = req.headers.authorization;

    try{
        var email = await jwt.verify(token, jwtKey).email;

    }catch(JsonWebTokenError){
        console.log("token error");
    }

    if(email === null || email === ''){ // ele pega o email referente ao token. Caso o token não for válido, o email vai ser null
        res.send({msg: "authentication error!"});
    }

    else{
        var busca = req.params.busca;

        var posts = await contas.getPosts(busca);

        res.send({posts: posts});
    }

});

app.post('/upChar/', upload.single('arquivo'), async (req, res) => {

    var token = req.body.token;

    var filePath = req.file.filename;

    console.log("path: " + filePath);
    
    try{
        var email = await jwt.verify(token, jwtKey).email;

    }catch(JsonWebTokenError){

    }

    const sucessUpload = await contas.enviaChar(email, filePath);

    res.redirect('/');


})

app.get('/getChar/', async (req, res) => {

    res.send('<img alt="img" src=chars/Pato.png </img>');


})


app.listen(process.env.PORT || 5000, 
	() => console.log("Server is running..."));
