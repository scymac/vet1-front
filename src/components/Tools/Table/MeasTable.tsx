// React
import { useMemo, useState } from 'react'

// Mui
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'

// Custom
import { avg, meanFromStrArray } from 'assets/functions/Calculations'

// Types
import { ScreenDim } from 'types/types'
import { Measurement } from 'api/Interfaces'

// Styles
import themeColors from 'assets/theme/colors'
import componentStyles from './MeasTable-CSS'
import './MeasTable.css'

const useStyles:any = makeStyles(componentStyles)

type Props = {
  screenDim: ScreenDim,
  showTResOutOfSpec: boolean,
  showSResOutOfSpec: boolean,
  headers          : string[][],
  data             : string[][],
  rawData          : Measurement[],
  setup            : {
    isHalfPlate       : boolean
    thickness         : boolean,
    through_resistance: boolean,
    whole_resistance  : boolean,
    local_resistance  : boolean,
    lRes_max          : number,
    lRes_min          : number,
    wRes_max          : number,
    wRes_min          : number,
    tRes_max          : number,
    tRes_min          : number,
  }

  // scrollTopPosition: number,
  // colSpanFlag      : boolean      // true if showing local resistance but not whole resistance
}

export default function MeasTable(props:Props) {

  const classes = useStyles()

  const scrollLimit = 20

  const [tableData, setTableData] = useState(props.data)

  //* sorting
  const [sortingCol, setSortingCol]       = useState(0)      // sort by sample_no by default
  const [sortDirection, setSortDirection] = useState(false)  // sort descending by default

  const sortCol = (sortData:string[][], col:number, updateSorting:boolean) => {
    setSortingCol(col)
    let sortDir = sortDirection

    // set direction
    if (updateSorting) {
      setSortDirection(!sortDirection)
      sortDir = !sortDirection
    }

    // do the sorting
    else if (col === 2) { // consider cells as date
      if (sortDir) { // consider cells as numbers
        setTableData(
          sortData.sort((a, b) => {
            const aa = a[col].split('.')
            const bb = b[col].split('.')
            return Date.parse(`${aa[1]}.${aa[0]}.${aa[2]}`) - Date.parse(`${bb[1]}.${bb[0]}.${bb[2]}`)
          }),
        )
      }
      else {
        setTableData(
          sortData.sort((a, b) => {
            const aa = a[col].split('.')
            const bb = b[col].split('.')
            return Date.parse(`${bb[1]}.${bb[0]}.${bb[2]}`) - Date.parse(`${aa[1]}.${aa[0]}.${aa[2]}`)
          }),
        )
      }
    }
    else if (col === 6) { // sort the averages

      if (sortDir) { // consider cells as numbers
        setTableData(
          sortData.sort((a, b) => avg(a.slice(6)).toString().localeCompare(avg(b.slice(6)).toString(), undefined, { numeric: true })),
        )
      }
      else {
        setTableData(
          sortData.sort((a, b) => avg(b.slice(6)).toString().localeCompare(avg(a.slice(6)).toString(), undefined, { numeric: true })),
        )
      }
    }
    else if (sortDir) { // consider cells as numbers
      setTableData(
        sortData.sort((a, b) => a[col].localeCompare(b[col], undefined, { numeric: true })),
      )
    }
    else {
      setTableData(
        sortData.sort((a, b) => b[col].localeCompare(a[col], undefined, { numeric: true })),
      )
    }

  }

  const getCellColor = (value:string, spec:'lRes'|'wRes'|'tRes'|'tick') => {
    if (spec === 'lRes' && props.showSResOutOfSpec) { return Number(value) > (props.setup.lRes_max / 1000) || Number(value) < (props.setup.lRes_min / 1000) ? themeColors.error.main : themeColors.gray.dark }
    if (spec === 'wRes' && props.showSResOutOfSpec) { return Number(value) > (props.setup.wRes_max / 1000) || Number(value) < (props.setup.wRes_min / 1000) ? themeColors.error.main : themeColors.gray.dark }
    if (spec === 'tRes' && !props.showTResOutOfSpec) { return Number(value) > (props.setup.tRes_max / 1000) || Number(value) < (props.setup.tRes_min / 1000) ? themeColors.error.main : themeColors.gray.dark }
    return themeColors.gray.dark
  }

  const getTooltip = (type:string, d:string[][], r:number) => {
    try {
      switch (type) {
        case 'tres_a': return props.rawData.filter((rd) => rd.sample_no === Number(d[r][0]))[0].t_res.current
        case 'tres_v': return props.rawData.filter((rd) => rd.sample_no === Number(d[r][0]))[0].t_res.voltage
        case 'sres_a': return props.rawData.filter((rd) => rd.sample_no === Number(d[r][0]))[0].w_l_res_A
        case 'wres_v': return props.rawData.filter((rd) => rd.sample_no === Number(d[r][0]))[0].w_res.voltage
      }
    }
    catch { return '-' }
  }

  const getLResTooltip = (d:string[][], r:number) => {
    try {
      const row = props.rawData.filter((rd) => rd.sample_no === Number(d[r][0]))[0]
      return (
        <div style = {{ fontSize: 13 }}>
          {`Strom: ${row.w_l_res_A}A`}
          <br />
          {' '}
          <br />
          Spannungen
          <br />
          {`${row.l_res1.voltage?.toFixed(3)}V `}
          &#x2022;
          {` ${row.l_res2.voltage?.toFixed(3)}V `}
          &#x2022;
          {` ${row.l_res3.voltage?.toFixed(3)}V `}
          &#x2022;
          {` ${row.l_res4.voltage?.toFixed(3)}V `}
          <br />
          {`${row.l_res5.voltage?.toFixed(3)}V `}
          &#x2022;
          {` ${row.l_res6.voltage?.toFixed(3)}V `}
          &#x2022;
          {` ${row.l_res7.voltage?.toFixed(3)}V `}
          &#x2022;
          {` ${row.l_res8.voltage?.toFixed(3)}V `}
          <br />
          {`${row.l_res9.voltage?.toFixed(3)}V `}
          &#x2022;
          {` ${row.l_res10.voltage?.toFixed(3)}V `}
          &#x2022;
          {` ${row.l_res11.voltage?.toFixed(3)}V `}
          &#x2022;
          {` ${row.l_res12.voltage?.toFixed(3)}V `}
        </div>
      )
    }
    catch { return <>-</> }
  }

  useMemo(() => {
    if (sortingCol > -1) {
      sortCol(props.data, sortingCol, false)
    }
    else setTableData(props.data)
  }, [props.data, sortDirection])

  const getCellContent = (r:number, c:number, d:string[][]) => {
    if (c === 1) {
      return (
        <Tooltip
          arrow
          title      = {<div style = {{ fontSize: 13 }}>{d[r][c] ? 'fertig' : 'offen'}</div>}
          placement  = "left-start"
          enterDelay = {300}
        >
          <div>
            {d[r][c] ? '✔' : '☐'}
          </div>
        </Tooltip>
      )
    }
    if (c === 6) {
      return (
        <Tooltip
          arrow
          title      = {getLResTooltip(d, r)}
          placement  = "right"
          enterDelay = {1000}
        >
          <div
            key = {`dc${c}`}
          >
            {
              d[r][6].length === 0 ? '-'
                :          (
                  <div className = {classes.rTableDiv}>
                    <table
                      className = {classes.rTable}
                      key = {`subtable${r}${c}`}
                      width = "420px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][6], 'lRes') }}>{d[r][6]}</Box>
                          </td>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][7], 'lRes') }}>{d[r][7]}</Box>
                          </td>
                          {}
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][8], 'lRes') }}>{d[r][8]}</Box>
                          </td>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][9], 'lRes') }}>{d[r][9]}</Box>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][10], 'lRes') }}>{d[r][10]}</Box>
                          </td>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][11], 'lRes') }}>{d[r][11]}</Box>
                          </td>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][12], 'lRes') }}>{d[r][12]}</Box>
                          </td>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][13], 'lRes') }}>{d[r][13]}</Box>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][14], 'lRes') }}>{d[r][14]}</Box>
                          </td>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][15], 'lRes') }}>{d[r][15]}</Box>
                          </td>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][16], 'lRes') }}>{d[r][16]}</Box>
                          </td>
                          <td>
                            <Box sx = {{ color: getCellColor(d[r][17], 'lRes') }}>{d[r][17]}</Box>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <Box sx = {{ color: getCellColor(meanFromStrArray(d[r].slice(6)).toFixed(2), 'lRes') }}>
                      Mtlw.
                      <br />
                      {meanFromStrArray(d[r].slice(6)).toFixed(2)}
                    </Box>
                  </div>
                )
          }
          </div>
        </Tooltip>
      )
    }
    if (c === 4) {
      return (
        <Tooltip
          arrow
          title = {(
            <div style = {{ fontSize: 13 }}>
              {`Strom: ${getTooltip('tres_a', d, r)}A`}
              <br />
              {`Spannung: ${getTooltip('tres_v', d, r)}V`}
            </div>
          )}
          placement  = "right"
          enterDelay = {1000}
        >
          <Box sx = {{ color: getCellColor(d[r][c], 'tRes') }}>
            {d[r][c]}
          </Box>
        </Tooltip>
      )
    }
    if (c === 5) {
      return (
        <Tooltip
          arrow
          title      = {(
            <div style = {{ fontSize: 13 }}>
              {`Strom: ${getTooltip('sres_a', d, r)}A`}
              <br />
              {`Spannung: ${getTooltip('wres_v', d, r)}V`}
            </div>
          )}
          placement  = "right"
          enterDelay = {1000}
        >
          <Box sx = {{ color: getCellColor(d[r][c], 'wRes') }}>
            {d[r][c]}
          </Box>
        </Tooltip>
      )
    }
    if ([0, 2, 3].includes(c)) return d[r][c]
  }

  const getCell = (r:number, c:number) => {
    const d = props.data
    if (d.length > 0 && c <= 6) {
      return (
        <td
          key = {`dc${c}`}
          hidden  = {
            c === 1
            || (c === 3 && !props.setup.thickness)
            || (c === 4 && !props.setup.through_resistance)
            || (c === 5 && !props.setup.whole_resistance)
            || (c === 6 && !props.setup.local_resistance)
          }
        >
          {
            getCellContent(r, c, d)
          }
        </td>
      )
    }
  }

  const getColSpan = (r:number, c:number) => (
    r === 0 && c === 5 && props.setup.whole_resistance && props.setup.local_resistance ? 2 : undefined
  )

  const getColWidth = (r:number, c:number) => {
    if (r === 0) {
      if (c === 0) return 80
      if (c === 1) return 45
      if (c === 2) return 140
      if (c === 3) return 50
      if (c === 4) return 170
      if (c === 5) return props.setup.whole_resistance && props.setup.local_resistance ? 80 : 200
      if (c >= 6) return 200
    }
    if (r === 1) {
      if (c === 0) return 80

      // if(c >= 1) return 45
    }
  }

  const onHeaderClick = (r:number, c:number, text:string) => {
    if (r === 0 && c < 5) sortCol(tableData, c, true)
    if (r === 1 && c === 0) sortCol(tableData, 5, true)
    if (r === 1 && c === 1) sortCol(tableData, 6, true)
  }

  return (

    <div
      id = "measTableDiv"
      style = {{
        height: props.screenDim.height - 180,
      }}
    >
      <table
        id = "measTable"
      >
        <thead
          style = {{
            background: '#fff',

            // position  : props.scrollTopPosition < scrollLimit ? undefined : "fixed",
            // top       : getHeaderTop(),
          }}
        >
          {
            props.headers.map((hr, i) => (
              <tr
                key = {i}
              >
                {
                    hr.map((hc, j) => (
                      <th
                        rowSpan = {i === 0 && j < 5 ? 2 : undefined}
                        colSpan = {getColSpan(i, j)}
                        key     = {hc}
                        hidden  = {
                          (i === 0 && j === 1)
                          || (i === 0 && j === 3 && !props.setup.thickness)
                          || (i === 0 && j === 4 && !props.setup.through_resistance)
                          || (i === 1 && j === 0 && !props.setup.whole_resistance)
                          || (i === 1 && j === 1 && !props.setup.local_resistance)
                        }
                        style   = {{
                          cursor:   'pointer',
                          maxWidth: getColWidth(i, j),
                          minWidth: getColWidth(i, j),
                          width:    getColWidth(i, j),
                        }}
                        onClick = {() => onHeaderClick(i, j, hc)}
                      >
                        {hc}
                      </th>
                    ))
                  }
              </tr>
            ))
          }
        </thead>

        <tbody>
          {
            tableData.map((r, ii) => (
              <tr
                key = {`dr${ii}`}
              >
                {
                  r.map((c, jj) => getCell(ii, jj))
                }
              </tr>
            ))
          }
        </tbody>
      </table>

    </div>

  )
}
