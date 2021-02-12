import React from 'react';
import { CpuUsageMonitor, DiskBoard, MemUsageMonitor, QuterComp, RemoveServer, Warn } from './DashComp';

import '../style/DashBoard.css';
import { DBServer, Drive, GetServerNet, GetServersNet } from '../../Types';
import * as Master from './Master';
import { ByteCal, Milisecond } from './Unitchanger';
import { Setting } from './Setting';

interface Props {
    User: Master.User
}

interface States {
    SelectedServer: DBServer | undefined,
    Servers: Array<DBServer>,
    GetSelectedServer: NodeJS.Timeout | null,
    DisplaySetting: boolean
}

class DashBoard extends React.Component<Props, States> {
    ServerSelection:HTMLSelectElement | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            SelectedServer: undefined,
            Servers: [],
            GetSelectedServer: null,
            DisplaySetting: false
        }
    }

    async componentDidMount() {
        this.GetAllServerStatus();
    }

    async GetAllServerStatus() {
        if (!(this.props.User)) return;
        let GetServersRequest = await fetch(`https://${process.env["REACT_APP_KRMS_SERVER_ADDRESS"]}/GetServers`, {
            method: "POST",
            body: JSON.stringify({token: this.props.User&& this.props.User.token}),
            headers: {"content-type": "application/json"}
        })
        let GetServersResponse: GetServersNet = await GetServersRequest.json();

        if (GetServersResponse.err) {
            console.log("GetServersErr", GetServersResponse.err);
        } else {
            this.setState({
                Servers: GetServersResponse.Servers
            });
        }
    }

    async GetSelectedServerStatus() {
        console.log("GetServer")
        if (this.state.GetSelectedServer) clearTimeout(this.state.GetSelectedServer);
        if (!(this.props.User && this.state.SelectedServer)) return;
        let GetServerRequest = await fetch(`https://${process.env["REACT_APP_KRMS_SERVER_ADDRESS"]}/GetServer`, {
            method: "POST",
            body: JSON.stringify({macaddr: this.state.SelectedServer.macaddr}),
            headers: {"content-type": "application/json"}
        })
        let GetServerResponse: GetServerNet = await GetServerRequest.json();

        if (GetServerResponse.err) {
            console.log("InterVal GetServer Err", GetServerResponse.err);
        } else {
            this.setState({
                SelectedServer: GetServerResponse.Server,
                GetSelectedServer: setTimeout(this.GetSelectedServerStatus.bind(this), 30 * 1000)
            });
            
        }
    }
    
    ServerSelectionChange() {
        if (this.ServerSelection) {

            for (const Server of this.state.Servers) {
                if (this.ServerSelection.value == Server.macaddr) {
                    return this.setState({
                        SelectedServer: Server
                    }, () => {
                        this.GetSelectedServerStatus();
                    });
                }
            }
            this.setState({
                SelectedServer: undefined
            })
        }
    }

    ToggleSetting() {
        this.setState({
            DisplaySetting: !this.state.DisplaySetting
        })
    }


    render() {
        const ServerSelection = 
            <select onChange={this.ServerSelectionChange.bind(this)} ref={(e) => {this.ServerSelection = e}}>
                <option value="">Select Server</option>
                {this.state.Servers&&
                    this.state.Servers.map((Server, idx) => {
                        return <option value={Server.macaddr} key={idx}>{Server.name}</option>
                    })
                }
            </select>

        interface UsageArr {
            cpu: Array<number>,
            memory: Array<number>
        }

        let CpuUsageAvg: number = 0;
        let MemUsageAvg: number = 0;
        let Disks: Array<Drive> = [];
        let UsageArr: UsageArr = {
            cpu: [],
            memory: []
        };
        let UsageDates = [];
        if (this.state.SelectedServer) {
            for (const Drive of this.state.SelectedServer.Drives) {
                Disks.push({...Drive});
            }
            for (const Usage of this.state.SelectedServer.usage) {
                if (Usage.cpu && Usage.memory) {
                    CpuUsageAvg += Usage.cpu * 100;
                    MemUsageAvg += Usage.memory * 100;
                    UsageArr.cpu.push(Math.round(Usage.cpu * 100));
                    UsageArr.memory.push(Math.round(Usage.memory * 100));

                    let date = new Date(Usage.date);
                    // if (UsageDates.length)
                        // UsageDates.push("+" + Milisecond(date.getTime() - new Date(this.state.SelectedServer.usage[UsageDates.length-1].date).getTime(), true));
                    UsageDates.push("+" + Milisecond(Date.now() - date.getTime()));
                }
            }
            CpuUsageAvg = Math.round(CpuUsageAvg / this.state.SelectedServer.usage.length);
            MemUsageAvg = Math.round(MemUsageAvg / this.state.SelectedServer.usage.length);
        }
        return(
            <div className="DashBoard">
                <div className="DashTitle">Dashboard - {ServerSelection} <span onClick={this.ToggleSetting.bind(this)} className="SettingBtn fas fa-cog"></span> </div>
                <div className="DashComps">
                    {!this.state.SelectedServer?.online&& <Warn message={`서버가 오프라인 입니다. 마지막 확인 :  ${this.state.SelectedServer?.usage[0]? new Date(this.state.SelectedServer?.usage[this.state.SelectedServer.usage.length-1].date).toLocaleString():""}`} />}
                    <CpuUsageMonitor CpuUsage={UsageArr.cpu} Dates={UsageDates}/>
                    <QuterComp Datas={[
                        {Title: "CPU 정보", Desc: this.state.SelectedServer?.cpu.name},
                        {Title: "Architecture", Desc: this.state.SelectedServer?.cpu.arch}, 
                        {Title: "CPU core", Desc: (this.state.SelectedServer?.cpu.coreCount)&& this.state.SelectedServer.cpu.coreCount+" cores"}, 
                        {Title: CpuUsageAvg+"%", Desc: "평균 cpu 사용률"}
                    ]} />
                    <QuterComp Datas={[
                        {Title: "메모리 크기", Desc: this.state.SelectedServer?.memory&& ByteCal(this.state.SelectedServer?.memory)},
                        {Title: MemUsageAvg+"%", Desc: "평균 메모리 사용률"}, 
                        {Title: "서버 os", Desc: this.state.SelectedServer?.os}, 
                        {Title: "서버 플랫폼", Desc: this.state.SelectedServer?.platform}
                    ]} />
                    <MemUsageMonitor MemUsage={UsageArr.memory} Dates={UsageDates} />

                    <DiskBoard Disks={Disks}/>
                    <RemoveServer User={this.props.User} Server={this.state.SelectedServer} />
                    {this.state.DisplaySetting&& <Setting Update={this.GetAllServerStatus.bind(this)} User={this.props.User} Server={this.state.SelectedServer} Close={this.ToggleSetting.bind(this)} />}
                </div>
            </div>
        )
    }
}

export default DashBoard;