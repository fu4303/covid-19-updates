import axios from "axios";
import React from "react";
import Moment from "react-moment";
import Key from "./keys";
import "./App.css";

import Travelrec from "./Travelrec";

class CountrySearch extends React.Component {
  state = {
    data: [],
    country: "",
    showsearch: "",
    errormsg: false,
    rawData: [],
    showRecs: false,
    travelData: [],
  };

  componentDidMount = () => {
    this.setState({ showsearch: true });

    axios
      .get("https://www.trackcorona.live/api/travel")
      .then((res) => this.setState({ rawData: res.data.data }))
      .catch((err) => console.log(err));
  };

  getFromApi = (e) => {
    e.preventDefault();

    this.setState({ showsearch: false });

    if (this.state.country == "") {
      this.setState({ errormsg: true });

      return;
    }

    fetch(
      `https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=${this.state.country}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
          "x-rapidapi-key": `${Key.Key}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => this.outputting(data));
  };

  changeCountry = (e) => {
    this.setState({ country: e.target.value, data: [] });
  };

  outputting = (dat) => {
    if (!dat.data.covid19Stats.length < 218 && this.state.country) {
      let dataarr = [...this.state.data];

      if (!dat.data.covid19Stats || dat.data.covid19Stats[0].country === "US") {
        this.setState({ errormsg: true });
        return;
      }

      dataarr = dat.data.covid19Stats.map((region) => {
        return {
          region: region,
          province: <p>{region.province}</p>,
          confirmed: <p>{region.confirmed}</p>,
          recovered: <p>{region.recovered}</p>,
          deaths: <p>{region.deaths}</p>,
          timestamp: <p>{region.lastUpdate}</p>,
        };
      });

      let travelInfoArr;
      travelInfoArr = [];

      this.state.rawData.map((country) => {
        if (country.location === dat.data.covid19Stats[0].country) {
          travelInfoArr.push(country.data);
        }
        this.setState({ travelData: travelInfoArr });
      });

      this.setState({ data: dataarr });
    }
  };

  newSearch = () => {
    this.setState({ country: "", showsearch: true, errormsg: false });
  };
  showRecommendations = () => {
    this.setState({ showRecs: !this.state.showRecs });
  };
  render() {
    const countrydata = this.state.data.map((cas, index) => (
      <tbody key={index}>
        <tr className="card">
          <td>{cas.province}</td>
          <td>{cas.confirmed}</td>
          <td>{cas.deaths}</td>
          <td>{cas.recovered}</td>
          <td>
            <Moment durationFromNow>{cas.timestamp}</Moment> from now
          </td>
        </tr>
      </tbody>
    ));

    return this.state.showsearch == true ? (
      <div>
        <h3>ENTER COUNTRY NAME (Excepting China and the US)</h3>

        <form className="forma" onSubmit={this.getFromApi}>
          <input
            id="countryruta"
            type="text"
            onChange={(e) => this.changeCountry(e)}
          />
          <button id="countrysearchbtn" type="submit">
            Search
          </button>
        </form>
      </div>
    ) : this.state.showsearch == false && this.state.errormsg == false ? (
      <div className="countryinfo">
        <h3 className="country_title">
          COUNTRY DATA for {this.state.country.toUpperCase()}
        </h3>
        <table>
          <thead>
            <tr>
              <th>PROVINCE</th>
              <th>CONFIRMED</th>
              <th>CASUALTIES</th>
              <th>RECOVERED</th>
              <th>UPDATED (hh:mm:ss)</th>
            </tr>
          </thead>
          {countrydata}
        </table>
        <button className="backToTop" onClick={this.newSearch}>
          New Search
        </button>
        <p id="recommendations_link" onClick={() => this.showRecommendations()}>
          TRAVEL RECOMMENDATIONS
        </p>
      </div>
    ) : this.state.errormsg == true && this.state.showsearch == false ? (
      <div className="notvalidcountry">
        You need to enter a valid country name
        <div>
          <button className="backToTop" onClick={this.newSearch}>
            New Search
          </button>
        </div>
      </div>
    ) : (
      this.state.showRecs && (
        <Travelrec
          travelData={this.state.travelData}
          closeRecs={this.showRecommendations}
        />
      )
    );
  }
}

export default CountrySearch;
