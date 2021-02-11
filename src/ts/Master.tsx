import React from 'react';
import cookie from 'react-cookies';
import crypto from 'crypto-js';
import dotenv from "dotenv";

import '../style/Master.css';
import DashBoard from './DashBoard';
import Header from './Header';

import { DBServer, GetServersNet } from '../../Types';
import { Login } from './Login';
import { Footer } from './Footer';
dotenv.config();


interface Props {};
interface States {
    User?: User,
    Servers: Array<DBServer>
}

export interface User {
    name?: string,
    passwd?: string,
    token?: string
}

class Master extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);

        this.state = {
            User: undefined,
            Servers: []
        }

    }

    async componentDidMount() {
        // CheckCookie For Login
        console.log(process.env);
        if (cookie.load("User") && process.env["REACT_APP_KRMS_CRYPTO_KEY"]) {
            let User: User = JSON.parse(crypto.AES.decrypt(cookie.load("User"), process.env["REACT_APP_KRMS_CRYPTO_KEY"]).toString(crypto.enc.Utf8));
            if (User.name && User.token) {
                console.log(User);
                this.LoginSuccess(User.name, User.token);
            }
        }
    }

    LoginSuccess(name: string, token: string) {
        this.setState({
            User: {
                name: name,
                token: token
            }
        });
    }

    Logout() {
        cookie.remove("User");
        this.setState({
            User: undefined
        })
    }

    render() {
        return(
            <>
                <Header User={this.state.User} Logout={this.Logout.bind(this)} />
                {this.state.User?
                    <DashBoard User={this.state.User}/> :
                    <Login success={this.LoginSuccess.bind(this)} />
                }
                <Footer />
            </>
        )
    }
}

export default Master;
