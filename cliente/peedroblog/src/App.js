import React from 'react';
import './App.css';
import './style.css';
import logo1 from './img/logo.svg';
import logo2 from './img/logo2.svg';
import loadGif from './img/loading.gif';
import menu from './img/menu.png';
import iconBanner from './img/iconBanner.png';
import playButton from './img/playButton.png';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import lupa from './img/lupa.png';

const jwt = require("jsonwebtoken");


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            campoBusca: "",
            hiddenMenu: "none",
            id: "",
            email: "",
            campoEmail: "",
            campoSenha: "",
            campoTitulo: "",
            campoConteudo: "",
            campoId: "",
            foto: "",
            msgErro: "",
            color: "",
            logado: false,
            right: "none",
            displayErro: "none",
            msgLoad: "none",
            msgEnviaChar: "",
            dadosUser: "none",
            postArea: "none",
            btnCadastro: "inline-block",
            doisBr: "inline-block",
            brLoad: "none",
            btnSair: "none",
            btnLogar: "inline-block",
            logou: false,
            token: "",
            isAdm: false,
        }
    }

    componentDidMount() {

        this.teste();

        var token = this.getToken();

        if (this.isLogado(token)) {

            this.showDadosLogado();
            this.verificaAdm(token);
            this.atualizaPosts();

        }

        else console.log("Não foi logado automaticamente!");
    }

    teste() {
        const axios = require('axios');

        axios.get('https://servidorpedro.herokuapp.com/teste/')
            .then(((response) => {
                console.log("RESPOSTA: " + response.data.msg);
            }))
    }

    getToken() {
        if (sessionStorage.getItem('token') == null) {
            return '';
        }

        else return sessionStorage.getItem('token');
    }

    verificaAdm = (token) => {

        const axios = require('axios');

        axios.post('https://servidorpedro.herokuapp.com/isAdm/', {
            token: token
        })
            .then(((response) => {

                if (response.data.isAdm) {
                    this.setState({
                        isAdm: true,
                        right: "inline-block",
                        postArea: "inline-block"
                    });

                    console.log("Bem vindo, administrador!");
                }

                else {

                    this.setState({
                        right: "none",
                        postArea: "inline-block"
                    });

                    console.log("Bem vindo, usuário!");
                }

                this.setState({
                    brLoad: "none",
                    displayErro: "inline-block"
                });

            }));
    }

    sair() {

        sessionStorage.removeItem("token");

        this.setState({
            logado: false,
            right: "none",
            postArea: "none",
            btnSair: "none",
            btnLogar: "inline-block",
            btnCadastro: "inline-block",
            displayErro: "none",
            isAdm: false
        });

    }

    isLogado(token) {

        const jwtKey = 'p3dr0rr3ir0';

        try {

            if (sessionStorage.getItem("token") === '') {
                //console.log("nao ta logado");
                return false;
            }

            else if (jwt.verify(token, jwtKey).email !== '') {
                //console.log("ta logado");
                return true;
            }

        } catch (JsonWebTokenError) {
            console.log("Token not found to login");
        } return false;
    }

    showDadosLogado() {
        this.setState(
            {
                email: "",
                senha: "",
                doisBr: "none",
                right: "none",
                postArea: "inline-block",
                logado: true,
                btnSair: "inline-block",
                btnCadastro: "none",
                btnLogar: "none",
            });

        this.atualizaPosts();
    }

    loginRequest() {

        this.setState({

            displayErro: "none",
            msgLoad: "inline-block",
            brLoad: "inline-block"

        });

        const axios = require('axios');

        let email = this.state.campoEmail;
        let senha = this.state.campoSenha;

        if (email === "" || senha === "") {
            this.setState({
                msgErro: "Campos Vazios!",
                color: "red",
                displayErro: "inline-block",
                msgLoad: "none"
            });
        }

        else {
            axios.post('https://servidorpedro.herokuapp.com/logar/', {
                email: email,
                senha: senha
            }).then(((response) => {

                this.setState({ // zera campos da tela de login
                    msgErro: response.data.msg,
                    color: response.data.cor,
                    token: response.data.token,

                    displayErro: "inline-block",
                    msgLoad: "none",
                    brLoad: "none"
                })

                if (response.data.sucess) {

                    this.showDadosLogado();

                    sessionStorage.setItem('token', this.state.token);

                    this.verificaAdm(this.state.token);

                }


            })).catch((error) => {
                console.log("Erro login");

                this.setState({
                    msgErro: "Erro no login!",
                    color: "red"
                });
            });
        }
    }

    cadastroRequest = () => {

        this.setState({
            displayErro: "none"
        })

        const axios = require('axios');

        let gmail = "@gmail.com";
        let hotmail = "@hotmail.com";
        let reqres = "@reqres.in";

        let tamanhoGmail = gmail.length; // 10
        let tamanhoHotmail = hotmail.length; // 12
        let tamanhoReqres = reqres.length; // 10

        let email = this.state.campoEmail;
        let senha = this.state.campoSenha;

        if (email === "" || senha === "") {
            this.setState({
                displayErro: "inline-block",
                msgErro: "Campos vazios!",
                color: "red"
            })
        }

        else if (email.length < 3 || senha.length < 3) {
            this.setState({
                displayErro: "inline-block",
                msgErro: "Os campos devem ter no mínimo 3 caracteres",
                color: "red"
            })
        }

        else {

            if ((email.substring((email.lenght, (email.length - tamanhoGmail))) === gmail) ||
                (email.substring((email.lenght, (email.length - tamanhoHotmail))) === hotmail ||
                    (email.substring((email.lenght, (email.length - tamanhoReqres))) === reqres)
                )
            ) {

                this.setState({
                    displayErro: "none",
                    msgLoad: "inline-block"
                })

                axios.post('https://servidorpedro.herokuapp.com/cadastrar/', {
                    email: email,
                    password: senha
                }).then(((response) => {

                    this.setState({
                        msgErro: response.data.msg,
                        color: response.data.cor,
                        displayErro: "inline-block",
                        msgLoad: "none"
                    });

                })).catch((error) => {
                    console.log("Erro no cadastro");

                    this.setState({
                        displayErro: "inline-block",
                        msgErro: "Erro no cadastro!",
                        color: "red"
                    });
                });
            }

            else {
                this.setState({
                    displayErro: "inline-block",
                    msgErro: "O campo não corresponde ao formato de e-mail",
                    color: "red"
                });

            }
        }
    }

    changeTitulo = (event) => {
        this.setState({
            campoTitulo: event.target.value
        })
    }

    changeConteudo = (event) => {
        this.setState({
            campoConteudo: event.target.value
        })
    }

    changeEmail = (event) => {
        this.setState({
            campoEmail: event.target.value
        })
    }


    changeSenha = (event) => {
        this.setState({
            campoSenha: event.target.value
        })
    }

    changeId = (event) => {
        this.setState({
            campoId: event.target.value
        })
    }

    showMenu = () => {

        if (this.state.hiddenMenu === "inline-block") this.setState({ hiddenMenu: "none" });

        else this.setState({ hiddenMenu: "inline-block" });
    }

    pesquisarChar() {

        this.setState({
            msgEnviaChar: ""
        })

    }

    changeBusca = (event) => {
        this.setState({
            campoBusca: event.target.value
        })
    }

    postar = () => {
        const titulo = this.state.campoTitulo;
        const conteudo = this.state.campoConteudo;
        const token = this.getToken();

        const axios = require("axios");

        axios.post('https://servidorpedro.herokuapp.com/post/', {
            titulo: titulo,
            conteudo: conteudo,
            token: token
        })
            .then(((response) => {
                console.log(response.data.msg);

                this.atualizaPosts();
            }));

    }

    async getEmailByToken() {
        const jwtKey = 'p3dr0rr3ir0';

        var token = this.getToken();

        return await jwt.verify(token, jwtKey).email;

    }

    atualizaPosts() {

        const axios = require("axios");

        axios.get('https://servidorpedro.herokuapp.com/posts/')
            .then(((response) => {
                this.setState({
                    posts: response.data.posts
                })
            }));
    }

    buscaPosts = () => {

        var busca = this.state.campoBusca;

        const axios = require("axios");

        axios.get('https://servidorpedro.herokuapp.com/buscaPosts/' + busca)
            .then(((response) => {
                this.setState({
                    posts: response.data.posts
                })
            }));
    }

    render() {
        return (
            <div className="wrapper" resize={this.resize}>
                <header >

                    <div id="contentHeader">
                        <div className="imgsLogo">
                            <img id="logo1" src={logo1} alt="logo" />
                            <img id="logo2" src={logo2} alt="logo2" />
                        </div>

                        <nav className="navMain">
                            <ul>
                                <li className="itemBar">
                                    <a href="/#">Documentation</a>
                                </li>

                                <li className="itemBar">
                                    <a href="/#">Forge</a>
                                </li>

                                <li className="itemBar">
                                    <a href="/#">Ecosystem</a>

                                </li>

                                <li className="itemBar">
                                    <a href="/#">News</a>
                                </li>

                                <li className="itemBar">
                                    <a href="/#">Partners</a>
                                </li>

                            </ul>
                        </nav>

                        <div style={{ display: this.state.doisBr }}><br /><br /><br /></div>


                    </div>

                    <div id="botoes2" style={{ textAlign: "center" }}>
                        <div style={{ textAlign: "center", display: this.state.btnLogar }}>
                            <Popup trigger={<button id="btnEntrar"><strong>Entrar</strong></button>} modal position="right center">
                                <div id="loginBox">

                                    <span>Email</span><br />
                                    <input id="user" type="email" disabled={this.state.logado} onChange={this.changeEmail}
                                        style={{ width: "75%" }} /><br /><br />

                                    <span>Senha</span><br />

                                    <input id="senha" type="password" disabled={this.state.logado} onChange={this.changeSenha}
                                        style={{ width: "75%" }} />

                                    <button id="btnCadastro"
                                        disabled={this.state.logado}
                                        style={{ display: this.state.btnCadastro, width: "75%", marginBottom: "10px" }}
                                        onClick={this.cadastroRequest}>
                                        Cadastrar
                                          </button>

                                    <span id="doisBr" style={{ display: this.state.doisBr }}><br /><br /></span>

                                    <button id="btnLogin"
                                        disabled={this.state.logado}
                                        onClick={this.loginRequest.bind(this)}
                                        style={{ width: "75%", display: this.state.btnLogar }}><strong>Entrar</strong>

                                    </button>

                                    <br /> <br />

                                    <div id="msgLoad" style={{ display: this.state.msgLoad }}>
                                        <img src={loadGif} alt="loading" style={{ width: 50 + 'px', height: 50 + 'px' }} />
                                    </div>

                                    <div id="msgErro"><p style={{
                                        display: this.state.displayErro,
                                        textAlign: "center",
                                        border: "1px solid black",
                                        borderRadius: 7 + "px",
                                        paddingRight: 25 + "px",
                                        paddingLeft: 25 + "px",
                                        paddingTop: 5 + "px",
                                        paddingBottom: 5 + "px",
                                        backgroundColor: this.state.color,
                                        color: "white"
                                    }
                                    }>{this.state.msgErro}</p></div>

                                </div>
                            </Popup>

                        </div>

                        <br />

                        <div style={{ textAlign: "center" }}>
                            <button id="btnEntrar"
                                style={{ display: this.state.btnSair, marginLeft: "10px" }}
                                onClick={this.sair.bind(this)}
                            ><strong>Sair</strong>
                            </button>
                        </div>

                    </div>

                    <div id="hiddenMenu" onClick={this.showMenu}>
                        <img id="menuIcon" style={{ width: 40 + 'px' }} src={menu} alt="menunIcon" />

                        <ul style={{ display: this.state.hiddenMenu }}>
                            <li className="itemBar">
                                <a href="/#">Documentation</a>
                            </li>

                            <hr />

                            <li className="itemBar">
                                <a href="/#">Forge</a>
                            </li>

                            <hr />

                            <li className="itemBar">
                                <a href="/#">Ecosystem</a>
                            </li>

                            <hr />

                            <li className="itemBar">
                                <a href="/#">News</a>
                            </li>

                            <hr />

                            <li className="itemBar">
                                <a href="/#">Partners</a>
                            </li>

                            <hr />

                        </ul>
                    </div>

                </header>

                <div id="banner">

                    <img src={iconBanner} alt="iconBanner" />

                    <div>
                        <span>Laravel Vapor is now Available! Sign up today! -</span>
                    </div>

                </div>

                <div id="corpo">

                    <div id="left">

                        <div id="bigBox">

                            <div id="content">
                                <h1>The PHP Framework for Web Artisans</h1>

                                <p>Laravel is a web application framework with expressive, elegant syntax. We’ve already laid the foundation — freeing you to create without sweating the small things.</p>

                                <div id="botoes">
                                    <div id="vermelho">
                                        <span>Documentation</span>
                                    </div>

                                    <div id="branco">
                                        <div id="contentButton">
                                            <img style={{ height: 25 + "px" }} src={playButton} alt="playButton" />
                                            <span style={{ position: "relative", bottom: 7 + "px", marginLeft: 5 + "px", textAlign: "center" }}>Watch Laracasts</span>

                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div id="right" style={{ display: this.state.right }}>

                        <div id="updateChar">
                            <form method="post" encType="multipart/form-data" action="/upChar" >

                                <input type="hidden" name="token" value={this.getToken()} />

                                <p style={{ color: "black", fontWeight: "bolder" }}>Mudar avatar</p>
                                <input type="file" name="arquivo"></input>

                                <br /><br />

                                <input type="submit" disabled value="Atualizar (Manutenção)" className="btnVermelho"></input>
                            </form>
                        </div>

                        <hr></hr>

                        <div id="postar">
                            <p style={{ color: "black", fontWeight: "bolder" }}>Postagem</p>

                            <span>Título </span><br />
                            <input type="text" onChange={this.changeTitulo}></input>
                            <br /><br />
                            <span>Conteúdo: </span><br />
                            <textarea type="text" onChange={this.changeConteudo}></textarea><br /><br />
                            <button className="btnVermelho" onClick={this.postar}>Postar</button>
                        </div>


                    </div>

                </div>

                <div id="areaPosts" style={{ display: this.state.postArea }}>

                        <div id="pequisar">
                            <p style={{ display: "inline-block", marginRight: 5 + "px" }}>Pesquisar:</p>
                            <input onChange={this.changeBusca}></input>

                            <img src={lupa} alt="{lupa" id="lupa" onClick={this.buscaPosts}></img>
                        </div>
                        {this.state.posts.map(function (post, i) {
                            return (
                                <ul key={post.titulo}>
                                    <div id="post">
                                        <li id="emailPost"><strong>Contato: </strong>{post.email}</li>
                                        <li id="tituloPost">{post.titulo}</li>
                                        <li id="contPost">{post.conteudo}</li>
                                    </div>
                                </ul>
                            );
                        })}

                    </div>

            </div>

        );

    }
}

export default App;
