'use strict'

const ID = 'city_name'

const API_KEY = '38e10902973345ba92f96022da41797c'
const URL = 'https://api.weatherbit.io/v2.0/current'
const REQUEST_TEMPLATE = `${URL}?lang=ru&key=${API_KEY}&city=`

class WeatherTable extends React.Component {
  static headerMap = new Map([
    ['city_name', 'Наименование города'],
    ['temp', 'Температура'],
    ['rh', 'Относительная влажность'],
    ['pod', 'Часть суток'],
    ['pres', 'Давление'],
    ['clouds', 'Облачность (%)'],
    ['wind_spd', 'Скорость ветра'],
    ['wind_cdir_full', 'Направление ветра'],
    ['sunrise', 'Восход солнца'],
    ['sunset', 'Заход солнца'],
    ['timezone', 'Временная зона'],
    ['ob_time', 'Последнее время наблюдения']
  ])

  static headerKeys = Array.from(WeatherTable.headerMap.keys())
  static headerValues = Array.from(WeatherTable.headerMap.values())
  static columnsSize = WeatherTable.headerMap.size + 1

  constructor(props) {
    super(props)
    this.state = { data: new Map(), offeredCities: [] }
    if (Array.isArray(props.cities)) {
      props.cities.forEach(city => this.fetchData(city))
    }
    this.searchInput = React.createRef()
  }

  fetchData(city) {
    fetch(`${REQUEST_TEMPLATE}${city}`)
      .then(response => response.json())
      .then(response => {
        let data = this.state.data
        response['data']
          .filter(row => row[ID])
          .forEach(row => data.set(row[ID], row))
        this.setState({ data: data })
      })
      .catch(error => alert(`Невозможно получить данные для города ${city}`))
  }

  filterOfferedCities(event) {
    let searchString = event.target.value
    if (searchString.length > 1) {
      searchCities(searchString).then(result => {
        this.setState({ offeredCities: result })
      })
    }
    this.setState({ offeredCities: [] })
  }

  addCity(event) {
    this.setState({ offeredCities: [] })
    this.fetchData(event.target.text)
    this.searchInput.current.value = ""
  }

  renderTableHeader() {
    return (
      <tr>
        {WeatherTable.headerValues.map((value, index) => (
          <th key={index}>{value}</th>
        ))}
        <th>Удалить</th>
      </tr>
    )
  }

  renderTableData() {
    return Array.from(this.state.data.values()).map(row => {
      return (
        <tr key={row[ID]}>
          {WeatherTable.headerKeys.map((key, index) => (
            <td key={index}>{row[key]}</td>
          ))}
          <td>{this.renderDeleteButton(row[ID])}</td>
        </tr>
      )
    })
  }

  renderDeleteButton(cityName) {
    return (
      <button
        onClick={() => {
          let data = this.state.data
          data.delete(cityName)
          this.setState({ data: data })
        }}
        className="remove-btn"
      ></button>
    )
  }

  render() {
    return (
      <div>
          <div class="dropdown-content">
            <input
              ref={this.searchInput}
              class="search-input"
              type="text"
              placeholder="Добавить город"
              title="Введите 2 символа для начала поиска"
              onKeyUp={() => this.filterOfferedCities(event)}
            ></input>
            <div class="selectedOptions">
              {this.state.offeredCities.map(key => (
                <a key={key} onClick={() => this.addCity(event)}>
                  {key}
                </a>
              ))}
            </div>
        </div>
        <table>
          <tbody>
            {this.renderTableHeader()}
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }
}
