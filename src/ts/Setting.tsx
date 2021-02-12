import React from 'react';
import { DBServer } from '../../Types';
import '../style/Setting.css';
import { User } from './Master';

interface SettingProps {
    Update: Function,
    Close: Function,
    Server?: DBServer,
    User: User
}
interface SettingStates {
    WarningMessage?: string
}

export class Setting extends React.Component<SettingProps, SettingStates> {
    

    constructor(props: SettingProps) {
        super(props);
        this.state = {
            WarningMessage: ""
        }
    }

    RenameInput: HTMLInputElement | null = null;
    async RenameServer() {
        if (!this.RenameInput || !this.RenameInput.value) return this.setState({WarningMessage: "입력값이 비었습니다."});

        let ServerResponse: Response = await fetch(`https://${process.env["REACT_APP_KRMS_SERVER_ADDRESS"]}/RenameServer`, {
            method: "POST",
            body: JSON.stringify({
                token: this.props.User.token,
                macaddr: this.props.Server?.macaddr,
                NewName: this.RenameInput.value
            }),
            headers: {"content-type": "application/json"}
        });
        let ServerMessage: {msg: string, err: string} = await ServerResponse.json();
        if (ServerMessage.err) {
            this.setState({
                WarningMessage: ServerMessage.err
            })
        } else {
            this.setState({
                WarningMessage: ServerMessage.msg
            });
            this.props.Update();
        }
    }

    render() {
        return(
            <div className="Setting">
                <div className="SettingHeader">   
                    <span className="SettingTitle">서버 설정</span>
                    <span className="fas SettingClose" onClick={() => {this.props.Close()}}></span>
                </div>

                <div className="SettingBody">
                    <div className="SettingField">
                        <div className="SettingFieldTitle">서버 이름</div>
                        <input ref={(e)=>{this.RenameInput = e}} className="ChangeServerName" type="text" placeholder={this.props.Server?.name} /> <button onClick={this.RenameServer.bind(this)} className="ChangeServerNameBtn">Confirm</button>
                    </div>
                    {this.state.WarningMessage&& <div className="SettingWarning">{this.state.WarningMessage}</div>}
                </div>
            </div>
        )
    }
}