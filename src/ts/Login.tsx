import React from 'react';
import cookie from 'react-cookies';
import crypto from 'crypto-js';
import dotenv from "dotenv";

import '../style/Login.css';

import { LoginNet } from '../../Types';
dotenv.config();


interface LoginProps {
    success: Function
}
interface LoginState {
    ServerResponse: string | undefined
}
export class Login extends React.Component<LoginProps, LoginState> {
    InputID: HTMLInputElement | null = null;
    InputPW: HTMLInputElement | null = null;
    InputRememberUser: HTMLInputElement | null = null;

    async requestLogin() {
        if (!(this.InputID && this.InputPW && this.InputRememberUser)) return;

        let ServerRequest = await fetch(`https://${process.env["REACT_APP_KRMS_SERVER_ADDRESS"]}/Login`, {
            method: "POST",
            body: JSON.stringify({name: this.InputID.value, passwd: this.InputPW.value}),
            headers: {"content-type": "application/json"}
        });
        
        let ServerResponse: LoginNet = await ServerRequest.json();
        if (ServerResponse.err)
            this.setState({
                ServerResponse: ServerResponse.err
            })
        else {
            if (this.InputRememberUser.checked) this.RememberUser(ServerResponse.name, ServerResponse.token);
            this.props.success(ServerResponse.name, ServerResponse.token);
        }
    }

    async requestRegister() {
        if (!(this.InputID && this.InputPW && this.InputRememberUser)) return;

        
        let ServerRequest = await fetch(`https://${process.env["REACT_APP_KRMS_SERVER_ADDRESS"]}/Register`, {
            method: "POST",
            body: JSON.stringify({name: this.InputID.value, passwd: this.InputPW.value}),
            headers: {"content-type": "application/json"}
        });
        
        let ServerResponse: LoginNet = await ServerRequest.json();
        if (ServerResponse.err)
            this.setState({
                ServerResponse: ServerResponse.err
            })
        else {
            if (this.InputRememberUser.checked) this.RememberUser(ServerResponse.name, ServerResponse.token);
            this.props.success(ServerResponse.name, ServerResponse.token);
        }
    }

    RememberUser(ID: string, Token: string) {
        let expires = new Date();
        expires.setDate(expires.getDate() + 14);
        let User = {
            name: ID,
            token: Token
        }
        if (process.env["REACT_APP_KRMS_CRYPTO_KEY"])
            cookie.save("User", crypto.AES.encrypt(JSON.stringify(User), process.env["REACT_APP_KRMS_CRYPTO_KEY"]).toString(), {
                expires: expires
            });
    }

    render() {
        return (
            <div className="Login">
                <span className="LoginTitle">로그인</span>
                <input type="text" className="LoginInputField" placeholder="ID" ref={(e) => {this.InputID = e}}/>
                <input type="password" className="LoginInputField" placeholder="PW" ref={(e) => {this.InputPW = e}}/>

                {this.state&& <span className="LoginServerResponse">{this.state.ServerResponse}</span>}
                <div className="LoginBtns">
                    <button className="RegisterSubmit" onClick={this.requestRegister.bind(this)}>계정 생성</button>
                    <button className="LoginSubmit" onClick={this.requestLogin.bind(this)}>로그인</button>
                </div>
                <div className="LoginRemember"><span>로그인 기억</span><input type="checkbox" ref={(e) => {this.InputRememberUser = e}} /></div>
            </div>
        )
    }
}