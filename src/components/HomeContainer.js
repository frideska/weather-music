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
      weatherTile: '',
      success: false,
      image: '',
      music: [],
      input: '',
      city: '',
      nightOrDay: '',
      videos: []
    })
  }

  componentDidMount() {
    this.fetchImages('clear')
  }

  checkIfNight() {
    let date = new Date()
    if(date.getHours() >= 20){
      this.setState({nightOrDay: 'night'})
      return 'night,evening'
    } else {
      this.setState({nightOrDay: 'day'})
      return 'day,light'
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
        let weatherInfo = weather.weather[0].main
        console.log(weatherInfo)
        this.fetchImages(weatherInfo)
        weatherInfo && this.setState({ success: true })
        this.setState({ weather })
        this.fetchVideo(weatherInfo);
      })
      .catch(error => {
        console.log(error.response)
        this.setState({ success: false })
      })
  }

  fetchVideo = (weather) => {
    if(weather=='Rain'){
      this.setState({
        videos: ['8N-qO3sPMjc?list=PLqpHORfMJxNNnzNS4RVWqFEBm1BJUEfUH',
        'V1Pl8CzNzCw?list=PL7v1FHGMOadAGLbdfXzzEc7p87gM14dpX'],
        weatherTile: 'rain'
      })
    }else if(weather=='Thunderstorm'){
      this.setState({
        videos: ['PI2LEicK9zc?list=PLNuQ5AymS5SjsL6cGx83VIyydrbEdDSoZ',
        'WGU_4-5RaxU?list=PLykHj5swcMFNefpU3GtUvWIjT99rp_dkI'],
        weatherTile: 'thunderstorm'
      })
    }else if(weather=='Drizzle'){
      this.setState({
        videos: ['3AtDnEC4zak?list=PL4QNnZJr8sRNzSeygGocsBK9rVXhwy9W4',
        'mk48xRzuNvA?list=PLynl2AdLA6UGR4YE-5Rc8UNAgt6DXwW4V'],
        weatherTile: 'drizzly weather'
      })
    }else if(weather=='Snow'){
      this.setState({
        videos: ['yXQViqx6GMY?list=RDQMkuTysqTp4N4',
        'v2jAweLVLRk?list=RDv2jAweLVLRk'],
        weatherTile: 'snow'
      })
    }else if(weather=='Athmosphere'){
      this.setState({
        videos: ['Dhw-hP2MPw4?list=PLl4zG_ikEo2WvwXZYQT1iG1Pj8AGdC-OX',
        'MFlTC7onqHc?list=PL4B1PLULungkGynG0lSb_rjQx1_IQ6XfR'],
        weatherTile: 'hazy weather'
      })
    }else if(weather=='Clear'){
      this.setState({
        videos: ['y6Sxv-sUYtM?list=PLWyCiVKEayX_WuoYgy0eopWvDzCnmoAGn',
        'c6rP-YP4c5I?list=PLpZPje5-kkqHfQ0krnftkWbMiFRV3jUat'],
        weatherTile: 'clear weather'
      })
    }else if(weather=='Clouds'){
      this.setState({
        videos: ['Ivrrt6oYxxc?list=PLKYTmz7SemaqVDF6XJ15bv_8-j7ckkNgb',
        '-9GUhd0ccGs?list=PLPvwUwoi3EncuPo7NKrcKfZHSJ84wt5BE'],
        weatherTile: 'cloudy weather'
      })
    }
  }

  fetchImages = (weather) => {
    axios.get('https://api.unsplash.com/search/photos/?page=1&per_page=100&query='+weather+','+this.checkIfNight()+',sky'+'&client_id=482375f6a898d949d9e813e99559266f763fe08c077918274e13f27b5effae89',
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

  changeValue = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  render() {
    let header = (this.state.city) && (this.state.city).toUpperCase()
    let temp = (this.state.weather && (this.state.weather.main.temp - 273.15))
    let country = (this.state.weather && this.state.weather.sys.country)
    const divider = this.state.city ? true : false
    return (
      <div style={container}>
        <img src={this.state.image && this.state.image.urls.regular}/>
        <div className={this.state.nightOrDay} style={mainContent}>
          {this.state.success && <h1>{header}</h1>}
          {(!this.state.success && !this.state.city) && <div className={'extraMargin'}>Search for a city</div>}
          {(!this.state.success && this.state.city) && <div className={'extraMargin'}>This city does not exist</div>}
          {(this.state.success) && <div><div>{country}</div><div>{Math.round(temp)}°C</div></div>}
          <div style={flexRow}>
            <MuiThemeProvider>
              <TextField hintStyle={{color: '#999'}} multiLine={true}
                style={styles.textInput} textareaStyle={styles.textInputInput}
                className={'input-field'}
                hintText="Search for your city" type="text"
                onChange={this.changeValue} value={this.state.input}/>
              <IconButton onClick={() => this.fetchWeather()}>
                <SearchIcon />
              </IconButton>
            </MuiThemeProvider>
          </div>
          {(this.state.success) &&
            <div style={container}>
              <div className={'extraMargin'}>Recommended music in this {(this.state.weather) && this.state.weatherTile}</div>
              <div className={'flexRow'}>
                <iframe src={"https://www.youtube.com/embed/"+this.state.videos[0]} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                <iframe src={"https://www.youtube.com/embed/"+this.state.videos[1]} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default HomeContainer
