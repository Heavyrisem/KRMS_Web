import React from 'react';
import * as Chartjs from 'chart.js';
import * as Chart from 'react-chartjs-2';

import { DBServer, Drive } from '../../Types';

import '../style/DashComp.css';
import {ByteCal} from './Unitchanger';
import { User } from './Master';
Chartjs.defaults.global.animation = {
    duration: 1000,
    easing: "easeInBack"
};
interface DashBoardCom {
    ChartCon: Chartjs.ChartConfiguration
}
const Chartopt: Chartjs.ChartOptions = {
    scales: {
        yAxes: [{
            ticks: {
                max: 100,
                stepSize: 33,
                beginAtZero: true,
                display: false
            }
        }],
        xAxes: [{
            gridLines: {
                display: false
            }
        }]
    }
}


interface CpuProps {
    CpuUsage: Array<number>,
    Dates: Array<string>
}
interface CpuStates extends DashBoardCom {
}
export class CpuUsageMonitor extends React.Component<CpuProps, CpuStates> {

    render() {
        const data: Chartjs.ChartData = {
            labels: this.props.Dates,
            datasets: [{
                label: 'Cpu Usage',
                data: this.props.CpuUsage,
                borderWidth: 1,
                borderJoinStyle: 'bevel'
            }]
        }

        return (
            <div className="CpuUsage DashComp">
                <div className="CpuUsagePerc">{this.props.CpuUsage[this.props.CpuUsage.length-1]}%</div>
                <Chart.Line data={data} options={Chartopt} />
            </div>
        )
    }
}


interface MemProps {
    MemUsage: Array<number>,
    Dates: Array<string>
}
interface MemStates extends DashBoardCom {
}
export class MemUsageMonitor extends React.Component<MemProps, MemStates> {
    render() {
        const data: Chartjs.ChartData = {
            labels: this.props.Dates,
            datasets: [{
                label: 'Memory Usage',
                data: this.props.MemUsage,
                borderWidth: 1,
                borderJoinStyle: 'bevel'
            }]
        }
        
        return (
            <div className="MemUsage DashComp">
                <div className="MemUsagePerc">{this.props.MemUsage[this.props.MemUsage.length-1]}%</div>
                <Chart.Line data={data} options={Chartopt} />
            </div>
        )
    }
}


interface QuterProp {
    Datas: Array<{
        Title?: string,
        Desc?: string | number
    }>
}

export const QuterComp = (props: QuterProp) => {
    const style: Array<React.CSSProperties> = [
        {
            paddingTop: "2%"
        },
        {
            paddingBottom: "2%"
        }
    ]
    const stylehorizon: Array<React.CSSProperties> = [
        {
            paddingLeft: "2%"
        },
        {
            paddingRight: "2%"
        }
    ]
    return <div className="QuterRoot">{props.Datas&&
        props.Datas.map((prop, idx) => {
            // let cal = (2 > idx)? 0 : (props.Datas.length-2 <= idx)? 2 : 1;
            let vertical = (2 > idx)? 1:0;
            let horizontal = (idx+1) % 2;
            return <div className="QuterComp" style={{...style[vertical], ...stylehorizon[horizontal]}} key={idx}>
                    <div className="DashComp">
                        <div className="QuterTitle">{(prop.Title)? prop.Title:"측정된 데이터가 없습니다."}</div>
                        <div className="QuterDesc">{(prop.Desc)? prop.Desc:"측정된 데이터가 없습니다."}</div>
                    </div>
                </div>
        })
    }</div>
}

interface DiskBoardProps {
    Disks: Array<Drive>
}
interface DiskBoardState {

}
export class DiskBoard extends React.Component<DiskBoardProps, DiskBoardState> {
	// constructor(props: DiskBoardProps) {
	// 	super(props);
    // }
    
    render() {
        return(
            <div className="DiskBoard DashComp">
				
				<div className="Disk Label">
					<span className="DiskName">이름</span>
					<span className="DiskUsedPrec">사용률</span>
					<span className="DiskFreeSize">남은 공간</span>
					<span className="DiskSize">크기</span>
					<span className="DiskMount">위치</span>
				</div>

                {this.props.Disks&&
                    this.props.Disks.map((Disk, idx) => {
						return(
							<div className="DiskData" key={idx}>
								<div className="Disk">
									<span className="DiskName">{Disk.name}</span>
									<span className="DiskUsedPrec">{(Disk.freesize&&Disk.size)&& parseFloat(100-Disk.freesize / Disk.size * 100+"").toFixed(1)}%</span>
									<span className="DiskFreeSize">{ByteCal(Disk.freesize as number)}</span>
									<span className="DiskSize">{ByteCal(Disk.size as number)}</span>
									<span className="DiskMount">{Disk.mount}</span>
								</div>
							</div>
						)
                    })  
                }
            </div>
        )
    }
}


interface WarnProps {
    message: string
}
interface WarnStates {}
export class Warn extends React.Component<WarnProps, WarnStates> {
    render() {
        return (
            <div className="DashComp WarningComp">{this.props.message}</div>
        )
    }
}


interface RemoveProps {
    Server?: DBServer,
    User: User
}
interface RemoveStates {
    displayBtn: boolean,
    displayConfirmBtn: boolean,
    ServerResponse?: string
}
export class RemoveServer extends React.Component<RemoveProps, RemoveStates> {

    constructor(props: RemoveProps) {
        super(props);
        this.state = {
            displayBtn: true,
            displayConfirmBtn: false
        }
    }

    async Remove() {
        let ServerResponse = await fetch(`https://${process.env["REACT_APP_KRMS_SERVER_ADDRESS"]}/RemoveServer`, {
            method: "POST",
            body: JSON.stringify({ token: this.props.User.token, macaddr: this.props.Server?.macaddr }),
            headers: {"content-type": "application/json"}
        });
        let ServerMessage = await ServerResponse.json();
        

        if (ServerMessage.err) {
            this.setState({
                ServerResponse: ServerMessage.err
            });
        } else {
            this.setState({
                ServerResponse: ServerMessage.msg
            })

            setTimeout(() => {
                this.setState({
                    displayBtn: false
                },() => {
                    console.log("CLOSE",this.state)
                })
            }, 4000);

        }
    }

    render() {
        return (<>
            {(this.props.Server && this.state.displayBtn)&& 
                <>
                    {this.state.displayConfirmBtn?
                        <div className="DashComp RemoveComp" onClick={(this.Remove.bind(this))}>{this.props.Server.name} 삭제하려면 다시 눌러주세요</div>:
                        !this.state.ServerResponse?<div className="DashComp RemoveComp" onClick={() => {this.setState({displayConfirmBtn: true})}}>{this.props.Server.name} 삭제</div>:
                        <div className="DashComp RemoveComp">{this.state.ServerResponse}</div>
                    }
                </>
            }
        </>)
    }
}