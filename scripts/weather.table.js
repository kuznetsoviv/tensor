'use strict'

const e = React.createElement

const ID = 'city_name'

const API_KEY = '34340d52684a482386b3a9768a98c0e3'
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
    this.state = { data: new Map() }
    if (Array.isArray(props.cities)) {
      props.cities.forEach(city => this.fillData(city))
    }
  }

  fillData(city) {
    let xhr = new XMLHttpRequest()
    xhr.weatherTable = this
    xhr.open('GET', `${REQUEST_TEMPLATE}${city}`, true)
    xhr.send()
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return
      if (xhr.status != 200) {
        alert(`Невозможно получить данные для города ${city}`)
        console.log(xhr.status + ': ' + xhr.statusText)
      } else {
        let response = JSON.parse(xhr.responseText)
        if (Array.isArray(response['data'])) {
          let data = xhr.weatherTable.state.data
          response['data']
            .filter(row => row[ID])
            .forEach(row => data.set(row[ID], row))
          xhr.weatherTable.setState({ data: data })
        }
      }
    }
  }

  renderTableHeader() {
    return e('tr', null,
      WeatherTable.headerValues.map((value, index) =>
        e('th', { key: index }, value)
      ),
      e('th', null, 'Удалить')
    )
  }

  renderTableData() {
    let rows = Array.from(this.state.data.values())
    return rows.map(row => {
      return e('tr', { key: row[ID] },
        WeatherTable.headerKeys.map((key, index) =>
          e('td', { key: index }, row[key])
        ),
        e('td', null, this.renderDeleteButton(row[ID]))
      )
    })
  }

  renderDeleteButton(cityName) {
    return e('button', {
      onClick: () => {
        let data = this.state.data
        data.delete(cityName)
        this.setState({ data: data })
      },
      className: 'btn removebtn'
    })
  }

  renderAddButton() {
    return e('tr', { key: 'last' },
      e('td', { colspan: WeatherTable.columnsSize },
        e('button', {
          onClick: () => {
            let cityName = prompt('Введите наименование города', 'Moscow')
            if (cityName) {
              this.fillData(cityName)
            }
          },
          className: 'btn addbtn'
        })
      )
    )
  }

  render() {
    return e('div', null,
      e('table', { id: 'weather' },
        e('tbody', null,
          this.renderTableHeader(),
          this.renderTableData(),
          this.renderAddButton()
        )
      )
    )
  }
}
