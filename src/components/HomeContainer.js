import React, { Component } from 'react'
import axios from 'axios'

import TextField from 'material-ui/TextField'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import IconButton from 'material-ui/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import {container, mainContent, styles, flexRow} from './styles.js'

class HomeContainer extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      weather: false,
      success: false,
      image: '',
      music: [],
      input: '',
      city: '',
      nightOrDay: '',
    })
  }

  componentDidMount() {
    this.fetchMusic()
    this.fetchImages('sky,clear'+this.checkIfNight())
  }

  checkIfNight() {
    let date = new Date()
    if(date.getHours() >= 19){
      this.setState({nightOrDay: 'night'})
      return ',night'
    } else {
      this.setState({nightOrDay: 'day'})
      return ',day,light'
    }
  }

  fetchWeather = () => {
    this.setState({
      city: this.state.input,
      input: "",
    })
    axios.get('http://api.openweathermap.org/data/2.5/weather?q='+this.state.input+'&APPID=a539f200743789e98e96334ea0a2438c',
      { method: "get",
        crossdomain: true})
      .then(res => {
        const weather = res.data
        console.log(weather)
        let weatherInfo = weather.weather[0].main
        let weatherDes = weather.weather[0].description
        this.fetchImages(weatherInfo)
        weatherInfo && this.setState({ success: true })
        this.setState({ weather })
      })
      .catch(error => {
        console.log(error.response)
        this.setState({ success: false })
      })
  }

  fetchImages = (weather, weatherDes) => {
    axios.get('https://api.unsplash.com/search/photos/?page=1&per_page=100&query='+weather+','+weather+','+this.checkIfNight()+',sky'+'&client_id=482375f6a898d949d9e813e99559266f763fe08c077918274e13f27b5effae89',
      { method: "get",
        crossdomain: true})
      .then(res => {
        const images = res.data
        let temps = images.results.sort((a,b)=>a.likes>b.likes)
        let temp = temps[temps.length-(Math.floor(Math.random() * 10) + 1 )]
        console.log(temp)
        this.setState({ image: temp })
      })
      .catch(error => {
        console.log(error.response)
      })
  }

  fetchMusic = () => {
    axios.get('https://www.last.fm/api/auth?api_key=76a16824852d37d10bb20ef630425ced&token=S0j8VssO-c9RMumX2qZsmKbdgDo8sL8H',
      { method: "get",
        crossdomain: true})
      .then(res => {
        const music = res.data
        console.log(music)
        this.setState({ music })
      })
      .catch(error => {
        console.log(error.response)
      })
  }

  changeValue = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  render() {
    let header = (this.state.city) && (this.state.city)[0].toUpperCase() + (this.state.city).substring(1)
    let temp = (this.state.weather && (this.state.weather.main.temp - 273.15))
    let country = (this.state.weather && this.state.weather.sys.country)

    const divider = this.state.city ? true : false
    return (
      <div style={container}>
        <img src={this.state.image && this.state.image.urls.raw}></img>
        <div className={this.state.nightOrDay} style={mainContent}>
          {this.state.success && <h1>{header}</h1>}
          {(!this.state.success && !this.state.city) && <div>Choose a city</div>}
          {(!this.state.success && this.state.city) && <div>This city does not exist</div>}
          {(this.state.success) && <div>{country}</div>}
          {(this.state.success) && <div>{Math.round(temp)}°C</div>}
          <div style={flexRow}>
            <MuiThemeProvider>
              <TextField hintStyle={{color: '#999'}} multiLine={true} style={styles.textInput} textareaStyle={styles.textInputInput}
                hintText="Search for your city" type="text"
                onChange={this.changeValue} value={this.state.input}/>
              <IconButton onClick={() => this.fetchWeather()}>
                <SearchIcon />
              </IconButton>
            </MuiThemeProvider>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeContainer
