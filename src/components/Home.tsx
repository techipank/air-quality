import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://city-ws.herokuapp.com');
interface City{
	city:string,
	aqi: string
}
interface IState {
  customers: any[];
  cityData: any[];
}

export default class Home extends React.Component<RouteComponentProps, IState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = { customers: [],cityData: [] };
  }
  public componentDidMount(): void {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
		const data=JSON.parse(message.data.toString());
		//console.log(message.timeStamp)
		for (let i = 0; i < data.length; i++) {
			data[i] = Object.assign(data[i], {timeStamp:new Date().getTime()});
		}
		console.log(data);
		 this.setState({ cityData: data });
    };
  }
 

  public Unix_timestamp(t:any)
	{
	var dt = new Date(t*1000);
	var hr = dt.getHours();
	var m = "0" + dt.getMinutes();
	var s = "0" + dt.getSeconds();
	if(dt.getHours()==0 && dt.getMinutes()==0){
		return 'A Few Seconds Ago';
	}else if (dt.getHours()==0 && dt.getMinutes()!=0){
		return m.substr(-2)+'Minuts Ago';
	}else {
		return hr + ':' + m.substr(-2) ;  
	}
	
	}
  public getColor(aqi:any){
	  if(aqi<51){
		  return {color: "green"}
	  }else if (aqi<101){
		  return {color:"lightgreen"}
	  }else if (aqi<201){
		  return {color:"yellow"}
	  }else if (aqi<301){
		  return {color:"orange"}
	  }else if (aqi<401){
		  return {color:"red"}
	  }else if (aqi<501){
		  return {color:"darkred"}
	  }
  }
  public render() {
	const cityData = this.state.cityData;
	
    return (
      <div>
        {cityData.length === 0 && (
          <div className="text-center">
            <h2>No customer found at the moment</h2>
          </div>
        )}
        <div className="container">
          <div className="row">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col">City</th>
                  <th scope="col">Current AQI</th>
				  <th scope="col">Last Updated</th>
				  
                </tr>
              </thead>
              <tbody>
                {cityData &&
                  cityData.map((data) => (
                    <tr >
                      <td>{data.city}</td>
                      <td style={this.getColor(data.aqi)}>{data.aqi}</td>
					  <td>{this.Unix_timestamp(data.timeStamp)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
