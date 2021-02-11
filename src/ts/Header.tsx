import React from 'react';

import '../style/Header.css';
import { User } from './Master';


interface Props {
    User?: User,
    Logout: Function
}

interface States {
    UserMenu: boolean
}

class Header extends React.Component<Props, States> {

    constructor(props: Props) {
        super(props);
        this.state = {
            UserMenu: false
        }
    }

    ChangeUserMenu() {
        this.setState({
            UserMenu: !this.state.UserMenu
        })
    }

    render() {
        return (
            <div className="Header">

                <div className="PageTitle">
                    <div className="middle"><span>Kunrai Monitoring System</span></div>
                </div>


                <div className="UserAccount UserAccountWarp">
                    <div className="UserAccount">
                        <div className="middle">{(this.props.User)? this.props.User.name : "Login"}</div>
                    </div>

                    {this.props.User&&
                        <div className="UserAccountDropDown">
                            <span>{this.props.User.name}</span>
                            <span>계정 정보</span>
                            <span onClick={this.props.Logout.bind(this)}>Logout</span>
                        </div>
                    }
                </div>

            </div>
        )
    }
}


export default Header;