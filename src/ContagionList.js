import React from 'react'
import Moment from 'react-moment' 


class ContagionList extends React.Component {

    state = {

        data: []
    }

componentDidMount =() => {
      
        fetch(`https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=`, {
          "method": "GET",
          "headers": {
            "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
            "x-rapidapi-key": "49af8e6e8dmsh0f9f2074dabddcbp1a7445jsnedd6de2d5aa8"
          }
        })
        .then(response => response.json()
        )
        .then(data=>
       this.listoutput(data))
        .catch(err => {
          console.log(err)
        })
      }

listoutput = (dat) => {let dataarr = [...this.state.data];

   let globalarr = []

   let j;

   for (j=0; j<dat.data.covid19Stats.length; j++) {

    globalarr.push({country:dat.data.covid19Stats[j].country, city: dat.data.covid19Stats[j].city, confirmed: dat.data.covid19Stats[j].confirmed, recovered: dat.data.covid19Stats[j].recovered, deaths: dat.data.covid19Stats[j].deaths, timestamp: dat.data.covid19Stats[j].lastUpdate})
   }

   
   
   let selectarr = globalarr.filter(cou=>cou.country!="US"&& cou.country!="China")
  
   //let doubleselectarr = selectarr.filter(cit=>cit.city =="")
   //console.log(globalarr)
   let sortedarr= selectarr.filter(pers=>pers.confirmed > 15000)

  
   this.setState({data: sortedarr})}

      


render () {

    const list = this.state.data.map(cas =>{
      
      return( <tr className="card"> 
                  <td>{cas.country}</td>
                  <td>{cas.confirmed}</td>                      
                  <td>{cas.recovered}</td>
                  <td>{cas.deaths}</td>              
                  <td><Moment durationFromNow>{cas.timestamp}</Moment> from now</td>
              </tr>)})

    return (<div className="countryinfo">
              <table>
                <thead>
                  <tr>
                      <th>COUNTRY</th>
                      <th>CONFIRMED</th>
                      <th>RECOVERED</th>
                      <th>CASUALTIES</th>
                      <th>UPDATE (hh:mm:ss)</th>
                   </tr>
                </thead>
                <tbody>
                  {list} 
                </tbody>
              </table>
            </div>)
}
}




export default ContagionList